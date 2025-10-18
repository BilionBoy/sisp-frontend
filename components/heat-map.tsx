"use client"

import { useState } from "react"
import { MapPin, Zap, AlertTriangle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface HeatMapProps {
  onIncidentClick: (id: string) => void
}

interface Incident {
  id: string
  lat: number
  lng: number
  type: string
  priority: "high" | "medium" | "low"
  status: string
}

export function HeatMap({ onIncidentClick }: HeatMapProps) {
  const [viewMode, setViewMode] = useState<"heat" | "markers">("heat")
  const [hoveredIncident, setHoveredIncident] = useState<string | null>(null)

  // Simulated incident data with coordinates
  const incidents: Incident[] = [
    { id: "OC-2847", lat: 35, lng: 45, type: "Furto", priority: "high", status: "Em Atendimento" },
    { id: "OC-2846", lat: 55, lng: 30, type: "Perturbação", priority: "medium", status: "Despachado" },
    { id: "OC-2845", lat: 70, lng: 60, type: "Acidente", priority: "high", status: "Resolvido" },
    { id: "OC-2844", lat: 25, lng: 70, type: "Suspeita", priority: "low", status: "Em Análise" },
    { id: "OC-2843", lat: 45, lng: 55, type: "Furto", priority: "medium", status: "Pendente" },
    { id: "OC-2842", lat: 60, lng: 40, type: "Vandalismo", priority: "low", status: "Resolvido" },
    { id: "OC-2841", lat: 40, lng: 25, type: "Roubo", priority: "high", status: "Em Atendimento" },
    { id: "OC-2840", lat: 50, lng: 65, type: "Perturbação", priority: "medium", status: "Despachado" },
  ]

  // Heat zones for visualization
  const heatZones = [
    { x: 40, y: 40, intensity: 0.8, radius: 120 },
    { x: 60, y: 50, intensity: 0.6, radius: 100 },
    { x: 30, y: 65, intensity: 0.4, radius: 80 },
  ]

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant={viewMode === "heat" ? "default" : "outline"} size="sm" onClick={() => setViewMode("heat")}>
            <Zap className="h-4 w-4 mr-2" />
            Mapa de Calor
          </Button>
          <Button
            variant={viewMode === "markers" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("markers")}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Marcadores
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Alta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Média</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">Baixa</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[500px] w-full overflow-hidden rounded-lg border border-border bg-muted">
        {/* Grid Background */}
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
            </pattern>
            {viewMode === "heat" &&
              heatZones.map((zone, i) => (
                <radialGradient key={i} id={`heat-${i}`} cx="50%" cy="50%">
                  <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={zone.intensity} />
                  <stop offset="50%" stopColor="rgb(251, 146, 60)" stopOpacity={zone.intensity * 0.5} />
                  <stop offset="100%" stopColor="rgb(251, 146, 60)" stopOpacity="0" />
                </radialGradient>
              ))}
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Heat Zones */}
          {viewMode === "heat" &&
            heatZones.map((zone, i) => (
              <circle
                key={i}
                cx={`${zone.x}%`}
                cy={`${zone.y}%`}
                r={zone.radius}
                fill={`url(#heat-${i})`}
                className="animate-pulse"
                style={{ animationDuration: "3s" }}
              />
            ))}
        </svg>

        {/* Incident Markers */}
        {incidents.map((incident) => (
          <button
            key={incident.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 focus:scale-125 focus:outline-none"
            style={{
              left: `${incident.lng}%`,
              top: `${incident.lat}%`,
            }}
            onClick={() => onIncidentClick(incident.id)}
            onMouseEnter={() => setHoveredIncident(incident.id)}
            onMouseLeave={() => setHoveredIncident(null)}
          >
            <div className="relative">
              <MapPin
                className={`h-6 w-6 ${
                  incident.priority === "high"
                    ? "text-destructive"
                    : incident.priority === "medium"
                      ? "text-amber-500"
                      : "text-chart-2"
                } drop-shadow-lg`}
                fill="currentColor"
              />
              {incident.status === "Em Atendimento" && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                </span>
              )}
            </div>

            {/* Hover Tooltip */}
            {hoveredIncident === incident.id && (
              <div className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-popover p-2 text-xs shadow-lg">
                <p className="font-semibold text-popover-foreground">{incident.id}</p>
                <p className="text-muted-foreground">{incident.type}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {incident.status}
                </Badge>
              </div>
            )}
          </button>
        ))}

        {/* Map Labels */}
        <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-card/90 p-3 backdrop-blur">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Clique nos marcadores para ver detalhes</span>
          </div>
        </div>

        {/* Coordinates Display */}
        <div className="absolute top-4 right-4 rounded-lg border border-border bg-card/90 p-2 backdrop-blur">
          <p className="text-xs font-mono text-muted-foreground">{incidents.length} ocorrências ativas</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-foreground">Zona de Alta Densidade</p>
            <p className="text-xs text-muted-foreground">Centro - 3 ocorrências nas últimas 2h</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Reforçar Patrulha
        </Button>
      </div>
    </div>
  )
}
