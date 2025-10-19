import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Incident } from '@/lib/types/map'

interface CanvasMarkerLayerProps {
  incidents: Incident[]
  onIncidentClick?: (id: string) => void
  selectedIncident: string | null
}

export function CanvasMarkerLayer({
  incidents,
  onIncidentClick,
  selectedIncident
}: CanvasMarkerLayerProps) {
  const map = useMap()

  useEffect(() => {
    const canvasRenderer = L.canvas({ padding: 0.5 })
    const markers: L.CircleMarker[] = []

    incidents.forEach(incident => {
      const color = incident.priority === 'high' ? '#ef4444' :
                   incident.priority === 'medium' ? '#f59e0b' : '#10b981'

      const isSelected = selectedIncident === incident.id

      const marker = L.circleMarker([incident.lat, incident.lng], {
        renderer: canvasRenderer,
        radius: isSelected ? 10 : 8,
        fillColor: color,
        fillOpacity: isSelected ? 1 : 0.8,
        color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.9)',
        weight: isSelected ? 3 : 2,
      })

      marker.bindPopup(`
        <div class="p-2 bg-background border-2 min-w-[250px]">
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-semibold text-sm">${incident.id}</h3>
            <span class="text-xs px-2 py-1 rounded ${
              incident.priority === 'high' ? 'bg-red-500 text-white' :
              incident.priority === 'medium' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
            }">${incident.priority === 'high' ? 'Alta' : incident.priority === 'medium' ? 'Média' : 'Baixa'}</span>
          </div>
          <div class="space-y-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">${incident.type}</span>
            </div>
            ${incident.address ? `<div class="flex items-start gap-2">
              <span class="text-muted-foreground">${incident.address}</span>
            </div>` : ''}
            ${incident.timestamp ? `<div class="flex items-center gap-2">
              <span class="text-muted-foreground">${incident.timestamp}</span>
            </div>` : ''}
            ${incident.zone ? `<div class="flex items-center gap-2">
              <span class="text-muted-foreground">${incident.zone}</span>
            </div>` : ''}
            <div class="mt-2">
              <span class="text-xs px-2 py-1 border rounded">${incident.status}</span>
            </div>
          </div>
        </div>
      `)

      marker.on('click', () => {
        if (onIncidentClick) {
          onIncidentClick(incident.id)
        }
      })

      marker.addTo(map)
      markers.push(marker)
    })

    return () => {
      markers.forEach(m => m.remove())
    }
  }, [map, incidents, selectedIncident, onIncidentClick])

  return null
}
