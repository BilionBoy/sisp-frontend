"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Gauge, Calendar, Users } from "lucide-react"

interface VehicleListProps {
  searchTerm: string
  statusFilter: string
  selectedId: string | null
  onSelect: (id: string) => void
}

export function VehicleList({ searchTerm, statusFilter, selectedId, onSelect }: VehicleListProps) {
  const vehicles = [
    {
      id: "VT-012",
      plate: "ABC-1234",
      model: "Chevrolet S10",
      year: "2023",
      status: "active",
      crew: "Sgt. Santos, Cb. Silva",
      mileage: "45.230 km",
      lastMaintenance: "15/12/2024",
      nextMaintenance: "15/03/2025",
      fuel: "85%",
    },
    {
      id: "VT-008",
      plate: "DEF-5678",
      model: "Toyota Hilux",
      year: "2022",
      status: "active",
      crew: "Cb. Alves, Sd. Oliveira",
      mileage: "62.450 km",
      lastMaintenance: "20/11/2024",
      nextMaintenance: "20/02/2025",
      fuel: "60%",
    },
    {
      id: "VT-015",
      plate: "GHI-9012",
      model: "Ford Ranger",
      year: "2023",
      status: "active",
      crew: "Ten. Costa",
      mileage: "38.120 km",
      lastMaintenance: "05/01/2025",
      nextMaintenance: "05/04/2025",
      fuel: "92%",
    },
    {
      id: "VT-003",
      plate: "JKL-3456",
      model: "Chevrolet S10",
      year: "2021",
      status: "maintenance",
      crew: "Não atribuída",
      mileage: "78.900 km",
      lastMaintenance: "10/01/2025",
      nextMaintenance: "Em manutenção",
      fuel: "45%",
    },
    {
      id: "VT-021",
      plate: "MNO-7890",
      model: "Volkswagen Amarok",
      year: "2024",
      status: "available",
      crew: "Não atribuída",
      mileage: "12.340 km",
      lastMaintenance: "28/12/2024",
      nextMaintenance: "28/03/2025",
      fuel: "100%",
    },
    {
      id: "VT-007",
      plate: "PQR-2345",
      model: "Toyota Hilux",
      year: "2020",
      status: "maintenance",
      crew: "Não atribuída",
      mileage: "95.670 km",
      lastMaintenance: "08/01/2025",
      nextMaintenance: "Em reparo",
      fuel: "30%",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-chart-2 text-chart-2"
      case "available":
        return "border-primary text-primary"
      case "maintenance":
        return "border-amber-500 text-amber-500"
      default:
        return "border-muted-foreground text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Em Operação"
      case "available":
        return "Disponível"
      case "maintenance":
        return "Em Manutenção"
      default:
        return "Fora de Serviço"
    }
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            onClick={() => onSelect(vehicle.id)}
            className={cn(
              "w-full rounded-lg border border-border p-4 text-left transition-all hover:border-primary hover:shadow-md",
              selectedId === vehicle.id && "border-primary bg-primary/5 shadow-md",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {vehicle.id} • {vehicle.plate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.model} {vehicle.year}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("shrink-0", getStatusColor(vehicle.status))}>
                    {getStatusLabel(vehicle.status)}
                  </Badge>
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{vehicle.crew}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Gauge className="h-4 w-4" />
                    <span>
                      {vehicle.mileage} • Combustível: {vehicle.fuel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Próxima manutenção: {vehicle.nextMaintenance}</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
