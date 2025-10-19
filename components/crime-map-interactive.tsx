"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, BarChart3, TrendingDown, AlertCircle } from "lucide-react"
import { MOCK_INCIDENTS, getZoneStatistics, getCrimeTypeStatistics } from "@/lib/data/mock-incidents"
import type { Incident } from "@/lib/types/map"

// Dynamic import do mapa melhorado
const EnhancedInteractiveMap = dynamic(
  () => import("@/components/maps/EnhancedInteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full rounded-lg border border-border bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando mapa de crimes...</p>
        </div>
      </div>
    ),
  }
)

interface CrimeMapInteractiveProps {
  incidents?: Incident[]
  onIncidentClick?: (id: string) => void
}

/**
 * Componente CrimeMap Interativo - Substituição do crime-map.tsx
 *
 * Exibe mapa interativo com estatísticas de crimes por região e tipo
 * Baseado nos dados reais de Porto Velho com visualização aprimorada
 */
export function CrimeMapInteractive({
  incidents,
  onIncidentClick = (id) => console.log("Incident clicked:", id)
}: CrimeMapInteractiveProps) {
  // Usar dados mockados se não fornecidos
  const mapIncidents = useMemo(() => {
    return incidents || MOCK_INCIDENTS
  }, [incidents])

  // Estatísticas por zona
  const zoneStats = useMemo(() => getZoneStatistics(mapIncidents), [mapIncidents])

  // Estatísticas por tipo de crime
  const crimeTypeStats = useMemo(() => getCrimeTypeStatistics(mapIncidents), [mapIncidents])

  // Cálculo de mudança percentual (mock - em produção viria de API)
  const calculateChange = (count: number) => {
    const baseChange = -5 - Math.floor(Math.random() * 20)
    return baseChange
  }

  const getRiskLevel = (count: number, total: number): "high" | "medium" | "low" => {
    const percentage = (count / total) * 100
    if (percentage > 30) return "high"
    if (percentage > 15) return "medium"
    return "low"
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "border-destructive text-destructive bg-destructive/10"
      case "medium":
        return "border-amber-500 text-amber-500 bg-amber-500/10"
      case "low":
        return "border-chart-2 text-chart-2 bg-chart-2/10"
      default:
        return "border-muted-foreground text-muted-foreground"
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case "high":
        return "Alto Risco"
      case "medium":
        return "Médio Risco"
      case "low":
        return "Baixo Risco"
      default:
        return "Sem Dados"
    }
  }

  const totalIncidents = mapIncidents.length
  const maxZoneCount = Math.max(...zoneStats.map(z => z.count))

  return (
    <div className="space-y-6">
      {/* Mapa Interativo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Mapa Interativo de Crimes
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {mapIncidents.length} ocorrências registradas
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <EnhancedInteractiveMap
            incidents={mapIncidents}
            onIncidentClick={onIncidentClick}
            center={[-8.76077, -63.8999]}
            zoom={12}
            height="600px"
            showSearch={true}
            showAdvancedControls={true}
            showLegend={true}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="zones" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="zones">
            <MapPin className="h-4 w-4 mr-2" />
            Por Região
          </TabsTrigger>
          <TabsTrigger value="types">
            <BarChart3 className="h-4 w-4 mr-2" />
            Por Tipo
          </TabsTrigger>
        </TabsList>

        {/* Distribuição por Região */}
        <TabsContent value="zones" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Crimes por Região</CardTitle>
              <p className="text-sm text-muted-foreground">
                Análise geográfica das ocorrências em Porto Velho - Janeiro 2025
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zoneStats.map((zone) => {
                  const change = calculateChange(zone.count)
                  const risk = getRiskLevel(zone.count, maxZoneCount)

                  return (
                    <div key={zone.name} className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${zone.color}20`, border: `2px solid ${zone.color}` }}
                          >
                            <MapPin className="h-5 w-5" style={{ color: zone.color }} />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{zone.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {zone.count} ocorrências em Jan/2025
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getRiskColor(risk)}>
                            {getRiskLabel(risk)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={change < 0 ? "border-chart-2 text-chart-2 bg-chart-2/10" : "border-destructive text-destructive"}
                          >
                            <TrendingDown className="h-3 w-3 mr-1" />
                            {change}%
                          </Badge>
                        </div>
                      </div>

                      {/* Barra de progresso */}
                      <div className="h-3 w-full overflow-hidden rounded-full bg-muted mb-3">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${(zone.count / maxZoneCount) * 100}%`,
                            backgroundColor: zone.color
                          }}
                        />
                      </div>

                      {/* Breakdown por prioridade */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-destructive" />
                          <span className="text-muted-foreground">Alta: {zone.highPriority}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-muted-foreground">Média: {zone.mediumPriority}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-chart-2" />
                          <span className="text-muted-foreground">Baixa: {zone.lowPriority}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tipos de Crime */}
        <TabsContent value="types" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Crime Mais Comuns</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ranking de ocorrências por categoria - Janeiro 2025
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {crimeTypeStats.slice(0, 8).map((crime, index) => {
                  const percent = Math.round((crime.count / totalIncidents) * 100)
                  const isTopCrime = index < 3

                  return (
                    <div
                      key={crime.type}
                      className={`flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-md ${
                        isTopCrime ? "border-primary/50 bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isTopCrime && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                            {index + 1}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{crime.type}</p>
                          <p className="text-sm text-muted-foreground">{crime.count} casos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{percent}%</p>
                        <p className="text-xs text-muted-foreground">do total</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Alerta para crimes prioritários */}
              <div className="mt-6 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-1">Atenção Prioritária</p>
                    <p className="text-sm text-muted-foreground">
                      Os crimes de <strong>{crimeTypeStats[0]?.type}</strong> representam a maior
                      incidência com {crimeTypeStats[0]?.count} casos. Recomenda-se reforço de
                      patrulhamento nas regiões mais afetadas.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-chart-2" />
            Análise e Tendências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-2">Região Mais Afetada</p>
              <p className="text-2xl font-bold text-foreground mb-1">{zoneStats[0]?.name}</p>
              <p className="text-xs text-muted-foreground">{zoneStats[0]?.count} ocorrências</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-2">Crime Predominante</p>
              <p className="text-2xl font-bold text-foreground mb-1">{crimeTypeStats[0]?.type}</p>
              <p className="text-xs text-muted-foreground">
                {Math.round((crimeTypeStats[0]?.count / totalIncidents) * 100)}% dos casos
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-2">Redução Média</p>
              <p className="text-2xl font-bold text-chart-2 mb-1">-15%</p>
              <p className="text-xs text-muted-foreground">vs. período anterior</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Dados atualizados em tempo real • Última atualização: {new Date().toLocaleString('pt-BR')}
            </p>
            <Button variant="outline" size="sm">
              Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Export adicional para retrocompatibilidade
export { CrimeMapInteractive as CrimeMap }
