"use client"

import React from "react"
import { Layers, Maximize2, Search, Ruler, MapPin, Zap, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { MapView, TileLayer } from "@/lib/types/map"

interface MapControlsProps {
  viewMode: MapView
  onViewModeChange: (mode: MapView) => void
  tileLayer: TileLayer
  onTileLayerChange: (layer: TileLayer) => void
  onToggleFullscreen?: () => void
  onToggleMeasure?: () => void
  showClusters?: boolean
  onToggleClusters?: () => void
  className?: string
}

/**
 * Componente de controles para o mapa interativo
 * Permite alternar entre visualizações, camadas e ferramentas
 */
export function MapControls({
  viewMode,
  onViewModeChange,
  tileLayer,
  onTileLayerChange,
  onToggleFullscreen,
  onToggleMeasure,
  showClusters = false,
  onToggleClusters,
  className,
}: MapControlsProps) {
  const viewModeButtons = [
    { mode: "heat" as MapView, icon: Zap, label: "Mapa de Calor" },
    { mode: "markers" as MapView, icon: MapPin, label: "Marcadores" },
    { mode: "clusters" as MapView, icon: Grid3X3, label: "Clusters" },
  ]

  const tileLayers = [
    { id: "osm" as TileLayer, name: "OpenStreetMap" },
    { id: "carto-light" as TileLayer, name: "CARTO Light" },
    { id: "carto-dark" as TileLayer, name: "CARTO Dark" },
    { id: "satellite" as TileLayer, name: "Satélite" },
  ]

  return (
    <Card className={cn("absolute top-4 left-4 z-[1000] p-2 shadow-lg backdrop-blur-sm bg-card/95", className)}>
      <div className="flex flex-col gap-2">
        {/* View Mode Controls */}
        <div className="flex gap-1">
          {viewModeButtons.map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange(mode)}
              title={label}
              className="h-8 w-8 p-0"
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{label}</span>
            </Button>
          ))}
        </div>

        <div className="h-px bg-border" />

        {/* Layer and Tool Controls */}
        <div className="flex gap-1">
          {/* Tile Layer Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" title="Camadas do Mapa" className="h-8 w-8 p-0">
                <Layers className="h-4 w-4" />
                <span className="sr-only">Camadas do Mapa</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Camadas Base</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tileLayers.map((layer) => (
                <DropdownMenuCheckboxItem
                  key={layer.id}
                  checked={tileLayer === layer.id}
                  onCheckedChange={() => onTileLayerChange(layer.id)}
                >
                  {layer.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullscreen}
              title="Tela Cheia"
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">Tela Cheia</span>
            </Button>
          )}

          {/* Measure Tool */}
          {onToggleMeasure && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMeasure}
              title="Medir Distância"
              className="h-8 w-8 p-0"
            >
              <Ruler className="h-4 w-4" />
              <span className="sr-only">Medir Distância</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
