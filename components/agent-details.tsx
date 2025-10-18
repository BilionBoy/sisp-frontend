"use client"

import { X, User, MapPin, Radio, Clock, Award, FileText, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AgentDetailsProps {
  agentId: string
  onClose: () => void
}

export function AgentDetails({ agentId, onClose }: AgentDetailsProps) {
  const agent = {
    id: agentId,
    name: "Sgt. Carlos Santos",
    badge: "12345",
    rank: "Sargento",
    status: "patrol",
    photo: "/police-officer.png",
    contact: {
      phone: "(11) 98765-4321",
      radio: "Canal 3 - Unidade 12",
      email: "carlos.santos@pm.gov.br",
    },
    assignment: {
      location: "Centro - Setor A",
      vehicle: "Viatura 12",
      shift: "Diurno (06:00 - 18:00)",
      partner: "Cb. Maria Silva",
    },
    info: {
      experience: "15 anos",
      specializations: ["Negociação", "Primeiros Socorros", "Operações Táticas"],
      certifications: ["Instrutor de Tiro", "Resgate em Altura"],
      joined: "15/03/2010",
    },
    performance: {
      incidents: 247,
      resolved: 235,
      responseTime: "6.5 min",
      rating: 4.8,
    },
    recentActivity: [
      { date: "18/01/2025 14:40", action: "Atendeu ocorrência OC-2847", type: "incident" },
      { date: "18/01/2025 12:30", action: "Iniciou patrulha no Setor A", type: "patrol" },
      { date: "18/01/2025 06:00", action: "Início do turno", type: "shift" },
      { date: "17/01/2025 18:00", action: "Fim do turno", type: "shift" },
    ],
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl">Perfil do Agente</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Header Info */}
          <div className="flex gap-6 mb-6">
            <img
              src={agent.photo || "/placeholder.svg"}
              alt={agent.name}
              className="h-24 w-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {agent.rank} • Matrícula {agent.badge}
                  </p>
                </div>
                <Badge variant="outline" className="border-chart-2 text-chart-2">
                  Em Patrulha
                </Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{agent.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Radio className="h-4 w-4" />
                  <span>{agent.contact.radio}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <Tabs defaultValue="assignment" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assignment">Atribuição</TabsTrigger>
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="performance">Desempenho</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
            </TabsList>

            <TabsContent value="assignment" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Localização Atual</p>
                    <p className="text-sm text-muted-foreground">{agent.assignment.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Radio className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Viatura</p>
                    <p className="text-sm text-muted-foreground">{agent.assignment.vehicle}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Turno</p>
                    <p className="text-sm text-muted-foreground">{agent.assignment.shift}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Parceiro</p>
                    <p className="text-sm text-muted-foreground">{agent.assignment.partner}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Experiência</p>
                  <p className="text-sm text-muted-foreground">{agent.info.experience}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ingresso: {agent.info.joined}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Especializações</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.info.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Certificações</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.info.certifications.map((cert) => (
                      <Badge key={cert} variant="outline">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Ocorrências Atendidas</p>
                    <p className="text-2xl font-bold text-foreground">{agent.performance.incidents}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Taxa de Resolução</p>
                    <p className="text-2xl font-bold text-foreground">
                      {((agent.performance.resolved / agent.performance.incidents) * 100).toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Tempo Médio de Resposta</p>
                    <p className="text-2xl font-bold text-foreground">{agent.performance.responseTime}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Avaliação</p>
                    <p className="text-2xl font-bold text-foreground">{agent.performance.rating}/5.0</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-3 mt-4">
              {agent.recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {index < agent.recentActivity.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                    <p className="text-sm text-foreground mt-1">{activity.action}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6 pt-6 border-t border-border">
            <Button className="flex-1">Reatribuir Viatura</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Ver Relatórios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
