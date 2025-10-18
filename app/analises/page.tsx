"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { PredictiveAnalysis } from "@/components/predictive-analysis"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Brain, Download } from "lucide-react"

export default function AnalisesPage() {
  const [timeRange, setTimeRange] = useState("30days")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Painel de Análise e Comando</h1>
            <p className="text-muted-foreground mt-1">Análises avançadas e insights estratégicos</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Últimos 7 dias</SelectItem>
                <SelectItem value="30days">Últimos 30 dias</SelectItem>
                <SelectItem value="90days">Últimos 90 dias</SelectItem>
                <SelectItem value="year">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-chart-1/10 p-2">
                  <BarChart3 className="h-5 w-5 text-chart-1" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Eficiência Operacional</p>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">92.4%</p>
              <p className="text-xs text-chart-2">+4.2% vs período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-chart-2/10 p-2">
                  <TrendingUp className="h-5 w-5 text-chart-2" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Tendência de Crimes</p>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">-18%</p>
              <p className="text-xs text-chart-2">Redução consistente</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Precisão IA</p>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">94.7%</p>
              <p className="text-xs text-chart-2">Previsões assertivas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="predictive">Análise Preditiva</TabsTrigger>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AnalyticsCharts timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <PredictiveAnalysis />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceMetrics />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Tendências Criminais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Crimes em Alta</h4>
                      {[
                        { type: "Furto de Veículos", change: "+8%", trend: "up" },
                        { type: "Estelionato Digital", change: "+12%", trend: "up" },
                      ].map((item) => (
                        <div key={item.type} className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">{item.type}</p>
                            <span className="text-sm font-semibold text-destructive">{item.change}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Crimes em Queda</h4>
                      {[
                        { type: "Roubo a Pedestres", change: "-23%", trend: "down" },
                        { type: "Furto em Residências", change: "-18%", trend: "down" },
                        { type: "Vandalismo", change: "-15%", trend: "down" },
                      ].map((item) => (
                        <div key={item.type} className="rounded-lg border border-chart-2/50 bg-chart-2/10 p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">{item.type}</p>
                            <span className="text-sm font-semibold text-chart-2">{item.change}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Padrões Identificados</h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          Aumento de crimes digitais correlacionado com maior uso de tecnologia pela população
                        </span>
                      </li>
                      <li className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Redução de crimes violentos após implementação de patrulhas inteligentes</span>
                      </li>
                      <li className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Concentração de ocorrências em horários de pico (18h-22h) em áreas comerciais</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
