"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { PublicStats } from "@/components/public-stats"
import { CrimeMap } from "@/components/crime-map"
import { MonthlyReport } from "@/components/monthly-report"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, TrendingDown } from "lucide-react"

export default function TransparenciaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Portal da Transparência</h1>
            <p className="text-muted-foreground mt-1">Dados públicos de segurança e prestação de contas</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Baixar Relatório
          </Button>
        </div>

        {/* Hero Stats */}
        <div className="mb-6 rounded-lg border border-border bg-gradient-to-r from-primary/10 to-accent/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-primary/20 p-2">
              <TrendingDown className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Redução de Criminalidade</h2>
              <p className="text-sm text-muted-foreground">Comparado ao mesmo período do ano anterior</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-foreground">-18%</p>
              <p className="text-sm text-muted-foreground">Crimes Violentos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">-23%</p>
              <p className="text-sm text-muted-foreground">Furtos e Roubos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">+32%</p>
              <p className="text-sm text-muted-foreground">Taxa de Resolução</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="map">Mapa de Crimes</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <PublicStats />

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Ocorrências por Tipo - Janeiro 2025</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "Furto", count: 145, change: -12, color: "bg-chart-1" },
                      { type: "Roubo", count: 89, change: -18, color: "bg-chart-2" },
                      { type: "Acidente de Trânsito", count: 234, change: -5, color: "bg-chart-3" },
                      { type: "Perturbação", count: 67, change: -8, color: "bg-chart-4" },
                      { type: "Vandalismo", count: 43, change: -15, color: "bg-chart-5" },
                    ].map((item) => (
                      <div key={item.type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground font-medium">{item.type}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-semibold">{item.count}</span>
                            <span className="text-xs text-chart-2">{item.change}%</span>
                          </div>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div className={`h-full ${item.color}`} style={{ width: `${(item.count / 234) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tempo de Resposta Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-foreground">6.5 min</p>
                      <p className="text-sm text-muted-foreground mt-1">Média geral de atendimento</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { priority: "Alta Prioridade", time: "4.2 min", color: "bg-destructive" },
                        { priority: "Média Prioridade", time: "6.8 min", color: "bg-amber-500" },
                        { priority: "Baixa Prioridade", time: "9.5 min", color: "bg-chart-2" },
                      ].map((item) => (
                        <div key={item.priority} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${item.color}`} />
                            <span className="text-sm text-foreground">{item.priority}</span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <CrimeMap />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <MonthlyReport />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Resolução de Casos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-foreground">87.3%</p>
                      <p className="text-sm text-muted-foreground mt-1">Casos resolvidos em 2024</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { category: "Crimes Violentos", rate: 92, color: "bg-chart-2" },
                        { category: "Furtos e Roubos", rate: 85, color: "bg-chart-1" },
                        { category: "Vandalismo", rate: 78, color: "bg-chart-3" },
                        { category: "Outros", rate: 90, color: "bg-chart-4" },
                      ].map((item) => (
                        <div key={item.category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground">{item.category}</span>
                            <span className="font-semibold text-foreground">{item.rate}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.rate}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Satisfação da População</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-foreground">4.2/5.0</p>
                      <p className="text-sm text-muted-foreground mt-1">Avaliação média dos cidadãos</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { aspect: "Tempo de Resposta", rating: 4.5 },
                        { aspect: "Atendimento", rating: 4.3 },
                        { aspect: "Resolução", rating: 4.0 },
                        { aspect: "Comunicação", rating: 3.9 },
                      ].map((item) => (
                        <div key={item.aspect} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground">{item.aspect}</span>
                            <span className="font-semibold text-foreground">{item.rating}/5.0</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-primary" style={{ width: `${(item.rating / 5) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Investimentos em Segurança Pública</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { category: "Equipamentos", value: "R$ 2.4M", percent: 35 },
                    { category: "Treinamento", value: "R$ 1.8M", percent: 26 },
                    { category: "Infraestrutura", value: "R$ 2.7M", percent: 39 },
                  ].map((item) => (
                    <div key={item.category} className="rounded-lg border border-border p-4">
                      <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                      <p className="text-2xl font-bold text-foreground mb-1">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.percent}% do orçamento</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-2">Sobre os Dados</p>
                <p className="text-sm text-muted-foreground">
                  Todos os dados apresentados neste portal são atualizados diariamente e refletem as informações
                  oficiais da Secretaria de Segurança Pública. Os relatórios completos estão disponíveis para download e
                  consulta pública, em conformidade com a Lei de Acesso à Informação (LAI).
                </p>
                <p className="text-xs text-muted-foreground mt-2">Última atualização: 18/01/2025 às 14:30</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
