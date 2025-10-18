"use client"

import { X, MapPin, Clock, User, Car, FileText, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

interface IncidentDetailsProps {
  incidentId: string
  onClose: () => void
}

export function IncidentDetails({ incidentId, onClose }: IncidentDetailsProps) {
  // Mock data - in real app, fetch based on incidentId
  const incident = {
    id: incidentId,
    type: "Furto",
    description: "Furto em estabelecimento comercial. Suspeito fugiu a pé em direção ao norte.",
    location: "Centro - Rua das Flores, 234",
    coordinates: { lat: -23.5505, lng: -46.6333 },
    reportedAt: "2025-01-18 14:35:00",
    reportedBy: "Comerciante Local",
    status: "Em Atendimento",
    priority: "high",
    assignedTo: "Viatura 12 - Sgt. Santos",
    estimatedArrival: "3 minutos",
    updates: [
      { time: "14:35", user: "Sistema", message: "Ocorrência registrada" },
      { time: "14:36", user: "Central", message: "Viatura 12 despachada" },
      { time: "14:38", user: "Sgt. Santos", message: "A caminho do local" },
      { time: "14:40", user: "Sgt. Santos", message: "Chegando ao local" },
    ],
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl">Detalhes da Ocorrência</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{incident.id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Status and Priority */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-primary text-primary">
              {incident.status}
            </Badge>
            <Badge variant="outline" className="border-destructive text-destructive">
              Prioridade Alta
            </Badge>
          </div>

          {/* Main Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{incident.type}</h3>
              <p className="text-sm text-muted-foreground">{incident.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Localização</p>
                  <p className="text-sm text-muted-foreground">{incident.location}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {incident.coordinates.lat}, {incident.coordinates.lng}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Horário</p>
                  <p className="text-sm text-muted-foreground">{incident.reportedAt}</p>
                  <p className="text-xs text-muted-foreground mt-1">Reportado há 5 minutos</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Reportado por</p>
                  <p className="text-sm text-muted-foreground">{incident.reportedBy}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Atribuído a</p>
                  <p className="text-sm text-muted-foreground">{incident.assignedTo}</p>
                  <p className="text-xs text-muted-foreground mt-1">Chegada estimada: {incident.estimatedArrival}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Histórico de Atualizações
            </h4>
            <div className="space-y-3">
              {incident.updates.map((update, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {index < incident.updates.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-foreground">{update.user}</p>
                      <p className="text-xs text-muted-foreground">{update.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{update.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Add Update */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Adicionar Atualização</h4>
            <Textarea placeholder="Digite uma atualização sobre esta ocorrência..." rows={3} />
            <div className="flex gap-2">
              <Button size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Adicionar Atualização
              </Button>
              <Button variant="outline" size="sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Escalar Prioridade
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1">Marcar como Resolvida</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Reatribuir Viatura
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
