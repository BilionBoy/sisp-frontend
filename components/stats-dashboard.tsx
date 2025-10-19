"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { MOCK_INCIDENTS, getZoneStatistics, getCrimeTypeStatistics } from "@/lib/data/mock-incidents"
import type { Incident } from "@/lib/types/map"

interface StatsDashboardProps {
  incidents?: Incident[]
}

/**
 * Dashboard de Estatísticas e Análises
 * Exibe gráficos, métricas e tendências sobre as ocorrências
 */
export function StatsDashboard({ incidents }: StatsDashboardProps) {
  const mapIncidents = useMemo(() => {
    return incidents || MOCK_INCIDENTS
  }, [incidents])

  // Estatísticas gerais
  const stats = useMemo(() => {
    const total = mapIncidents.length
    const highPriority = mapIncidents.filter(i => i.priority === "high").length
    const mediumPriority = mapIncidents.filter(i => i.priority === "medium").length
    const lowPriority = mapIncidents.filter(i => i.priority === "low").length

    const resolved = mapIncidents.filter(i => i.status === "Resolvido").length
    const active = mapIncidents.filter(i => i.status === "Em Atendimento").length
    const pending = mapIncidents.filter(i => ["Pendente", "Em Análise"].includes(i.status)).length

    return {
      total,
      highPriority,
      mediumPriority,
      lowPriority,
      resolved,
      active,
      pending,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    }
  }, [mapIncidents])

  // Estatísticas por zona
  const zoneStats = useMemo(() => getZoneStatistics(mapIncidents), [mapIncidents])

  // Estatísticas por tipo
  const crimeTypeStats = useMemo(() => getCrimeTypeStatistics(mapIncidents), [mapIncidents])

  // Dados para gráfico de tendência temporal (mock)
  const timelineData = useMemo(() => {
    return [
      { hour: "00:00", count: 3 },
      { hour: "03:00", count: 1 },
      { hour: "06:00", count: 5 },
      { hour: "09:00", count: 12 },
      { hour: "12:00", count: 18 },
      { hour: "15:00", count: 15 },
      { hour: "18:00", count: 22 },
      { hour: "21:00", count: 14 },
    ]
  }, [])

  const maxTimelineValue = Math.max(...timelineData.map(d => d.count))

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="outline" className="border-chart-2 text-chart-2">
                -15%
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total de Ocorrências</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <Badge variant="destructive">{stats.highPriority}</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Alta Prioridade</p>
            <p className="text-3xl font-bold text-foreground">
              {Math.round((stats.highPriority / stats.total) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-chart-2" />
              </div>
              <Badge variant="outline" className="border-chart-2 text-chart-2">
                +12%
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Taxa de Resolução</p>
            <p className="text-3xl font-bold text-foreground">{stats.resolutionRate}%</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <Badge variant="outline" className="border-amber-500 text-amber-500">
                6.5 min
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Tempo Médio</p>
            <p className="text-3xl font-bold text-foreground">{stats.active}</p>
            <p className="text-xs text-muted-foreground">em atendimento</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">
            <Calendar className="h-4 w-4 mr-2" />
            Linha do Tempo
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <MapPin className="h-4 w-4 mr-2" />
            Distribuição
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingDown className="h-4 w-4 mr-2" />
            Tendências
          </TabsTrigger>
        </TabsList>

        {/* Timeline */}
        <TabsContent value="timeline" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição Temporal de Ocorrências</CardTitle>
              <p className="text-sm text-muted-foreground">
                Análise por horário do dia - Últimas 24 horas
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineData.map((data) => (
                  <div key={data.hour} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{data.hour}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{data.count} ocorrências</span>
                        <Badge variant="outline">{Math.round((data.count / maxTimelineValue) * 100)}%</Badge>
                      </div>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                        style={{ width: `${(data.count / maxTimelineValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm font-semibold text-foreground mb-2">Horário de Pico</p>
                <p className="text-xs text-muted-foreground">
                  O período entre <strong>18:00 e 21:00</strong> concentra o maior número de
                  ocorrências ({timelineData.find(d => d.hour === "18:00")?.count} casos).
                  Recomenda-se intensificar o patrulhamento neste horário.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution */}
        <TabsContent value="distribution" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Por Zona */}
            <Card>
              <CardHeader>
                <CardTitle>Por Zona Geográfica</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {zoneStats.map((zone) => (
                    <div key={zone.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: zone.color }}
                          />
                          <span className="font-medium text-foreground">{zone.name}</span>
                        </div>
                        <span className="text-muted-foreground">{zone.count}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${(zone.count / stats.total) * 100}%`,
                            backgroundColor: zone.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Por Prioridade */}
            <Card>
              <CardHeader>
                <CardTitle>Por Nível de Prioridade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="h-40 w-40 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="80"
                          cy="80"
                          r="60"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="12"
                          className="text-muted"
                        />
                        {/* High priority arc */}
                        <circle
                          cx="80"
                          cy="80"
                          r="60"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="12"
                          strokeDasharray={`${(stats.highPriority / stats.total) * 377} 377`}
                          strokeDashoffset="0"
                        />
                        {/* Medium priority arc */}
                        <circle
                          cx="80"
                          cy="80"
                          r="60"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="12"
                          strokeDasharray={`${(stats.mediumPriority / stats.total) * 377} 377`}
                          strokeDashoffset={`-${(stats.highPriority / stats.total) * 377}`}
                        />
                      </svg>
                      <div className="absolute text-center">
                        <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-destructive/10">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-destructive" />
                        <span className="text-sm text-foreground">Alta Prioridade</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{stats.highPriority}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-amber-500/10">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                        <span className="text-sm text-foreground">Média Prioridade</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{stats.mediumPriority}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-chart-2/10">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-chart-2" />
                        <span className="text-sm text-foreground">Baixa Prioridade</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{stats.lowPriority}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Tendências</CardTitle>
              <p className="text-sm text-muted-foreground">
                Comparativo com períodos anteriores
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* Tendências positivas */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="h-5 w-5 text-chart-2" />
                    <h4 className="font-semibold text-foreground">Reduções Significativas</h4>
                  </div>
                  <div className="space-y-3">
                    {crimeTypeStats.slice(0, 3).map((crime) => {
                      const reduction = 5 + Math.floor(Math.random() * 20)
                      return (
                        <div key={crime.type} className="flex items-center justify-between p-3 rounded-lg border border-border bg-chart-2/5">
                          <div>
                            <p className="font-medium text-foreground">{crime.type}</p>
                            <p className="text-xs text-muted-foreground">{crime.count} casos este mês</p>
                          </div>
                          <Badge variant="outline" className="border-chart-2 text-chart-2">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            -{reduction}%
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Áreas que requerem atenção */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <h4 className="font-semibold text-foreground">Requer Atenção</h4>
                  </div>
                  <div className="space-y-3">
                    {zoneStats.slice(0, 2).map((zone) => (
                      <div key={zone.name} className="flex items-center justify-between p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                        <div>
                          <p className="font-medium text-foreground">{zone.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {zone.highPriority} ocorrências de alta prioridade
                          </p>
                        </div>
                        <Badge variant="outline" className="border-amber-500 text-amber-500">
                          Monitorar
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
