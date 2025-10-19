"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Incident } from "@/lib/types/map"

interface PriorityWidgetProps {
  incidents: Incident[]
  selectedPriority?: "all" | "high" | "medium" | "low"
  onPrioritySelect?: (priority: "all" | "high" | "medium" | "low") => void
}

/**
 * Widget de Prioridades - mostra contadores de ocorrências por prioridade
 */
export function PriorityWidget({
  incidents,
  selectedPriority = "all",
  onPrioritySelect
}: PriorityWidgetProps) {
  // Estado de collapse com persistência no localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('priorityWidget.collapsed')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  // Salvar estado no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('priorityWidget.collapsed', JSON.stringify(isCollapsed))
    }
  }, [isCollapsed])

  // Contar ocorrências por prioridade
  const counts = {
    high: incidents.filter(inc => inc.priority === "high").length,
    medium: incidents.filter(inc => inc.priority === "medium").length,
    low: incidents.filter(inc => inc.priority === "low").length,
  }

  const priorities = [
    {
      key: "high" as const,
      label: "Alta Prioridade",
      color: "bg-red-500",
      textColor: "text-red-600",
      borderColor: "border-red-500",
      count: counts.high,
    },
    {
      key: "medium" as const,
      label: "Média Prioridade",
      color: "bg-amber-500",
      textColor: "text-amber-600",
      borderColor: "border-amber-500",
      count: counts.medium,
    },
    {
      key: "low" as const,
      label: "Baixa Prioridade",
      color: "bg-green-500",
      textColor: "text-green-600",
      borderColor: "border-green-500",
      count: counts.low,
    },
  ]

  return (
    <Card className="border-2 shadow-xl backdrop-blur-md bg-card/98">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <span>Prioridades</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {priorities.map((priority) => {
            const isSelected = selectedPriority === priority.key
            const isAll = selectedPriority === "all"

            return (
              <button
                key={priority.key}
                onClick={() => onPrioritySelect?.(isSelected ? "all" : priority.key)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all hover:shadow-md",
                  isSelected
                    ? `${priority.borderColor} bg-${priority.key === "high" ? "red" : priority.key === "medium" ? "amber" : "green"}-50/50`
                    : isAll
                    ? "border-border bg-card hover:border-border/80"
                    : "border-border/50 bg-card/50 opacity-60 hover:opacity-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn("h-3 w-3 rounded-full", priority.color)} />
                  <span className={cn(
                    "text-sm font-medium",
                    isSelected ? priority.textColor : "text-foreground"
                  )}>
                    {priority.label}
                  </span>
                </div>
                <Badge
                  variant={isSelected ? "default" : "secondary"}
                  className={cn(
                    "min-w-[2rem] justify-center font-bold",
                    isSelected && `${priority.color} text-white border-transparent`
                  )}
                >
                  {priority.count}
                </Badge>
              </button>
            )
          })}
        </CardContent>
      )}
    </Card>
  )
}
