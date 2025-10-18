"use client"

import { useState } from "react"
import { X, Zap, TrendingUp, Clock, Route, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface RouteOptimizerProps {
  onClose: () => void
}

export function RouteOptimizer({ onClose }: RouteOptimizerProps) {
  const [optimizing, setOptimizing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleOptimize = () => {
    setOptimizing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setOptimizing(false)
          setCompleted(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const improvements = [
    {
      metric: "Tempo de Resposta",
      current: "8.2 min",
      optimized: "6.5 min",
      improvement: "-21%",
      icon: Clock,
    },
    {
      metric: "Cobertura Territorial",
      current: "87%",
      optimized: "94%",
      improvement: "+7%",
      icon: Route,
    },
    {
      metric: "Eficiência de Combustível",
      current: "12.5 km/l",
      optimized: "14.8 km/l",
      improvement: "+18%",
      icon: TrendingUp,
    },
    {
      metric: "Checkpoints por Rota",
      current: "8",
      optimized: "10",
      improvement: "+25%",
      icon: CheckCircle,
    },
  ]

  const suggestions = [
    {
      title: "Redistribuição de Viaturas",
      description: "Realocar Viatura 15 da Zona Sul para Zona Norte durante horário de pico",
      impact: "Alto",
      effort: "Baixo",
    },
    {
      title: "Ajuste de Checkpoints",
      description: "Adicionar 3 checkpoints estratégicos em áreas de alta densidade de ocorrências",
      impact: "Médio",
      effort: "Baixo",
    },
    {
      title: "Otimização de Turnos",
      description: "Ajustar horários de patrulha baseado em análise preditiva de ocorrências",
      impact: "Alto",
      effort: "Médio",
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Otimização Inteligente de Rotas</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Análise preditiva com IA para máxima eficiência</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {!optimizing && !completed && (
            <>
              {/* Current Analysis */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Análise Atual</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {improvements.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">{item.metric}</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-foreground">{item.current}</p>
                          <p className="text-sm text-muted-foreground">atual</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Suggestions */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Sugestões de Otimização</h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-foreground">{suggestion.title}</p>
                        <div className="flex gap-2">
                          <Badge
                            variant="outline"
                            className={
                              suggestion.impact === "Alto"
                                ? "border-chart-2 text-chart-2"
                                : "border-amber-500 text-amber-500"
                            }
                          >
                            Impacto: {suggestion.impact}
                          </Badge>
                          <Badge variant="outline">Esforço: {suggestion.effort}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={handleOptimize}>
                  <Zap className="h-4 w-4 mr-2" />
                  Iniciar Otimização
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </>
          )}

          {optimizing && (
            <div className="py-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-6">
                  <Zap className="h-12 w-12 text-primary animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Otimizando Rotas...</h3>
                <p className="text-sm text-muted-foreground">Analisando dados históricos e padrões de ocorrências</p>
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm font-semibold text-foreground">{progress}%</p>
              </div>
            </div>
          )}

          {completed && (
            <>
              <div className="py-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-chart-2/10 p-6">
                    <CheckCircle className="h-12 w-12 text-chart-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Otimização Concluída!</h3>
                  <p className="text-sm text-muted-foreground">Novas rotas calculadas com sucesso</p>
                </div>
              </div>

              <Separator />

              {/* Results */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Resultados da Otimização</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {improvements.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">{item.metric}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Antes: {item.current}</p>
                            <p className="text-2xl font-bold text-foreground">{item.optimized}</p>
                          </div>
                          <Badge variant="outline" className="border-chart-2 text-chart-2">
                            {item.improvement}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-chart-2/50 bg-chart-2/10 p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-chart-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Impacto Estimado</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Com as novas rotas otimizadas, espera-se uma redução de 21% no tempo de resposta e aumento de 7%
                      na cobertura territorial, resultando em melhor atendimento à população.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Aplicar Novas Rotas</Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                  Revisar Depois
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
