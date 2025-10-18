import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { StatCard } from "@/components/stat-card"
import { Shield, AlertTriangle, Users, Car, TrendingDown, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="ml-64 mt-20 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary text-balance">Painel de Comando Central - SISP Porto Velho</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Visão geral das operações de segurança pública em tempo real
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            title="Ocorrências Hoje"
            value="47"
            change="-12% vs ontem"
            changeType="positive"
            icon={AlertTriangle}
            iconColor="text-primary"
          />
          <StatCard
            title="Agentes em Patrulha"
            value="156"
            change="94% da força"
            changeType="positive"
            icon={Users}
            iconColor="text-secondary"
          />
          <StatCard
            title="Viaturas Ativas"
            value="38"
            change="2 em manutenção"
            changeType="neutral"
            icon={Car}
            iconColor="text-chart-4"
          />
          <StatCard
            title="Tempo Resposta Médio"
            value="8min"
            change="-2min vs média"
            changeType="positive"
            icon={Clock}
            iconColor="text-chart-2"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Ocorrências Recentes */}
          <Card className="lg:col-span-2 border-l-4 border-l-primary">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center justify-between text-primary">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Ocorrências Recentes
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  Ver Todas
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  {
                    id: "OC-2847",
                    type: "Furto",
                    location: "Centro - Rua das Flores, 234",
                    time: "há 5 minutos",
                    status: "Em Atendimento",
                    priority: "high",
                  },
                  {
                    id: "OC-2846",
                    type: "Perturbação",
                    location: "Bairro Alto - Av. Principal, 890",
                    time: "há 12 minutos",
                    status: "Despachado",
                    priority: "medium",
                  },
                  {
                    id: "OC-2845",
                    type: "Acidente",
                    location: "Zona Sul - Rodovia BR-364, km 45",
                    time: "há 18 minutos",
                    status: "Resolvido",
                    priority: "high",
                  },
                  {
                    id: "OC-2844",
                    type: "Suspeita",
                    location: "Parque Industrial - Rua 7, 156",
                    time: "há 25 minutos",
                    status: "Em Análise",
                    priority: "low",
                  },
                ].map((occurrence) => (
                  <div
                    key={occurrence.id}
                    className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50"
                  >
                    <div
                      className={cn(
                        "mt-1 h-3 w-3 rounded-full shrink-0",
                        occurrence.priority === "high" && "bg-destructive animate-pulse",
                        occurrence.priority === "medium" && "bg-amber-500",
                        occurrence.priority === "low" && "bg-secondary",
                      )}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-foreground">
                          {occurrence.id} - {occurrence.type}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-medium",
                            occurrence.status === "Em Atendimento" && "border-primary text-primary",
                            occurrence.status === "Resolvido" && "border-secondary text-secondary",
                          )}
                        >
                          {occurrence.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {occurrence.location}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {occurrence.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alertas e Notificações */}
          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                Alertas do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-3 rounded-lg border-2 border-destructive/50 bg-destructive/10 p-4 shadow-sm">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Área de Alto Risco</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Centro - 3 ocorrências nas últimas 2h
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border-2 border-amber-500/50 bg-amber-500/10 p-4 shadow-sm">
                  <Shield className="h-5 w-5 shrink-0 text-amber-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Evento Programado</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Show no estádio - Reforço sugerido</p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border-2 border-secondary/50 bg-secondary/10 p-4 shadow-sm">
                  <TrendingDown className="h-5 w-5 shrink-0 text-secondary" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Melhoria Detectada</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Zona Norte - 40% menos ocorrências</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mapa Placeholder */}
          <Card className="lg:col-span-3 border-l-4 border-l-accent">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-primary">
                <MapPin className="h-5 w-5" />
                Mapa de Calor - Ocorrências em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
                <div className="text-center space-y-3">
                  <MapPin className="mx-auto h-16 w-16 text-primary" />
                  <div>
                    <p className="text-base font-medium text-foreground">Mapa interativo será carregado aqui</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Integração com dados da Polícia Civil e georreferenciamento
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Heatmap com raio de 3km em torno dos bens públicos
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
