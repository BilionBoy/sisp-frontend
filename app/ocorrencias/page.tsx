"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { HeatMap } from "@/components/heat-map"
import { IncidentList } from "@/components/incident-list"
import { IncidentFilters } from "@/components/incident-filters"
import { IncidentDetails } from "@/components/incident-details"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"

export default function OcorrenciasPage() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    type: "all",
    dateRange: "today",
  })

  const stats = {
    total: 47,
    active: 12,
    pending: 8,
    resolved: 27,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground text-balance">Mapa de Ocorrências</h1>
          <p className="text-muted-foreground mt-1">
            Visualização georreferenciada e gestão de ocorrências em tempo real
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hoje</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-chart-1" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Atendimento</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolvidas</p>
                <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-chart-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map and Filters */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Calor - Densidade de Ocorrências</CardTitle>
              </CardHeader>
              <CardContent>
                <HeatMap onIncidentClick={setSelectedIncident} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filtros e Busca</CardTitle>
              </CardHeader>
              <CardContent>
                <IncidentFilters filters={filters} onFiltersChange={setFilters} />
              </CardContent>
            </Card>
          </div>

          {/* Incident List */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ocorrências Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <IncidentList filters={filters} selectedId={selectedIncident} onSelect={setSelectedIncident} />
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
