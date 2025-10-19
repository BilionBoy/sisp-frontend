"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, Filter, SlidersHorizontal } from "lucide-react"
import { OcorrenciaCardMobile } from "@/components/mobile/ocorrencia-card-mobile"
import { ConnectionIndicator } from "@/components/connection-indicator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useInfiniteOcorrencias } from "@/lib/hooks/use-infinite-ocorrencias"
import { useOcorrenciasCounts } from "@/lib/hooks/use-ocorrencias-counts"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { cn } from "@/lib/utils"
import type { Incident } from "@/lib/types/map"

export default function OcorrenciasMobilePage() {
  const router = useRouter()
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Hook paginado para dados (50 em 50)
  const {
    incidents: allIncidents,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    error,
    refresh,
  } = useInfiniteOcorrencias()

  // Hook para contagens totais REAIS (independente da paginação)
  const { counts: priorityCounts } = useOcorrenciasCounts()

  // Debounce do filtro de prioridade para evitar re-renders excessivos
  const debouncedPriorityFilter = useDebounce(priorityFilter, 300)

  // Filtrar por prioridade com useMemo
  const filteredIncidents = useMemo(() => {
    if (debouncedPriorityFilter === "all") return allIncidents
    return allIncidents.filter(inc => inc.priority === debouncedPriorityFilter)
  }, [allIncidents, debouncedPriorityFilter])

  // Handler para assumir ocorrência (navegar para detalhes)
  const handleAssumeIncident = useCallback((id: string) => {
    // Extrair ID numérico do incident para navegação
    const incident = allIncidents.find(inc => inc.id === id)
    if (incident?._apiData?.id_ocorrencia) {
      router.push(`/ocorrencias-mobile/${incident._apiData.id_ocorrencia}`)
    }
  }, [router, allIncidents])

  // Pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refresh()
    } finally {
      setIsRefreshing(false)
    }
  }, [refresh])

  // Infinite scroll com Intersection Observer
  useEffect(() => {
    if (!loadMoreRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !isFetchingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isFetchingMore, loadMore])

  const priorityConfig = [
    { value: "all" as const, label: "Todas", color: "bg-gray-500" },
    { value: "high" as const, label: "Alta", color: "bg-red-500" },
    { value: "medium" as const, label: "Média", color: "bg-amber-500" },
    { value: "low" as const, label: "Baixa", color: "bg-blue-500" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SI</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none">SISP</span>
                <span className="text-xs text-muted-foreground leading-none">Ocorrências</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ConnectionIndicator />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 w-9"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </div>
      </header>

      {/* Filtros de Prioridade */}
      <div className="sticky top-14 z-40 bg-background border-b">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase">
              Filtrar por Prioridade
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {priorityConfig.map((priority) => (
              <Button
                key={priority.value}
                variant={priorityFilter === priority.value ? "default" : "outline"}
                size="sm"
                onClick={() => setPriorityFilter(priority.value)}
                className={cn(
                  "shrink-0 gap-2 min-w-fit",
                  priorityFilter === priority.value && priority.value !== "all" && priority.color
                )}
              >
                {priority.label}
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-5 min-w-[1.25rem] px-1.5 text-xs",
                    priorityFilter === priority.value && "bg-white/20 text-white"
                  )}
                >
                  {priorityCounts[priority.value]}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Ocorrências */}
      <main className="container mx-auto px-4 py-4 pb-20">
        {/* Loading inicial */}
        {isLoading && !allIncidents.length && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !allIncidents.length && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
              <RefreshCw className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Sem conexão com servidor</h3>
            <p className="text-sm text-muted-foreground mb-2 max-w-sm">
              {error.message?.includes('timeout')
                ? 'O servidor não respondeu a tempo. Verifique sua conexão.'
                : error.message?.includes('fetch')
                ? 'Não foi possível conectar ao servidor.'
                : error.message || "Não foi possível carregar as ocorrências"}
            </p>
            <p className="text-xs text-muted-foreground mb-4 max-w-sm">
              Certifique-se de estar conectado na mesma rede WiFi que o servidor ou aguarde sincronização.
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Lista de cards */}
        {!isLoading && filteredIncidents.length > 0 && (
          <div className="space-y-3">
            {filteredIncidents.map((incident) => (
              <OcorrenciaCardMobile
                key={incident.id}
                incident={incident}
                onAssume={handleAssumeIncident}
              />
            ))}

            {/* Loading more indicator */}
            {isFetchingMore && (
              <div className="py-4 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Carregando mais...
                </div>
              </div>
            )}

            {/* Intersection observer target */}
            <div ref={loadMoreRef} className="h-4" />

            {/* No more items */}
            {!hasMore && filteredIncidents.length > 10 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Todas as ocorrências foram carregadas
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredIncidents.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Filter className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Nenhuma ocorrência encontrada</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {priorityFilter === "all"
                ? "Não há ocorrências registradas no momento"
                : `Não há ocorrências com prioridade ${priorityConfig.find(p => p.value === priorityFilter)?.label.toLowerCase()}`}
            </p>
            {priorityFilter !== "all" && (
              <Button onClick={() => setPriorityFilter("all")} variant="outline">
                Ver todas as ocorrências
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
