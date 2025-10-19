"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Incident } from "@/lib/types/map"

interface OcorrenciasListCompactProps {
  incidents: Incident[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  priorityFilter?: "all" | "high" | "medium" | "low"
  hasMore?: boolean
  isFetchingMore?: boolean
  onLoadMore?: () => void
}

/**
 * Lista compacta de ocorrências para exibir na lateral do mapa
 */
export function OcorrenciasListCompact({
  incidents,
  selectedId,
  onSelect,
  priorityFilter = "all",
  hasMore = false,
  isFetchingMore = false,
  onLoadMore
}: OcorrenciasListCompactProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const filteredIncidents = priorityFilter === "all"
    ? incidents
    : incidents.filter(inc => inc.priority === priorityFilter)

  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
  })

  useEffect(() => {
    if (!hasMore || isFetchingMore || !onLoadMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 0.5 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isFetchingMore, onLoadMore])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolvido":
      case "arquivado":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "em atendimento":
      case "despachado":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "em análise":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "pendente":
      default:
        return "bg-red-500/10 text-red-600 border-red-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
      default:
        return "bg-green-500"
    }
  }

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Agora"
    if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? "s" : ""}`
    if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? "s" : ""}`
    return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`
  }

  if (sortedIncidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-sm text-muted-foreground">Nenhuma ocorrência encontrada</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-2">
        {sortedIncidents.map((incident) => {
          const isSelected = selectedId === incident.id

          return (
            <button
              key={incident.id}
              onClick={() => onSelect?.(incident.id)}
              className={cn(
                "w-full text-left rounded-lg border-2 transition-all hover:border-primary/50 hover:shadow-md",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card"
              )}
            >
              <div className="p-3 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", getPriorityColor(incident.priority))} />
                    <span className="font-semibold text-sm leading-snug">
                      {incident.id} - {incident.type}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] px-2 py-0.5 h-5 shrink-0 whitespace-nowrap", getStatusColor(incident.status))}
                  >
                    {incident.status}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {incident.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground gap-2">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{incident.location}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" />
                    <span className="whitespace-nowrap">{formatRelativeTime(incident.timestamp || '')}</span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}

        {hasMore && (
          <div ref={loadMoreRef} className="py-4 text-center">
            {isFetchingMore ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-xs text-muted-foreground">Carregando...</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Carregue mais</span>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
