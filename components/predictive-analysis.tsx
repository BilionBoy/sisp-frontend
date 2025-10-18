"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertTriangle, MapPin, Clock } from "lucide-react"

export function PredictiveAnalysis() {
  const predictions = [
    {
      title: "Aumento de Furtos no Centro",
      probability: 87,
      timeframe: "Próximas 48h",
      location: "Centro - Região Comercial",
      recommendation: "Aumentar patrulhamento em 30% durante horário comercial",
      impact: "high",
    },
    {
      title: "Pico de Acidentes na BR-101",
      probability: 72,
      timeframe: "Fim de semana",
      location: "BR-101, km 40-60",
      recommendation: "Posicionar viatura fixa e intensificar fiscalização",
      impact: "medium",
    },
    {
      title: "Redução de Ocorrências na Zona Norte",
      probability: 65,
      timeframe: "Próxima semana",
      location: "Zona Norte - Geral",
      recommendation: "Manter estratégia atual de patrulhamento",
      impact: "low",
    },
  ]

  const patterns = [
    {
      pattern: "Crimes em Horário Comercial",
      description: "68% das ocorrências acontecem entre 14h-18h em dias úteis",
      action: "Reforçar patrulhamento vespertino",
    },
    {
      pattern: "Correlação com Eventos",
      description: "Aumento de 45% em ocorrências durante eventos públicos",
      action: "Planejar operações especiais para eventos",
    },
    {
      pattern: "Sazonalidade Mensal",
      description: "Picos consistentes no início e fim do mês",
      action: "Ajustar escalas para períodos críticos",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Previsões Baseadas em IA</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Análise preditiva com machine learning</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{prediction.title}</h4>
                      <Badge
                        variant="outline"
                        className={
                          prediction.impact === "high"
                            ? "border-destructive text-destructive"
                            : prediction.impact === "medium"
                              ? "border-amber-500 text-amber-500"
                              : "border-chart-2 text-chart-2"
                        }
                      >
                        {prediction.impact === "high"
                          ? "Alto Impacto"
                          : prediction.impact === "medium"
                            ? "Médio Impacto"
                            : "Baixo Impacto"}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Probabilidade: {prediction.probability}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{prediction.timeframe}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{prediction.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-foreground">{prediction.probability}%</div>
                    <p className="text-xs text-muted-foreground">confiança</p>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 mt-3">
                  <p className="text-sm font-medium text-foreground mb-1">Recomendação:</p>
                  <p className="text-sm text-muted-foreground">{prediction.recommendation}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm">Aplicar Recomendação</Button>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Padrões Identificados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patterns.map((item, index) => (
              <div key={index} className="rounded-lg border border-border p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-1">{item.pattern}</p>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="rounded bg-primary/10 px-3 py-2">
                      <p className="text-xs font-medium text-primary">Ação Sugerida: {item.action}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
