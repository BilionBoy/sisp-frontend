"use client"

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, CircleMarker } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { AdvancedMapControls } from "./AdvancedMapControls"
import { MapLegend } from "./MapLegend"
import { MarkerClusterLayer } from "./MarkerClusterLayer"
import { CanvasMarkerLayer } from "./CanvasMarkerLayer"
import { ViewportAwareMarkers } from "./ViewportAwareMarkers"
import { CameraMarker } from "@/components/cameras/camera-marker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, MapPin as MapPinIcon, AlertTriangle, Navigation } from "lucide-react"
import type { Incident, MapView, TileLayer as TileLayerType } from "@/lib/types/map"
import type { Camera } from "@/lib/types/camera"
import { cn } from "@/lib/utils"
import { useFullscreen } from "@/lib/contexts/fullscreen-context"

// Fix for default marker icon in Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  })
}

interface EnhancedInteractiveMapProps {
  incidents: Incident[]
  cameras?: Camera[]
  onIncidentClick?: (id: string) => void
  onCameraClick?: (cameraId: number) => void
  onMapRightClick?: (lat: number, lng: number) => void
  center?: [number, number]
  zoom?: number
  className?: string
  showSearch?: boolean
  showAdvancedControls?: boolean
  showLegend?: boolean
  showCameras?: boolean
  height?: string
  useViewportRendering?: boolean
  useCanvasRendering?: boolean
}

/**
 * Custom icons para diferentes prioridades
 */
const createCustomIcon = (priority: "high" | "medium" | "low", isActive: boolean = false) => {
  const colors = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#10b981",
  }

  const svgIcon = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z"
            fill="${colors[priority]}"
            stroke="${isActive ? "#ffffff" : "rgba(0,0,0,0.3)"}"
            stroke-width="${isActive ? "3" : "1.5"}"
            filter="url(#shadow)"/>
      <circle cx="16" cy="16" r="6" fill="white" opacity="0.95"/>
      ${isActive ? `
        <circle cx="16" cy="16" r="8" fill="none" stroke="white" stroke-width="2" opacity="0.8">
          <animate attributeName="r" from="8" to="12" dur="1s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite"/>
        </circle>
      ` : ''}
    </svg>
  `

  return L.divIcon({
    html: svgIcon,
    className: `custom-marker-icon ${isActive ? "active" : ""}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

/**
 * Componente para gerenciar heatmap layer
 */
function HeatmapLayer({ incidents }: { incidents: Incident[] }) {
  const map = useMap()
  const heatLayerRef = useRef<any>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    // Marcar como montado
    isMountedRef.current = true

    // Cleanup anterior se existir
    if (heatLayerRef.current && map) {
      try {
        map.removeLayer(heatLayerRef.current)
        heatLayerRef.current = null
      } catch (e) {
        console.warn("Erro ao remover heatLayer anterior:", e)
      }
    }

    // Dinamicamente importar leaflet.heat apenas no cliente
    if (typeof window !== "undefined") {
      import("leaflet.heat").then((module) => {
        // IMPORTANTE: Verificar se componente ainda está montado
        // A importação é assíncrona, então o componente pode ter sido
        // desmontado enquanto a Promise estava resolvendo
        if (!isMountedRef.current) {
          return // NÃO adicionar layer se componente foi desmontado
        }

        // leaflet.heat usa export default, mas pode vir como module ou module.default
        const heat = module.default || module

        const points = incidents.map((inc) => [
          inc.lat,
          inc.lng,
          inc.priority === "high" ? 1.0 : inc.priority === "medium" ? 0.6 : 0.3,
        ]) as [number, number, number][]

        // @ts-ignore - leaflet.heat extension
        heatLayerRef.current = (L as any).heatLayer(points, {
          minOpacity: 0.5,
          maxZoom: 18,
          radius: 30,
          blur: 35,
          gradient: {
            0.0: "#3b82f6",  // blue
            0.3: "#22c55e",  // green
            0.5: "#eab308",  // yellow
            0.7: "#f97316",  // orange
            0.9: "#ef4444",  // red
            1.0: "#dc2626",  // dark red
          },
        }).addTo(map)
      }).catch((error) => {
        console.error("Erro ao carregar leaflet.heat:", error)
      })
    }

    // Cleanup function - sempre executado quando componente é desmontado
    return () => {
      // Marcar como desmontado IMEDIATAMENTE
      isMountedRef.current = false

      if (heatLayerRef.current && map) {
        try {
          map.removeLayer(heatLayerRef.current)
          heatLayerRef.current = null
        } catch (e) {
          console.warn("Erro ao remover heatLayer:", e)
        }
      }
    }
  }, [map, incidents])

  return null
}

/**
 * Componente para clustering de markers
 */
function ClusterLayer({ incidents, onIncidentClick, selectedIncident }: {
  incidents: Incident[]
  onIncidentClick?: (id: string) => void
  selectedIncident: string | null
}) {
  const map = useMap()
  const [clusters, setClusters] = useState<Array<{
    lat: number
    lng: number
    count: number
    incidents: Incident[]
  }>>([])

  useEffect(() => {
    // Implementação simplificada de clustering
    // Em produção, usar leaflet.markercluster
    const zoom = map.getZoom()
    const clusterRadius = zoom > 14 ? 0.001 : zoom > 12 ? 0.005 : 0.01

    const clustered: typeof clusters = []
    const used = new Set<string>()

    incidents.forEach(incident => {
      if (used.has(incident.id)) return

      const nearby = incidents.filter(inc => {
        if (used.has(inc.id)) return false
        const distance = Math.sqrt(
          Math.pow(inc.lat - incident.lat, 2) +
          Math.pow(inc.lng - incident.lng, 2)
        )
        return distance < clusterRadius
      })

      if (nearby.length > 1) {
        const avgLat = nearby.reduce((sum, inc) => sum + inc.lat, 0) / nearby.length
        const avgLng = nearby.reduce((sum, inc) => sum + inc.lng, 0) / nearby.length

        clustered.push({
          lat: avgLat,
          lng: avgLng,
          count: nearby.length,
          incidents: nearby,
        })

        nearby.forEach(inc => used.add(inc.id))
      } else {
        clustered.push({
          lat: incident.lat,
          lng: incident.lng,
          count: 1,
          incidents: [incident],
        })
        used.add(incident.id)
      }
    })

    setClusters(clustered)
  }, [incidents, map])

  return (
    <>
      {clusters.map((cluster, index) => {
        if (cluster.count === 1) {
          const incident = cluster.incidents[0]
          return (
            <Marker
              key={incident.id}
              position={[incident.lat, incident.lng]}
              icon={createCustomIcon(incident.priority, selectedIncident === incident.id)}
              eventHandlers={{
                click: () => onIncidentClick?.(incident.id),
              }}
            >
              <Popup>
                <IncidentPopupContent incident={incident} onViewDetails={() => onIncidentClick?.(incident.id)} />
              </Popup>
            </Marker>
          )
        }

        // Cluster marker
        const highPriority = cluster.incidents.filter(i => i.priority === "high").length
        const color = highPriority > cluster.count / 2 ? "#ef4444" : highPriority > 0 ? "#f59e0b" : "#10b981"

        return (
          <CircleMarker
            key={`cluster-${index}`}
            center={[cluster.lat, cluster.lng]}
            radius={Math.min(10 + cluster.count * 2, 40)}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.7,
              color: "white",
              weight: 3,
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-2">
                  Cluster - {cluster.count} ocorrências
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {cluster.incidents.map((incident) => (
                    <Button
                      key={incident.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs h-auto py-1"
                      onClick={() => onIncidentClick?.(incident.id)}
                    >
                      <Badge
                        variant={incident.priority === "high" ? "destructive" : incident.priority === "medium" ? "default" : "secondary"}
                        className="mr-2 text-[10px]"
                      >
                        {incident.id}
                      </Badge>
                      <span className="truncate">{incident.type}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </>
  )
}

/**
 * Componente de conteúdo do popup
 */
function IncidentPopupContent({ incident, onViewDetails }: { incident: Incident; onViewDetails: () => void }) {
  return (
    <div className="p-2 bg-background border-2 min-w-[250px]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm">{incident.id}</h3>
        <Badge
          variant={
            incident.priority === "high"
              ? "destructive"
              : incident.priority === "medium"
                ? "default"
                : "secondary"
          }
          className="text-xs"
        >
          {incident.priority === "high" ? "Alta" : incident.priority === "medium" ? "Média" : "Baixa"}
        </Badge>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground">{incident.type}</span>
        </div>

        {incident.address && (
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{incident.address}</span>
          </div>
        )}

        {incident.timestamp && (
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{incident.timestamp}</span>
          </div>
        )}

        {incident.zone && (
          <div className="flex items-center gap-2">
            <Navigation className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{incident.zone}</span>
          </div>
        )}

        <Badge variant="outline" className="text-xs mt-2">
          {incident.status}
        </Badge>

        {/* Dados Socioeconômicos do Bairro */}
        {incident.bairro && incident.bairroData && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="font-semibold text-xs mb-2 text-foreground">
              📍 {incident.bairro} - {incident.zone}
            </p>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px]">População:</span>
                <span className="font-medium">{incident.bairroData.populacao.toLocaleString('pt-BR')}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px]">Índice Socioecon.:</span>
                <span className="font-medium">{incident.bairroData.indiceSocioeconomico.toFixed(1)}/10</span>
              </div>

              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px]">Iluminação:</span>
                <span className="font-medium">{incident.bairroData.iluminacaoPublica.toFixed(1)}/10</span>
              </div>

              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px]">Policiamento:</span>
                <span className="font-medium">{incident.bairroData.presencaPolicial.toFixed(1)}/10</span>
              </div>

              <div className="flex flex-col col-span-2">
                <span className="text-muted-foreground text-[10px]">Taxa Criminalidade:</span>
                <span className="font-medium text-destructive">
                  {incident.bairroData.taxaCriminalidade.toFixed(2)} crimes/100k hab
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        size="sm"
        variant="default"
        className="w-full mt-3 h-7 text-xs"
        onClick={onViewDetails}
      >
        Ver Detalhes Completos
      </Button>
    </div>
  )
}

/**
 * Componente para auto-ajustar bounds do mapa
 */
function MapBoundsHandler({ incidents, shouldFit }: { incidents: Incident[]; shouldFit: boolean }) {
  const map = useMap()

  useEffect(() => {
    if (shouldFit && incidents.length > 0) {
      const bounds = L.latLngBounds(incidents.map((inc) => [inc.lat, inc.lng]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    }
  }, [map, incidents, shouldFit])

  return null
}

/**
 * Componente para controlar navegação do mapa
 */
function MapNavigationController({
  targetPosition,
  onNavigationComplete,
}: {
  targetPosition: [number, number, number] | null
  onNavigationComplete: () => void
}) {
  const map = useMap()

  useEffect(() => {
    if (targetPosition) {
      const [lat, lng, zoom] = targetPosition
      map.flyTo([lat, lng], zoom, {
        duration: 1.5,
      })
      setTimeout(onNavigationComplete, 1500)
    }
  }, [targetPosition, map, onNavigationComplete])

  return null
}

/**
 * Componente para gerenciar clique direito no mapa
 */
function MapContextMenuHandler({
  onRightClick,
}: {
  onRightClick?: (lat: number, lng: number) => void
}) {
  const map = useMap()

  useEffect(() => {
    if (!onRightClick) return

    const handleContextMenu = (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault() // Previne o menu padrão do navegador
      onRightClick(e.latlng.lat, e.latlng.lng)
    }

    map.on('contextmenu', handleContextMenu)

    return () => {
      map.off('contextmenu', handleContextMenu)
    }
  }, [map, onRightClick])

  return null
}

/**
 * Componente principal do mapa interativo melhorado
 */
export function EnhancedInteractiveMap({
  incidents,
  cameras = [],
  onIncidentClick,
  onCameraClick,
  onMapRightClick,
  center = [-8.76077, -63.8999],
  zoom = 12,
  className,
  showSearch = true,
  showAdvancedControls = true,
  showLegend = true,
  showCameras = true,
  height = "600px",
  useViewportRendering = true,
  useCanvasRendering = false,
}: EnhancedInteractiveMapProps) {
  const safeIncidents = Array.isArray(incidents) ? incidents : []
  const safeCameras = Array.isArray(cameras) ? cameras : []

  const [viewMode, setViewMode] = useState<MapView>("markers")
  const [tileLayer, setTileLayer] = useState<TileLayerType>("osm")
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null)
  const [shouldFitBounds, setShouldFitBounds] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Usar contexto de fullscreen ao invés de estado local
  const { isFullscreen, setFullscreen } = useFullscreen()

  // Garantir que o componente só renderize no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Listener para tecla ESC sair do fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setFullscreen(false)
      }
    }

    if (isFullscreen) {
      // Adicionar event listener para ESC
      window.addEventListener("keydown", handleEscape)

      // Prevenir scroll da página quando em fullscreen
      document.body.style.overflow = "hidden"

      return () => {
        window.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = ""
      }
    }
  }, [isFullscreen, setFullscreen])

  // URLs das tile layers
  const tileLayerUrls = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "carto-light": "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    "carto-dark": "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  }

  // Estatísticas para a legenda
  const legendItems = useMemo(() => {
    const highPriority = safeIncidents.filter((i) => i.priority === "high").length
    const mediumPriority = safeIncidents.filter((i) => i.priority === "medium").length
    const lowPriority = safeIncidents.filter((i) => i.priority === "low").length

    return [
      { label: "Alta Prioridade", color: "#ef4444", count: highPriority },
      { label: "Média Prioridade", color: "#f59e0b", count: mediumPriority },
      { label: "Baixa Prioridade", color: "#10b981", count: lowPriority },
    ]
  }, [safeIncidents])

  const handleMarkerClick = useCallback(
    (incidentId: string) => {
      setSelectedIncident(incidentId)
      onIncidentClick?.(incidentId)
    },
    [onIncidentClick]
  )

  const handleCameraClick = useCallback(
    (cameraId: number) => {
      setSelectedCameraId(cameraId)
      onCameraClick?.(cameraId)
    },
    [onCameraClick]
  )

  const handleToggleFullscreen = useCallback(() => {
    setFullscreen(!isFullscreen)
  }, [isFullscreen, setFullscreen])

  const handleResetView = useCallback(() => {
    setShouldFitBounds(true)
    setTimeout(() => setShouldFitBounds(false), 100)
  }, [])

  const handleSelectLocation = useCallback((lat: number, lng: number, zoomLevel: number = 16) => {
    setTargetPosition([lat, lng, zoomLevel])
  }, [])

  if (!isClient) {
    return (
      <div
        className={cn("w-full rounded-lg border border-border bg-muted flex items-center justify-center", className)}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando mapa interativo...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full rounded-lg overflow-hidden border border-border",
        isFullscreen && "!fixed inset-0 !z-[999] !rounded-none !border-0 !m-0",
        className
      )}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={tileLayerUrls[tileLayer]}
        />

        {/* Heatmap Layer */}
        {viewMode === "heat" && <HeatmapLayer incidents={safeIncidents} />}

        {/* Cluster Layer */}
        {viewMode === "clusters" && (
          <MarkerClusterLayer
            incidents={safeIncidents}
            onIncidentClick={handleMarkerClick}
            createCustomIcon={createCustomIcon}
            selectedIncident={selectedIncident}
          />
        )}

        {/* Marker Layer */}
        {viewMode === "markers" && (
          <>
            {useCanvasRendering ? (
              <CanvasMarkerLayer
                incidents={safeIncidents}
                onIncidentClick={handleMarkerClick}
                selectedIncident={selectedIncident}
              />
            ) : useViewportRendering ? (
              <ViewportAwareMarkers
                incidents={safeIncidents}
                onIncidentClick={handleMarkerClick}
                createCustomIcon={createCustomIcon}
                selectedIncident={selectedIncident}
                renderPopupContent={(incident) => (
                  <IncidentPopupContent incident={incident} onViewDetails={() => handleMarkerClick(incident.id)} />
                )}
              />
            ) : (
              safeIncidents.map((incident) => (
                <Marker
                  key={incident.id}
                  position={[incident.lat, incident.lng]}
                  icon={createCustomIcon(incident.priority, selectedIncident === incident.id)}
                  eventHandlers={{
                    click: () => handleMarkerClick(incident.id),
                  }}
                >
                  <Popup className="p-3">
                    <IncidentPopupContent incident={incident} onViewDetails={() => handleMarkerClick(incident.id)} />
                  </Popup>
                </Marker>
              ))
            )}
          </>
        )}

        {/* Camera Markers - Always visible when showCameras is true */}
        {showCameras && safeCameras.map((camera) => (
          <CameraMarker
            key={`camera-${camera.id}`}
            camera={camera}
            onCameraClick={handleCameraClick}
            isSelected={selectedCameraId === camera.id}
          />
        ))}

        {/* Auto-ajustar bounds */}
        <MapBoundsHandler incidents={safeIncidents} shouldFit={shouldFitBounds} />

        {/* Navigation Controller */}
        <MapNavigationController
          targetPosition={targetPosition}
          onNavigationComplete={() => setTargetPosition(null)}
        />

        {/* Context Menu Handler (Right Click) */}
        <MapContextMenuHandler onRightClick={onMapRightClick} />
      </MapContainer>

      {/* Advanced Controls */}
      {showAdvancedControls && (
        <AdvancedMapControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          tileLayer={tileLayer}
          onTileLayerChange={setTileLayer}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onResetView={handleResetView}
          incidentCount={safeIncidents.length}
        />
      )}

      {/* Search */}
      

      {/* Legend */}
      {showLegend && (
        <MapLegend
          items={legendItems}
          title="Prioridades"
          position="bottom-right"
        />
      )}

     
    </div>
  )
}

// Export com dynamic loading para evitar SSR issues
export default dynamic(() => Promise.resolve(EnhancedInteractiveMap), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-lg border border-border bg-muted flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Carregando mapa interativo...</p>
      </div>
    </div>
  ),
})
