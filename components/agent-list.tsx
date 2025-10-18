"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MapPin, Radio } from "lucide-react"

interface AgentListProps {
  searchTerm: string
  statusFilter: string
  selectedId: string | null
  onSelect: (id: string) => void
}

export function AgentList({ searchTerm, statusFilter, selectedId, onSelect }: AgentListProps) {
  const agents = [
    {
      id: "AG-001",
      name: "Sgt. Carlos Santos",
      badge: "12345",
      rank: "Sargento",
      status: "patrol",
      location: "Centro - Setor A",
      vehicle: "Viatura 12",
      shift: "Diurno",
      experience: "15 anos",
    },
    {
      id: "AG-002",
      name: "Cb. Maria Silva",
      badge: "12346",
      rank: "Cabo",
      status: "incident",
      location: "Bairro Alto - OC-2847",
      vehicle: "Viatura 08",
      shift: "Diurno",
      experience: "8 anos",
    },
    {
      id: "AG-003",
      name: "Sd. João Oliveira",
      badge: "12347",
      rank: "Soldado",
      status: "active",
      location: "Base Central",
      vehicle: "Não atribuída",
      shift: "Diurno",
      experience: "3 anos",
    },
    {
      id: "AG-004",
      name: "Ten. Ana Costa",
      badge: "12348",
      rank: "Tenente",
      status: "active",
      location: "Comando Central",
      vehicle: "Viatura 01",
      shift: "Diurno",
      experience: "12 anos",
    },
    {
      id: "AG-005",
      name: "Cb. Pedro Alves",
      badge: "12349",
      rank: "Cabo",
      status: "patrol",
      location: "Zona Sul - Setor C",
      vehicle: "Viatura 15",
      shift: "Diurno",
      experience: "7 anos",
    },
    {
      id: "AG-006",
      name: "Sd. Lucia Ferreira",
      badge: "12350",
      rank: "Soldado",
      status: "leave",
      location: "Licença Médica",
      vehicle: "Não atribuída",
      shift: "N/A",
      experience: "4 anos",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "patrol":
        return "border-chart-2 text-chart-2"
      case "incident":
        return "border-destructive text-destructive"
      case "active":
        return "border-primary text-primary"
      case "leave":
        return "border-amber-500 text-amber-500"
      default:
        return "border-muted-foreground text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "patrol":
        return "Em Patrulha"
      case "incident":
        return "Em Ocorrência"
      case "active":
        return "Em Serviço"
      case "leave":
        return "De Licença"
      default:
        return "Fora de Serviço"
    }
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-3">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelect(agent.id)}
            className={cn(
              "w-full rounded-lg border border-border p-4 text-left transition-all hover:border-primary hover:shadow-md",
              selectedId === agent.id && "border-primary bg-primary/5 shadow-md",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {agent.rank} • Matrícula {agent.badge}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("shrink-0", getStatusColor(agent.status))}>
                    {getStatusLabel(agent.status)}
                  </Badge>
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{agent.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Radio className="h-4 w-4" />
                    <span>{agent.vehicle}</span>
                  </div>
                </div>

                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Turno: {agent.shift}</span>
                  <span>Experiência: {agent.experience}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
