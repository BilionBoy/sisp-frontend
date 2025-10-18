"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Clock, MapPin } from "lucide-react"

interface IncidentListProps {
  filters: {
    status: string
    priority: string
    type: string
    dateRange: string
  }
  selectedId: string | null
  onSelect: (id: string) => void
}

export function IncidentList({ filters, selectedId, onSelect }: IncidentListProps) {
  const incidents = [
    {
      id: "OC-2847",
      type: "Furto",
      location: "Centro - Rua das Flores, 234",
      time: "há 5 minutos",
      status: "Em Atendimento",
      priority: "high",
      description: "Furto em estabelecimento comercial",
    },
    {
      id: "OC-2846",
      type: "Perturbação",
      location: "Bairro Alto - Av. Principal, 890",
      time: "há 12 minutos",
      status: "Despachado",
      priority: "medium",
      description: "Perturbação do sossego público",
    },
    {
      id: "OC-2845",
      type: "Acidente",
      location: "Zona Sul - Rodovia BR-101, km 45",
      time: "há 18 minutos",
      status: "Resolvido",
      priority: "high",
      description: "Acidente de trânsito com vítimas",
    },
    {
      id: "OC-2844",
      type: "Suspeita",
      location: "Parque Industrial - Rua 7, 156",
      time: "há 25 minutos",
      status: "Em Análise",
      priority: "low",
      description: "Atividade suspeita relatada",
    },
    {
      id: "OC-2843",
      type: "Furto",
      location: "Centro - Praça da República",
      time: "há 32 minutos",
      status: "Pendente",
      priority: "medium",
      description: "Furto de veículo",
    },
    {
      id: "OC-2842",
      type: "Vandalismo",
      location: "Zona Norte - Escola Municipal",
      time: "há 45 minutos",
      status: "Resolvido",
      priority: "low",
      description: "Dano ao patrimônio público",
    },
    {
      id: "OC-2841",
      type: "Roubo",
      location: "Centro - Banco Central, 567",
      time: "há 1 hora",
      status: "Em Atendimento",
      priority: "high",
      description: "Tentativa de roubo",
    },
    {
      id: "OC-2840",
      type: "Perturbação",
      location: "Bairro Jardim - Rua das Acácias",
      time: "há 1 hora",
      status: "Despachado",
      priority: "medium",
      description: "Festa com som alto",
    },
  ]

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-3">
        {incidents.map((incident) => (
          <button
            key={incident.id}
            onClick={() => onSelect(incident.id)}
            className={cn(
              "w-full rounded-lg border border-border p-4 text-left transition-all hover:border-primary hover:shadow-md",
              selectedId === incident.id && "border-primary bg-primary/5 shadow-md",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      incident.priority === "high" && "bg-destructive",
                      incident.priority === "medium" && "bg-amber-500",
                      incident.priority === "low" && "bg-chart-2",
                    )}
                  />
                  <p className="font-semibold text-foreground">
                    {incident.id} - {incident.type}
                  </p>
                </div>

                <p className="text-sm text-foreground">{incident.description}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{incident.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{incident.time}</span>
                  </div>
                </div>
              </div>

              <Badge
                variant="outline"
                className={cn(
                  "shrink-0",
                  incident.status === "Em Atendimento" && "border-primary text-primary",
                  incident.status === "Resolvido" && "border-chart-2 text-chart-2",
                  incident.status === "Pendente" && "border-destructive text-destructive",
                )}
              >
                {incident.status}
              </Badge>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
