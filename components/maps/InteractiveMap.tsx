"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import dynamic from "next/dynamic"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapControls } from "./MapControls"
import { MapLegend } from "./MapLegend"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, MapPin as MapPinIcon, AlertTriangle } from "lucide-react"
import type { Incident, MapView, TileLayer as TileLayerType } from "@/lib/types/map"
import { cn } from "@/lib/utils"

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

interface InteractiveMapProps {
  incidents: Incident[]
  onIncidentClick: (id: string) => void
  center?: [number, number]
  zoom?: number
  className?: string
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
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z"
            fill="${colors[priority]}"
            stroke="${isActive ? "#ffffff" : "rgba(0,0,0,0.3)"}"
            stroke-width="${isActive ? "3" : "1"}"/>
      <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
      ${isActive ? '<circle cx="16" cy="16" r="8" fill="none" stroke="white" stroke-width="2" opacity="0.6"/>' : ''}
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

  useEffect(() => {
    // Dinamicamente importar leaflet.heat apenas no cliente
    if (typeof window !== "undefined") {
      let heatLayer: any = null

      import("leaflet.heat").then((module) => {
        // leaflet.heat usa export default, mas pode vir como module ou module.default
        const heat = module.default || module

        const points = incidents.map((inc) => [
          inc.lat,
          inc.lng,
          inc.priority === "high" ? 1.0 : inc.priority === "medium" ? 0.6 : 0.3,
        ]) as [number, number, number][]

        // @ts-ignore - leaflet.heat extension
        heatLayer = (L as any).heatLayer(points, {
          minOpacity: 0.4,
          maxZoom: 18,
          radius: 25,
          blur: 30,
          gradient: {
            0.0: "blue",
            0.3: "cyan",
            0.5: "lime",
            0.7: "yellow",
            0.9: "orange",
            1.0: "red",
          },
        }).addTo(map)
      }).catch((error) => {
        console.error("Erro ao carregar leaflet.heat:", error)
      })

      return () => {
        if (heatLayer && map) {
          try {
            map.removeLayer(heatLayer)
          } catch (e) {
            console.warn("Erro ao remover heatLayer:", e)
          }
        }
      }
    }
  }, [map, incidents])

  return null
}

/**
 * Componente para auto-ajustar bounds do mapa
 */
function MapBoundsHandler({ incidents }: { incidents: Incident[] }) {
  const map = useMap()

  useEffect(() => {
    if (incidents.length > 0) {
      const bounds = L.latLngBounds(incidents.map((inc) => [inc.lat, inc.lng]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, incidents])

  return null
}

/**
 * Componente principal do mapa interativo
 * Usa React-Leaflet para renderizar mapa real com múltiplas funcionalidades
 */
export function InteractiveMap({
  incidents,
  onIncidentClick,
  center = [-8.76077, -63.8999], // Porto Velho coordinates
  zoom = 12,
  className,
}: InteractiveMapProps) {
  const [viewMode, setViewMode] = useState<MapView>("markers")
  const [tileLayer, setTileLayer] = useState<TileLayerType>("osm")
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Garantir que o componente só renderize no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // URLs das tile layers
  const tileLayerUrls = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "carto-light": "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    "carto-dark": "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  }

  // Estatísticas para a legenda
  const legendItems = useMemo(() => {
    const highPriority = incidents.filter((i) => i.priority === "high").length
    const mediumPriority = incidents.filter((i) => i.priority === "medium").length
    const lowPriority = incidents.filter((i) => i.priority === "low").length

    return [
      { label: "Alta Prioridade", color: "#ef4444", count: highPriority },
      { label: "Média Prioridade", color: "#f59e0b", count: mediumPriority },
      { label: "Baixa Prioridade", color: "#10b981", count: lowPriority },
    ]
  }, [incidents])

  const handleMarkerClick = useCallback(
    (incidentId: string) => {
      setSelectedIncident(incidentId)
      onIncidentClick(incidentId)
    },
    [onIncidentClick]
  )

  if (!isClient) {
    return (
      <div className={cn("h-[500px] w-full rounded-lg border border-border bg-muted flex items-center justify-center", className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative h-[500px] w-full rounded-lg overflow-hidden border border-border", className)}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={false}
        scrollWheelZoom={true}
      >
        {/* Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tileLayerUrls[tileLayer]}
        />

        {/* Heatmap Layer */}
        {viewMode === "heat" && <HeatmapLayer incidents={incidents} />}

        {/* Marker Layer */}
        {(viewMode === "markers" || viewMode === "clusters") &&
          incidents.map((incident) => (
            <Marker
              key={incident.id}
              position={[incident.lat, incident.lng]}
              icon={createCustomIcon(incident.priority, selectedIncident === incident.id)}
              eventHandlers={{
                click: () => handleMarkerClick(incident.id),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[250px]">
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
                      <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{incident.type}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{incident.address || "Endereço não disponível"}</span>
                    </div>

                    {incident.timestamp && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{incident.timestamp}</span>
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
                    variant="outline"
                    className="w-full mt-3 h-7 text-xs"
                    onClick={() => handleMarkerClick(incident.id)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Auto-ajustar bounds */}
        <MapBoundsHandler incidents={incidents} />
      </MapContainer>

      {/* Controls */}
      <MapControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        tileLayer={tileLayer}
        onTileLayerChange={setTileLayer}
      />

      {/* Legend */}
      <MapLegend items={legendItems} title="Prioridades" position="bottom-right" />

      {/* Info Card */}
      <Card className="absolute bottom-4 left-4 z-[1000] shadow-lg backdrop-blur-sm bg-card/95 p-3 max-w-xs">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPinIcon className="h-4 w-4" />
          <span>
            <strong>{incidents.length}</strong> ocorrências ativas
          </span>
        </div>
        {viewMode === "heat" && (
          <p className="text-xs text-muted-foreground mt-1">
            Áreas em vermelho indicam maior densidade de ocorrências
          </p>
        )}
      </Card>
    </div>
  )
}

// Export com dynamic loading para evitar SSR issues
export default dynamic(() => Promise.resolve(InteractiveMap), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-lg border border-border bg-muted flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Carregando mapa...</p>
      </div>
    </div>
  ),
})
