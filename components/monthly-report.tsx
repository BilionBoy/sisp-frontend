"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar } from "lucide-react"

export function MonthlyReport() {
  const reports = [
    {
      month: "Janeiro 2025",
      date: "01/02/2025",
      status: "published",
      highlights: ["Redução de 15% nas ocorrências", "Melhoria no tempo de resposta", "87% de taxa de resolução"],
    },
    {
      month: "Dezembro 2024",
      date: "01/01/2025",
      status: "published",
      highlights: ["Operação de fim de ano bem-sucedida", "Aumento de 10% na força operacional"],
    },
    {
      month: "Novembro 2024",
      date: "01/12/2024",
      status: "published",
      highlights: ["Implementação de novas tecnologias", "Treinamento de 45 novos agentes"],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Relatórios Mensais</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Baixar Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.month} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{report.month}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Publicado em {report.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-chart-2 text-chart-2">
                      Publicado
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Destaques:</p>
                  <ul className="space-y-1">
                    {report.highlights.map((highlight, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { name: "Plano Anual de Segurança 2025", size: "2.4 MB", type: "PDF" },
              { name: "Orçamento Detalhado 2025", size: "1.8 MB", type: "PDF" },
              { name: "Relatório de Atividades 2024", size: "3.2 MB", type: "PDF" },
              { name: "Estatísticas Criminais 2024", size: "1.5 MB", type: "XLSX" },
            ].map((doc) => (
              <div key={doc.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded bg-muted p-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
