"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react"

export function PerformanceMetrics() {
  const kpis = [
    {
      name: "Taxa de Resolução",
      current: 87.3,
      target: 85,
      unit: "%",
      trend: "up",
      change: 5.2,
      status: "excellent",
    },
    {
      name: "Tempo de Resposta",
      current: 6.5,
      target: 8.0,
      unit: "min",
      trend: "down",
      change: -1.7,
      status: "excellent",
    },
    {
      name: "Cobertura Territorial",
      current: 94,
      target: 90,
      unit: "%",
      trend: "up",
      change: 7,
      status: "excellent",
    },
    {
      name: "Satisfação Cidadã",
      current: 4.2,
      target: 4.0,
      unit: "/5.0",
      trend: "up",
      change: 0.3,
      status: "good",
    },
    {
      name: "Eficiência Operacional",
      current: 92.4,
      target: 90,
      unit: "%",
      trend: "up",
      change: 4.2,
      status: "excellent",
    },
    {
      name: "Custo por Ocorrência",
      current: 245,
      target: 280,
      unit: "R$",
      trend: "down",
      change: -12.5,
      status: "excellent",
    },
  ]

  const teamPerformance = [
    { team: "Equipe Alpha", score: 95, incidents: 234, resolved: 223 },
    { team: "Equipe Bravo", score: 92, incidents: 198, resolved: 182 },
    { team: "Equipe Charlie", score: 88, incidents: 156, resolved: 137 },
    { team: "Equipe Delta", score: 91, incidents: 189, resolved: 172 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Indicadores-Chave de Desempenho (KPIs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {kpis.map((kpi) => (
              <div key={kpi.name} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{kpi.name}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-foreground">
                        {kpi.current}
                        {kpi.unit}
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          kpi.status === "excellent" ? "border-chart-2 text-chart-2" : "border-primary text-primary"
                        }
                      >
                        {kpi.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(kpi.change)}
                        {kpi.unit === "%" || kpi.unit === "/5.0" ? "" : "%"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Target className="h-5 w-5 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">
                      Meta: {kpi.target}
                      {kpi.unit}
                    </p>
                  </div>
                </div>
                <Progress value={(kpi.current / kpi.target) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.map((team, index) => (
              <div key={team.team} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {index === 0 && (
                      <div className="rounded-full bg-amber-500/10 p-2">
                        <Award className="h-5 w-5 text-amber-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{team.team}</p>
                      <p className="text-sm text-muted-foreground">
                        {team.incidents} ocorrências • {team.resolved} resolvidas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{team.score}</p>
                    <p className="text-xs text-muted-foreground">pontuação</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Taxa de Resolução</span>
                    <span className="font-semibold text-foreground">
                      {((team.resolved / team.incidents) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(team.resolved / team.incidents) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metas e Objetivos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { goal: "Reduzir tempo de resposta para 6 minutos", progress: 92, deadline: "Mar/2025" },
              { goal: "Aumentar taxa de resolução para 90%", progress: 97, deadline: "Jun/2025" },
              { goal: "Implementar 5 novas tecnologias", progress: 60, deadline: "Dez/2025" },
              { goal: "Treinar 100% dos agentes em novas técnicas", progress: 75, deadline: "Set/2025" },
            ].map((item, index) => (
              <div key={index} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{item.goal}</p>
                  <Badge variant="outline">{item.deadline}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-semibold text-foreground">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
