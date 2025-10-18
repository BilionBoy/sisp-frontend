"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

export function CrimeMap() {
  const regions = [
    { name: "Centro", crimes: 145, change: -12, risk: "medium" },
    { name: "Zona Norte", crimes: 89, change: -18, risk: "low" },
    { name: "Zona Sul", crimes: 123, change: -8, risk: "medium" },
    { name: "Zona Leste", crimes: 167, change: -15, risk: "high" },
    { name: "Zona Oeste", crimes: 54, change: -22, risk: "low" },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "border-destructive text-destructive"
      case "medium":
        return "border-amber-500 text-amber-500"
      case "low":
        return "border-chart-2 text-chart-2"
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Crimes por Região</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regions.map((region) => (
              <div key={region.name} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold text-foreground">{region.name}</p>
                      <p className="text-sm text-muted-foreground">{region.crimes} ocorrências em Jan/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getRiskColor(region.risk)}>
                      {getRiskLabel(region.risk)}
                    </Badge>
                    <Badge variant="outline" className="border-chart-2 text-chart-2">
                      {region.change}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${
                      region.risk === "high"
                        ? "bg-destructive"
                        : region.risk === "medium"
                          ? "bg-amber-500"
                          : "bg-chart-2"
                    }`}
                    style={{ width: `${(region.crimes / 167) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Crime Mais Comuns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { type: "Furto", count: 145, percent: 25 },
              { type: "Acidente de Trânsito", count: 234, percent: 40 },
              { type: "Roubo", count: 89, percent: 15 },
              { type: "Perturbação", count: 67, percent: 12 },
              { type: "Vandalismo", count: 43, percent: 8 },
            ].map((crime) => (
              <div key={crime.type} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-semibold text-foreground">{crime.type}</p>
                  <p className="text-sm text-muted-foreground">{crime.count} casos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{crime.percent}%</p>
                  <p className="text-xs text-muted-foreground">do total</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
