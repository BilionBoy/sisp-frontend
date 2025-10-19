import { useEffect, useRef, useMemo, useCallback } from 'react'
import { useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import type { Incident } from '@/lib/types/map'

interface OptimizedCanvasMarkerLayerProps {
  incidents: Incident[]
  onIncidentClick?: (id: string) => void
  selectedIncident: string | null
}

/**
 * Componente OTIMIZADO de markers em Canvas com viewport filtering
 *
 * OTIMIZAÇÕES:
 * 1. Viewport filtering: Renderiza apenas markers visíveis na tela
 * 2. Lazy updates: Só atualiza quando o mapa para de mover
 * 3. Incremental rendering: Não remove/recria todos markers, só os que mudaram
 * 4. Memoization: Evita recalcular dados desnecessariamente
 * 5. Debounce: Aguarda 200ms após movimento para atualizar
 */
export function OptimizedCanvasMarkerLayer({
  incidents,
  onIncidentClick,
  selectedIncident
}: OptimizedCanvasMarkerLayerProps) {
  const map = useMap()
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map())
  const canvasRendererRef = useRef<L.Canvas | null>(null)
  const updateTimeoutRef = useRef<NodeJS.Timeout>()

  // Criar canvas renderer uma única vez
  useEffect(() => {
    if (!canvasRendererRef.current) {
      canvasRendererRef.current = L.canvas({ padding: 0.5 })
    }
  }, [])

  // Função para obter bounds visíveis com padding
  const getVisibleBounds = useCallback(() => {
    const bounds = map.getBounds()
    // Padding de 20% para pré-carregar markers próximos
    return bounds.pad(0.2)
  }, [map])

  // Filtrar incidents visíveis no viewport
  const visibleIncidents = useMemo(() => {
    try {
      const bounds = getVisibleBounds()
      return incidents.filter(inc => {
        return bounds.contains([inc.lat, inc.lng])
      })
    } catch {
      // Se bounds não estiver disponível, retornar todos (fallback)
      return incidents
    }
  }, [incidents, getVisibleBounds])

  // Função para criar ou atualizar um marker
  const createOrUpdateMarker = useCallback((incident: Incident) => {
    if (!canvasRendererRef.current) return

    const existingMarker = markersRef.current.get(incident.id)
    const isSelected = selectedIncident === incident.id

    const color = incident.priority === 'high' ? '#ef4444' :
                 incident.priority === 'medium' ? '#f59e0b' : '#10b981'

    // Se marker já existe, apenas atualizar estilo se necessário
    if (existingMarker) {
      existingMarker.setStyle({
        radius: isSelected ? 10 : 8,
        fillColor: color,
        fillOpacity: isSelected ? 1 : 0.8,
        color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.9)',
        weight: isSelected ? 3 : 2,
      })
      return existingMarker
    }

    // Criar novo marker
    const marker = L.circleMarker([incident.lat, incident.lng], {
      renderer: canvasRendererRef.current,
      radius: isSelected ? 10 : 8,
      fillColor: color,
      fillOpacity: isSelected ? 1 : 0.8,
      color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.9)',
      weight: isSelected ? 3 : 2,
    })

    // Popup simples (não criar HTML complexo para todos)
    marker.bindPopup(`
      <div class="p-2">
        <div class="font-semibold text-sm mb-1">${incident.id}</div>
        <div class="text-xs text-gray-600">${incident.type}</div>
        ${incident.address ? `<div class="text-xs mt-1">${incident.address}</div>` : ''}
      </div>
    `, {
      maxWidth: 250,
      className: 'custom-popup'
    })

    // Event listener (com useCallback para evitar recriar)
    marker.on('click', () => {
      if (onIncidentClick) {
        onIncidentClick(incident.id)
      }
    })

    marker.addTo(map)
    markersRef.current.set(incident.id, marker)

    return marker
  }, [map, selectedIncident, onIncidentClick])

  // Atualizar markers visíveis (com debounce)
  const updateVisibleMarkers = useCallback(() => {
    if (!canvasRendererRef.current) return

    // Limpar timeout anterior
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    // Debounce de 200ms
    updateTimeoutRef.current = setTimeout(() => {
      const visibleIds = new Set(visibleIncidents.map(inc => inc.id))
      const currentIds = new Set(markersRef.current.keys())

      // Remover markers que não estão mais visíveis
      currentIds.forEach(id => {
        if (!visibleIds.has(id)) {
          const marker = markersRef.current.get(id)
          if (marker) {
            marker.remove()
            markersRef.current.delete(id)
          }
        }
      })

      // Criar ou atualizar markers visíveis
      visibleIncidents.forEach(incident => {
        createOrUpdateMarker(incident)
      })
    }, 200) // 200ms debounce
  }, [visibleIncidents, createOrUpdateMarker])

  // Listener para movimento do mapa
  useMapEvents({
    moveend: updateVisibleMarkers,
    zoomend: updateVisibleMarkers,
  })

  // Atualizar quando selectedIncident muda (sem debounce)
  useEffect(() => {
    // Apenas atualizar estilos dos markers existentes
    markersRef.current.forEach((marker, id) => {
      const incident = incidents.find(inc => inc.id === id)
      if (incident) {
        const isSelected = selectedIncident === id
        const color = incident.priority === 'high' ? '#ef4444' :
                     incident.priority === 'medium' ? '#f59e0b' : '#10b981'

        marker.setStyle({
          radius: isSelected ? 10 : 8,
          fillColor: color,
          fillOpacity: isSelected ? 1 : 0.8,
          color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.9)',
          weight: isSelected ? 3 : 2,
        })
      }
    })
  }, [selectedIncident, incidents])

  // Renderização inicial e quando incidents mudam
  useEffect(() => {
    updateVisibleMarkers()
  }, [updateVisibleMarkers])

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current.clear()
    }
  }, [])

  return null
}
