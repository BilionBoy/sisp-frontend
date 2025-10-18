import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { StatCard } from "@/components/stat-card"
import {
  Building2,
  Users2,
  Target,
  TrendingUp,
  Shield,
  Heart,
  GraduationCap,
  Hammer,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="ml-64 mt-20 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary text-balance">
            Painel de Governança Municipal - Porto Velho Digital
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Visão integrada da gestão municipal alinhada ao PAEDS 2030-2050
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            title="Secretarias Ativas"
            value="18"
            change="100% operacionais"
            changeType="positive"
            icon={Building2}
            iconColor="text-primary"
          />
          <StatCard
            title="Projetos em Andamento"
            value="47"
            change="+8 este mês"
            changeType="positive"
            icon={Target}
            iconColor="text-secondary"
          />
          <StatCard
            title="Distritos Atendidos"
            value="9"
            change="Cobertura total"
            changeType="positive"
            icon={Users2}
            iconColor="text-chart-4"
          />
          <StatCard
            title="Metas PAEDS 2030"
            value="68%"
            change="+5% este trimestre"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-chart-2"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-l-4 border-l-primary">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center justify-between text-primary">
                <span className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Visão Geral das Secretarias
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
                    name: "Segurança Pública",
                    icon: Shield,
                    projects: 12,
                    budget: "R$ 8,5M",
                    progress: 78,
                    status: "Em dia",
                    color: "text-primary",
                  },
                  {
                    name: "Saúde",
                    icon: Heart,
                    projects: 18,
                    budget: "R$ 15,2M",
                    progress: 65,
                    status: "Atenção",
                    color: "text-destructive",
                  },
                  {
                    name: "Educação",
                    icon: GraduationCap,
                    projects: 24,
                    budget: "R$ 22,8M",
                    progress: 82,
                    status: "Em dia",
                    color: "text-secondary",
                  },
                  {
                    name: "Infraestrutura",
                    icon: Hammer,
                    projects: 15,
                    budget: "R$ 18,4M",
                    progress: 71,
                    status: "Em dia",
                    color: "text-chart-4",
                  },
                ].map((secretaria) => (
                  <div
                    key={secretaria.name}
                    className="rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-muted p-2">
                          <secretaria.icon className={`h-5 w-5 ${secretaria.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{secretaria.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {secretaria.projects} projetos ativos • {secretaria.budget}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-medium",
                          secretaria.status === "Em dia" && "border-secondary text-secondary",
                          secretaria.status === "Atenção" && "border-amber-500 text-amber-600",
                        )}
                      >
                        {secretaria.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Execução orçamentária</span>
                        <span className="font-semibold text-foreground">{secretaria.progress}%</span>
                      </div>
                      <Progress value={secretaria.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-primary">
                <AlertCircle className="h-5 w-5" />
                Prioridades e Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-3 rounded-lg border-2 border-destructive/50 bg-destructive/10 p-4 shadow-sm">
                  <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Atenção Urgente</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Saúde: 3 UBS com déficit de profissionais
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border-2 border-amber-500/50 bg-amber-500/10 p-4 shadow-sm">
                  <Clock className="h-5 w-5 shrink-0 text-amber-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Prazo Próximo</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Relatório PAEDS vence em 15 dias</p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border-2 border-secondary/50 bg-secondary/10 p-4 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Meta Alcançada</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Educação: 95% de matrículas realizadas
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border-2 border-primary/50 bg-primary/10 p-4 shadow-sm">
                  <Target className="h-5 w-5 shrink-0 text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">PAEDS 2030-2050</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      68% das metas estratégicas em andamento
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-l-4 border-l-accent">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                Projetos Intersetoriais em Destaque
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    name: "Porto Velho Sustentável",
                    secretarias: ["Meio Ambiente", "Infraestrutura", "Educação"],
                    progress: 72,
                    deadline: "Dez/2025",
                    status: "Em andamento",
                  },
                  {
                    name: "Cidade Inteligente",
                    secretarias: ["Tecnologia", "Segurança", "Mobilidade"],
                    progress: 58,
                    deadline: "Jun/2026",
                    status: "Em andamento",
                  },
                  {
                    name: "Saúde nas Escolas",
                    secretarias: ["Saúde", "Educação", "Assistência Social"],
                    progress: 85,
                    deadline: "Mar/2025",
                    status: "Avançado",
                  },
                ].map((projeto) => (
                  <div
                    key={projeto.name}
                    className="rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50"
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{projeto.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {projeto.secretarias.map((sec) => (
                            <Badge key={sec} variant="secondary" className="text-xs">
                              {sec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-semibold text-foreground">{projeto.progress}%</span>
                        </div>
                        <Progress value={projeto.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Prazo: {projeto.deadline}</span>
                        <Badge variant="outline" className="text-xs">
                          {projeto.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
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
