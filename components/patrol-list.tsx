"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Clock, MapPin, Users } from "lucide-react"

interface PatrolListProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function PatrolList({ selectedId, onSelect }: PatrolListProps) {
  const patrols = [
    {
      id: "RT-001",
      vehicle: "Viatura 12",
      crew: "Sgt. Santos, Cb. Silva",
      status: "active",
      route: "Centro - Setor A",
      progress: 65,
      startTime: "06:00",
      estimatedEnd: "18:00",
      checkpoints: 8,
      completed: 5,
      incidents: 2,
    },
    {
      id: "RT-002",
      vehicle: "Viatura 08",
      crew: "Cb. Alves, Sd. Oliveira",
      status: "active",
      route: "Zona Leste - Setor B",
      progress: 45,
      startTime: "06:00",
      estimatedEnd: "18:00",
      checkpoints: 10,
      completed: 4,
      incidents: 1,
    },
    {
      id: "RT-003",
      vehicle: "Viatura 15",
      crew: "Ten. Costa",
      status: "active",
      route: "Zona Sul - Setor C",
      progress: 80,
      startTime: "06:00",
      estimatedEnd: "18:00",
      checkpoints: 6,
      completed: 5,
      incidents: 0,
    },
    {
      id: "RT-004",
      vehicle: "Viatura 21",
      crew: "Sd. Ferreira, Cb. Souza",
      status: "planned",
      route: "Zona Norte - Setor D",
      progress: 0,
      startTime: "18:00",
      estimatedEnd: "06:00",
      checkpoints: 12,
      completed: 0,
      incidents: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-chart-2 text-chart-2"
      case "planned":
        return "border-primary text-primary"
      case "completed":
        return "border-muted-foreground text-muted-foreground"
      default:
        return "border-muted-foreground text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Em Patrulha"
      case "planned":
        return "Planejada"
      case "completed":
        return "Concluída"
      default:
        return "Inativa"
    }
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-3">
        {patrols.map((patrol) => (
          <button
            key={patrol.id}
            onClick={() => onSelect(patrol.id)}
            className={cn(
              "w-full rounded-lg border border-border p-4 text-left transition-all hover:border-primary hover:shadow-md",
              selectedId === patrol.id && "border-primary bg-primary/5 shadow-md",
            )}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{patrol.vehicle}</p>
                  <p className="text-sm text-muted-foreground">{patrol.id}</p>
                </div>
                <Badge variant="outline" className={cn("shrink-0", getStatusColor(patrol.status))}>
                  {getStatusLabel(patrol.status)}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{patrol.crew}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{patrol.route}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {patrol.startTime} - {patrol.estimatedEnd}
                  </span>
                </div>
              </div>

              {patrol.status === "active" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progresso da Rota</span>
                    <span className="font-semibold text-foreground">{patrol.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-chart-2 transition-all" style={{ width: `${patrol.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Checkpoints: {patrol.completed}/{patrol.checkpoints}
                    </span>
                    <span>Ocorrências: {patrol.incidents}</span>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
