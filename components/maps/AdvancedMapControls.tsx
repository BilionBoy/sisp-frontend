"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Maximize,
  Minimize,
  Navigation,
  RotateCcw,
  Download,
  MapPin,
  Zap,
  Layers,
  Map as MapIcon,
  Satellite,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MapView, TileLayer } from "@/lib/types/map"

interface AdvancedMapControlsProps {
  viewMode: MapView
  onViewModeChange: (mode: MapView) => void
  tileLayer: TileLayer
  onTileLayerChange: (layer: TileLayer) => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  onResetView?: () => void
  onExportData?: () => void
  className?: string
  incidentCount?: number
}

/**
 * Controles avançados para o mapa interativo - Versão melhorada e responsiva
 */
export function AdvancedMapControls({
  viewMode,
  onViewModeChange,
  tileLayer,
  onTileLayerChange,
  isFullscreen = false,
  onToggleFullscreen,
  onResetView,
  onExportData,
  className,
  incidentCount,
}: AdvancedMapControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const viewModes: Array<{ value: MapView; label: string; icon: typeof MapPin; color: string }> = [
    { value: "markers", label: "Marcadores", icon: MapPin, color: "text-blue-500" },
    { value: "heat", label: "Calor", icon: Zap, color: "text-orange-500" },
    { value: "clusters", label: "Agrupamento", icon: Layers, color: "text-purple-500" },
  ]

  const tileLayers: Array<{
    value: TileLayer
    label: string
    icon: typeof MapIcon
    description: string
  }> = [
    { value: "osm", label: "Padrão", icon: MapIcon, description: "OpenStreetMap" },
    { value: "carto-light", label: "Claro", icon: Sun, description: "Tema claro" },
    { value: "carto-dark", label: "Escuro", icon: Moon, description: "Tema escuro" },
    { value: "satellite", label: "Satélite", icon: Satellite, description: "Imagens reais" },
  ]

  return (
    <Card className={cn(
      "absolute top-2 left-2 sm:left-4 md:top-24 z-[1000] shadow-xl backdrop-blur-md bg-card/98 border-2",
      "w-[calc(100vw-1rem)] sm:w-72 max-h-[calc(100vh-7rem)] md:max-h-[calc(100vh-7rem)] overflow-y-auto transition-all",
      className
    )}>
      <div className="p-3 sm:p-4 space-y-1 sm:space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="hidden sm:inline">Visualização</span>
              <span className="sm:hidden">Vis.</span>
            </h3>
            <div className="flex items-center gap-2">
              {incidentCount !== undefined && (
                <Badge variant="default" className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1">
                  {incidentCount}
                </Badge>
              )}
              {/* Botão de expandir/recolher para mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:hidden"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* View Mode Toggle - Sempre visível */}
        <div className="space-y-1">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Modo de Exibição</p>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {viewModes.map((mode) => {
              const Icon = mode.icon
              const isActive = viewMode === mode.value

              return (
                <Button
                  key={mode.value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "flex flex-col items-center gap-0.5 sm:gap-1 h-auto py-2 sm:py-3 px-1 sm:px-2 transition-all",
                    isActive && "shadow-md ring-2 ring-primary/20"
                  )}
                  onClick={() => onViewModeChange(mode.value)}
                >
                  <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", isActive ? "text-primary-foreground" : mode.color)} />
                  <span className="text-[9px] sm:text-[10px] font-medium">{mode.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Conteúdo colapsável em mobile */}
        <div className={cn(
          "space-y-3 sm:space-y-4",
          !isExpanded && "hidden sm:block"
        )}>
          <Separator />

          {/* Tile Layer Selection */}
          <div className="space-y-2">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Camada Base</p>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {tileLayers.map((layer) => {
                const Icon = layer.icon
                const isActive = tileLayer === layer.value

                return (
                  <Button
                    key={layer.value}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "flex flex-col items-center gap-1 sm:gap-1.5 h-auto py-2 sm:py-3 px-1 sm:px-2 transition-all",
                      isActive && "shadow-md ring-2 ring-primary/20"
                    )}
                    onClick={() => onTileLayerChange(layer.value)}
                  >
                    <Icon className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", isActive && "text-primary-foreground")} />
                    <div className="text-center">
                      <span className="text-[9px] sm:text-[10px] font-medium block">{layer.label}</span>
                      <span className="text-[8px] sm:text-[9px] text-muted-foreground hidden sm:block">{layer.description}</span>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-2">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Ações</p>
            <div className="space-y-1.5">
              {onResetView && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-8 sm:h-9 text-[10px] sm:text-xs hover:bg-accent transition-colors"
                  onClick={onResetView}
                >
                  <Navigation className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 sm:mr-2.5" />
                  Resetar Visualização
                </Button>
              )}

              {onToggleFullscreen && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-8 sm:h-9 text-[10px] sm:text-xs hover:bg-accent transition-colors"
                  onClick={onToggleFullscreen}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 sm:mr-2.5" />
                      Sair Tela Cheia
                    </>
                  ) : (
                    <>
                      <Maximize className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 sm:mr-2.5" />
                      Tela Cheia
                    </>
                  )}
                </Button>
              )}

              {onExportData && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-8 sm:h-9 text-[10px] sm:text-xs hover:bg-accent transition-colors"
                  onClick={onExportData}
                >
                  <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 sm:mr-2.5" />
                  Exportar Dados
              </Button>
            )}
          </div>
        </div>
        </div>

        {/* Info Footer - Oculto em mobile quando colapsado */}
        <div className={cn(
          "pt-2 border-t border-border",
          !isExpanded && "hidden sm:block"
        )}>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground text-center leading-relaxed">
            💡 Clique e arraste para navegar<br />
            Use scroll para zoom
          </p>
        </div>
      </div>
    </Card>
  )
}
