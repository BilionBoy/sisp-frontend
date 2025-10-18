"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { RouteMap } from "@/components/route-map"
import { PatrolList } from "@/components/patrol-list"
import { RouteOptimizer } from "@/components/route-optimizer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Route, Zap, Clock, TrendingUp, Plus } from "lucide-react"

export default function RoteamentoPage() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [optimizing, setOptimizing] = useState(false)

  const stats = {
    activeRoutes: 12,
    avgResponseTime: "6.5 min",
    coverage: "94%",
    efficiency: "+18%",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Roteamento Inteligente</h1>
            <p className="text-muted-foreground mt-1">Otimização de patrulhas com inteligência artificial</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOptimizing(true)}>
              <Zap className="h-4 w-4 mr-2" />
              Otimizar Rotas
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Rota
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rotas Ativas</p>
                <p className="text-2xl font-bold text-foreground">{stats.activeRoutes}</p>
              </div>
              <Route className="h-8 w-8 text-chart-1" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold text-foreground">{stats.avgResponseTime}</p>
              </div>
              <Clock className="h-8 w-8 text-chart-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cobertura</p>
                <p className="text-2xl font-bold text-foreground">{stats.coverage}</p>
              </div>
              <Route className="h-8 w-8 text-chart-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eficiência IA</p>
                <p className="text-2xl font-bold text-foreground">{stats.efficiency}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-chart-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Rotas e Patrulhas</CardTitle>
              </CardHeader>
              <CardContent>
                <RouteMap selectedRoute={selectedRoute} onRouteClick={setSelectedRoute} />
              </CardContent>
            </Card>
          </div>

          {/* Patrol List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Patrulhas Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <PatrolList selectedId={selectedRoute} onSelect={setSelectedRoute} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Route Optimizer Modal */}
        {optimizing && <RouteOptimizer onClose={() => setOptimizing(false)} />}
      </main>
    </div>
  )
}
