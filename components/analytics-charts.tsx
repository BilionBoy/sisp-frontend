"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface AnalyticsChartsProps {
  timeRange: string
}

export function AnalyticsCharts({ timeRange }: AnalyticsChartsProps) {
  const incidentData = [
    { month: "Jul", total: 678, resolved: 589, pending: 89 },
    { month: "Ago", total: 645, resolved: 567, pending: 78 },
    { month: "Set", total: 612, resolved: 543, pending: 69 },
    { month: "Out", total: 589, resolved: 521, pending: 68 },
    { month: "Nov", total: 601, resolved: 534, pending: 67 },
    { month: "Dez", total: 623, resolved: 551, pending: 72 },
    { month: "Jan", total: 578, resolved: 505, pending: 73 },
  ]

  const responseTimeData = [
    { day: "Seg", avg: 7.2, target: 8.0 },
    { day: "Ter", avg: 6.8, target: 8.0 },
    { day: "Qua", avg: 6.5, target: 8.0 },
    { day: "Qui", avg: 7.1, target: 8.0 },
    { day: "Sex", avg: 7.8, target: 8.0 },
    { day: "Sáb", avg: 6.2, target: 8.0 },
    { day: "Dom", avg: 5.9, target: 8.0 },
  ]

  const crimeTypeData = [
    { type: "Furto", count: 145 },
    { type: "Acidente", count: 234 },
    { type: "Roubo", count: 89 },
    { type: "Perturbação", count: 67 },
    { type: "Vandalismo", count: 43 },
  ]

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Ocorrências</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incidentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Total" />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Resolvidas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo de Resposta por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="avg" fill="hsl(var(--chart-2))" name="Tempo Médio (min)" />
                <Bar dataKey="target" fill="hsl(var(--chart-4))" name="Meta (min)" opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Tipo de Crime</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={crimeTypeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" className="text-xs" />
              <YAxis dataKey="type" type="category" className="text-xs" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Ocorrências" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
