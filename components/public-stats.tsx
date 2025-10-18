"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, Users, Car, TrendingDown } from "lucide-react"

export function PublicStats() {
  const stats = [
    {
      title: "Ocorrências em Janeiro",
      value: "578",
      change: "-15% vs Dez/2024",
      changeType: "positive" as const,
      icon: AlertTriangle,
      iconColor: "text-chart-1",
    },
    {
      title: "Taxa de Resolução",
      value: "87.3%",
      change: "+5.2% vs ano anterior",
      changeType: "positive" as const,
      icon: CheckCircle,
      iconColor: "text-chart-2",
    },
    {
      title: "Tempo Médio de Resposta",
      value: "6.5 min",
      change: "-1.7 min vs média 2024",
      changeType: "positive" as const,
      icon: Clock,
      iconColor: "text-chart-3",
    },
    {
      title: "Agentes em Serviço",
      value: "156",
      change: "94% da força total",
      changeType: "neutral" as const,
      icon: Users,
      iconColor: "text-chart-4",
    },
    {
      title: "Viaturas Operacionais",
      value: "38",
      change: "95% da frota",
      changeType: "neutral" as const,
      icon: Car,
      iconColor: "text-chart-5",
    },
    {
      title: "Redução de Crimes",
      value: "-18%",
      change: "vs mesmo período 2024",
      changeType: "positive" as const,
      icon: TrendingDown,
      iconColor: "text-chart-2",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p
                  className={`text-xs ${
                    stat.changeType === "positive"
                      ? "text-chart-2"
                      : stat.changeType === "negative"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className={`rounded-lg bg-muted p-3 ${stat.iconColor}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
