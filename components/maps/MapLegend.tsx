"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * Interface para items da legenda do mapa
 */
interface LegendItem {
  label: string
  color: string
  count?: number
  icon?: React.ReactNode
}

interface MapLegendProps {
  items: LegendItem[]
  title?: string
  className?: string
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

/**
 * Componente de legenda para o mapa interativo
 * Exibe informações sobre as camadas, zonas e tipos de ocorrências
 */
export function MapLegend({ items, title = "Legenda", className, position = "bottom-right" }: MapLegendProps) {
  const positionClasses = {
    "top-left": "top-[4.5rem] md:top-24 left-2 sm:left-4",
    "top-right": "top-[4.5rem] md:top-24 right-2 sm:right-4",
    "bottom-left": "bottom-4 left-2 sm:left-4",
    "bottom-right": "bottom-4 right-2 sm:right-4",
  }

  return (
    <Card
      className={cn(
        "absolute z-[1000] w-[calc(100vw-1rem)] sm:w-52 shadow-lg backdrop-blur-sm bg-card/95",
        positionClasses[position],
        className
      )}
    >
      <CardContent className="p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">{title}</h4>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {item.icon || (
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <Badge variant="secondary" className="text-xs h-5 px-1.5">
                  {item.count}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
