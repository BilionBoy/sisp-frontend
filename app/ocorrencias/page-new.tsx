"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { HeaderNew } from "@/components/header/HeaderNew"
import { SidebarNew } from "@/components/sidebar/SidebarNew"
import { IncidentList } from "@/components/incident-list"
import { IncidentFilters } from "@/components/incident-filters"
import { IncidentDetails } from "@/components/incident-details"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, XCircle, Map, List, BarChart3, Download, Filter } from "lucide-react"
import { StatCardSkeleton, ListSkeleton } from "@/components/ui/loading-states"
import { NoIncidents, NoSearchResults } from "@/components/ui/empty-states"
import { StatsDashboard } from "@/components/stats-dashboard"
import { MOCK_INCIDENTS } from "@/lib/data/mock-incidents"
import type { Incident } from "@/lib/types/map"

// Dynamic import do mapa para evitar SSR issues
const InteractiveMap = dynamic(
  () => import("@/components/maps/InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full rounded-lg border border-border bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    ),
  }
)

/**
 * Página de Ocorrências melhorada com:
 * - Mapa interativo real com React-Leaflet
 * - Filtros avançados com chips removíveis
 * - Toggle entre visualizações (mapa, lista, gráficos)
 * - Cards de estatísticas animados
 * - Loading states e empty states
 * - Responsividade completa
 */
export default function OcorrenciasPageNew() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    type: "all",
    dateRange: "today",
  })
  const [viewMode, setViewMode] = useState<"map" | "list" | "stats">("map")
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - em produção, isto viria de uma API
  // Usando dados mockados realistas de Porto Velho
  const allIncidents: Incident[] = useMemo(() => MOCK_INCIDENTS, [])

  // Filtrar incidents baseado nos filtros
  const filteredIncidents = useMemo(() => {
    return allIncidents.filter((incident) => {
      if (filters.status !== "all" && incident.status !== filters.status) return false
      if (filters.priority !== "all" && incident.priority !== filters.priority) return false
      if (filters.type !== "all" && incident.type !== filters.type) return false
      return true
    })
  }, [filters, allIncidents])

  // Estatísticas
  const stats = useMemo(() => {
    return {
      total: filteredIncidents.length,
      active: filteredIncidents.filter((i) => i.status === "Em Atendimento").length,
      pending: filteredIncidents.filter((i) => i.status === "Pendente" || i.status === "Em Análise").length,
      resolved: filteredIncidents.filter((i) => i.status === "Resolvido").length,
    }
  }, [filteredIncidents])

  // Verificar se há filtros ativos
  const hasActiveFilters = Object.values(filters).some((value) => value !== "all" && value !== "today")

  const clearFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      type: "all",
      dateRange: "today",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNew />
      <SidebarNew />

      <main className="ml-64 mt-20 p-6 transition-all duration-300">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mapa de Ocorrências</h1>
              <p className="text-muted-foreground mt-1">
                Visualização georreferenciada e gestão de ocorrências em tempo real
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Nova Ocorrência
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-chart-1/10 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-chart-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Em Atendimento</p>
                    <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resolvidas</p>
                    <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-chart-2" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* View Toggle Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="mb-6">
          <TabsList>
            <TabsTrigger value="map" className="gap-2">
              <Map className="h-4 w-4" />
              Mapa
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Lista
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Estatísticas
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <IncidentFilters filters={filters} onFiltersChange={setFilters} />
            {/* Active filters chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {filters.status !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {filters.status}
                    <button onClick={() => setFilters({ ...filters, status: "all" })} className="ml-1">×</button>
                  </Badge>
                )}
                {filters.priority !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Prioridade: {filters.priority}
                    <button onClick={() => setFilters({ ...filters, priority: "all" })} className="ml-1">×</button>
                  </Badge>
                )}
                {filters.type !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Tipo: {filters.type}
                    <button onClick={() => setFilters({ ...filters, type: "all" })} className="ml-1">×</button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map/List/Stats Area */}
          <div className="lg:col-span-2">
            {viewMode === "map" && (
              <Card>
                <CardHeader>
                  <CardTitle>Mapa Interativo</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredIncidents.length === 0 ? (
                    hasActiveFilters ? (
                      <NoSearchResults onClear={clearFilters} />
                    ) : (
                      <NoIncidents />
                    )
                  ) : (
                    <InteractiveMap
                      incidents={filteredIncidents}
                      onIncidentClick={setSelectedIncident}
                      center={[-8.76077, -63.8999]}
                      zoom={12}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {viewMode === "list" && (
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Ocorrências</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <ListSkeleton items={5} />
                  ) : filteredIncidents.length === 0 ? (
                    hasActiveFilters ? (
                      <NoSearchResults onClear={clearFilters} />
                    ) : (
                      <NoIncidents />
                    )
                  ) : (
                    <IncidentList
                      filters={filters}
                      selectedId={selectedIncident}
                      onSelect={setSelectedIncident}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {viewMode === "stats" && (
              <StatsDashboard incidents={filteredIncidents} />
            )}
          </div>

          {/* Incident List Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ocorrências Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ListSkeleton items={3} />
                ) : (
                  <IncidentList
                    filters={filters}
                    selectedId={selectedIncident}
                    onSelect={setSelectedIncident}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Incident Details Modal */}
        {selectedIncident && (
          <IncidentDetails incidentId={selectedIncident} onClose={() => setSelectedIncident(null)} />
        )}
      </main>
    </div>
  )
}
