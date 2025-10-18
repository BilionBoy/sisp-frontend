"use client"

import { useState } from "react"
import { Navigation, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RouteMapProps {
  selectedRoute: string | null
  onRouteClick: (id: string) => void
}

interface RoutePoint {
  x: number
  y: number
}

interface PatrolRoute {
  id: string
  vehicle: string
  color: string
  points: RoutePoint[]
  status: "active" | "completed" | "planned"
  priority: number
}

export function RouteMap({ selectedRoute, onRouteClick }: RouteMapProps) {
  const [viewMode, setViewMode] = useState<"all" | "optimized">("all")

  const routes: PatrolRoute[] = [
    {
      id: "RT-001",
      vehicle: "Viatura 12",
      color: "#3b82f6",
      points: [
        { x: 20, y: 30 },
        { x: 35, y: 25 },
        { x: 45, y: 35 },
        { x: 50, y: 50 },
        { x: 40, y: 60 },
      ],
      status: "active",
      priority: 1,
    },
    {
      id: "RT-002",
      vehicle: "Viatura 08",
      color: "#10b981",
      points: [
        { x: 60, y: 20 },
        { x: 70, y: 30 },
        { x: 75, y: 45 },
        { x: 70, y: 60 },
        { x: 60, y: 70 },
      ],
      status: "active",
      priority: 2,
    },
    {
      id: "RT-003",
      vehicle: "Viatura 15",
      color: "#f59e0b",
      points: [
        { x: 25, y: 70 },
        { x: 35, y: 75 },
        { x: 50, y: 80 },
        { x: 65, y: 75 },
        { x: 75, y: 70 },
      ],
      status: "active",
      priority: 3,
    },
  ]

  // High-risk zones
  const riskZones = [
    { x: 40, y: 40, radius: 80, intensity: 0.6, label: "Centro" },
    { x: 70, y: 50, radius: 60, intensity: 0.4, label: "Zona Leste" },
  ]

  const generatePathD = (points: RoutePoint[]) => {
    if (points.length === 0) return ""
    const start = points[0]
    let path = `M ${start.x} ${start.y}`

    for (let i = 1; i < points.length; i++) {
      const curr = points[i]
      const prev = points[i - 1]
      const midX = (prev.x + curr.x) / 2
      const midY = (prev.y + curr.y) / 2
      path += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`
      if (i === points.length - 1) {
        path += ` T ${curr.x} ${curr.y}`
      }
    }

    return path
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant={viewMode === "all" ? "default" : "outline"} size="sm" onClick={() => setViewMode("all")}>
            Todas as Rotas
          </Button>
          <Button
            variant={viewMode === "optimized" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("optimized")}
          >
            Rotas Otimizadas
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-xs text-muted-foreground">Zonas de Risco</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[500px] w-full overflow-hidden rounded-lg border border-border bg-muted">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid-route" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-border" />
            </pattern>

            {riskZones.map((zone, i) => (
              <radialGradient key={i} id={`risk-${i}`} cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={zone.intensity} />
                <stop offset="70%" stopColor="rgb(251, 146, 60)" stopOpacity={zone.intensity * 0.3} />
                <stop offset="100%" stopColor="rgb(251, 146, 60)" stopOpacity="0" />
              </radialGradient>
            ))}

            {/* Arrow marker for route direction */}
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
            </marker>
          </defs>

          {/* Grid Background */}
          <rect width="100" height="100" fill="url(#grid-route)" />

          {/* Risk Zones */}
          {riskZones.map((zone, i) => (
            <g key={i}>
              <circle cx={zone.x} cy={zone.y} r={zone.radius / 10} fill={`url(#risk-${i})`} />
              <text
                x={zone.x}
                y={zone.y}
                textAnchor="middle"
                className="text-[3px] fill-destructive font-semibold"
                style={{ fontSize: "3px" }}
              >
                {zone.label}
              </text>
            </g>
          ))}

          {/* Routes */}
          {routes.map((route) => (
            <g
              key={route.id}
              className={cn(
                "cursor-pointer transition-opacity",
                selectedRoute && selectedRoute !== route.id && "opacity-30",
              )}
              onClick={() => onRouteClick(route.id)}
            >
              {/* Route Path */}
              <path
                d={generatePathD(route.points)}
                fill="none"
                stroke={route.color}
                strokeWidth="0.8"
                strokeDasharray={route.status === "planned" ? "2,2" : "none"}
                markerEnd="url(#arrowhead)"
                className="transition-all hover:stroke-[1.2]"
                style={{ stroke: route.color }}
              />

              {/* Route Points */}
              {route.points.map((point, i) => (
                <g key={i}>
                  <circle cx={point.x} cy={point.y} r="1.5" fill={route.color} className="animate-pulse" />
                  {i === 0 && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="2.5"
                      fill="none"
                      stroke={route.color}
                      strokeWidth="0.5"
                      opacity="0.5"
                    />
                  )}
                </g>
              ))}

              {/* Vehicle Position (last point) */}
              {route.status === "active" && (
                <g>
                  <circle
                    cx={route.points[route.points.length - 1].x}
                    cy={route.points[route.points.length - 1].y}
                    r="2"
                    fill={route.color}
                  >
                    <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-card/90 p-3 backdrop-blur">
          <div className="space-y-2">
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => onRouteClick(route.id)}
                className={cn(
                  "flex items-center gap-2 text-xs transition-opacity hover:opacity-100",
                  selectedRoute && selectedRoute !== route.id && "opacity-50",
                )}
              >
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: route.color }} />
                <span className="text-foreground font-medium">{route.vehicle}</span>
                <Badge variant="outline" className="text-xs">
                  {route.status === "active" ? "Ativa" : route.status === "completed" ? "Concluída" : "Planejada"}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="absolute top-4 right-4 rounded-lg border border-border bg-card/90 p-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs font-semibold text-foreground">Cobertura em Tempo Real</p>
              <p className="text-xs text-muted-foreground">{routes.length} rotas ativas</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/20 p-2">
            <Navigation className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Sugestão de Otimização IA</p>
            <p className="text-sm text-muted-foreground mt-1">
              Redirecionar Viatura 15 para Zona Norte pode reduzir tempo de resposta em 23% e melhorar cobertura do
              setor em 15%.
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm">Aplicar Sugestão</Button>
              <Button variant="outline" size="sm">
                Ver Detalhes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
