"use client"

import { X, Car, Gauge, Calendar, Wrench, Fuel, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface VehicleDetailsProps {
  vehicleId: string
  onClose: () => void
}

export function VehicleDetails({ vehicleId, onClose }: VehicleDetailsProps) {
  const vehicle = {
    id: vehicleId,
    plate: "ABC-1234",
    model: "Chevrolet S10",
    year: "2023",
    status: "active",
    photo: "/police-truck.jpg",
    specs: {
      color: "Branco",
      chassis: "9BWZZZ377VT004251",
      engine: "2.8 Turbo Diesel",
      capacity: "5 passageiros",
    },
    operational: {
      mileage: "45.230 km",
      fuel: 85,
      lastRefuel: "17/01/2025",
      avgConsumption: "12.5 km/l",
    },
    crew: {
      driver: "Sgt. Carlos Santos",
      partner: "Cb. Maria Silva",
      location: "Centro - Setor A",
    },
    maintenance: {
      last: "15/12/2024",
      next: "15/03/2025",
      history: [
        { date: "15/12/2024", type: "Preventiva", description: "Troca de óleo e filtros", cost: "R$ 450,00" },
        { date: "20/09/2024", type: "Corretiva", description: "Substituição de pneus", cost: "R$ 2.400,00" },
        { date: "10/06/2024", type: "Preventiva", description: "Revisão geral", cost: "R$ 850,00" },
      ],
    },
    equipment: [
      { name: "Rádio Comunicador", status: "operational" },
      { name: "Sirene e Giroflex", status: "operational" },
      { name: "Kit Primeiros Socorros", status: "operational" },
      { name: "Extintor", status: "expiring" },
      { name: "Cone de Sinalização (4x)", status: "operational" },
      { name: "Lanterna Tática", status: "operational" },
    ],
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl">Detalhes da Viatura</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Header Info */}
          <div className="space-y-4 mb-6">
            <img
              src={vehicle.photo || "/placeholder.svg"}
              alt={vehicle.model}
              className="w-full h-48 rounded-lg object-cover"
            />
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {vehicle.id} • {vehicle.plate}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {vehicle.model} {vehicle.year}
                </p>
              </div>
              <Badge variant="outline" className="border-chart-2 text-chart-2">
                Em Operação
              </Badge>
            </div>
          </div>

          <Separator className="my-6" />

          <Tabs defaultValue="operational" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="operational">Operacional</TabsTrigger>
              <TabsTrigger value="specs">Especificações</TabsTrigger>
              <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
              <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
            </TabsList>

            <TabsContent value="operational" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Combustível</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{vehicle.operational.fuel}%</span>
                    </div>
                    <Progress value={vehicle.operational.fuel} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Último abastecimento: {vehicle.operational.lastRefuel}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Gauge className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Quilometragem</p>
                      <p className="text-sm text-muted-foreground">{vehicle.operational.mileage}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Consumo médio: {vehicle.operational.avgConsumption}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Tripulação Atual</p>
                      <p className="text-sm text-muted-foreground">{vehicle.crew.driver}</p>
                      <p className="text-sm text-muted-foreground">{vehicle.crew.partner}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Localização Atual</p>
                      <p className="text-sm text-muted-foreground">{vehicle.crew.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Cor</p>
                    <p className="text-sm text-muted-foreground">{vehicle.specs.color}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Motor</p>
                    <p className="text-sm text-muted-foreground">{vehicle.specs.engine}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Chassi</p>
                    <p className="text-sm text-muted-foreground font-mono">{vehicle.specs.chassis}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Capacidade</p>
                    <p className="text-sm text-muted-foreground">{vehicle.specs.capacity}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Última Manutenção</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{vehicle.maintenance.last}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Próxima Manutenção</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{vehicle.maintenance.next}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Histórico de Manutenções</h4>
                <div className="space-y-3">
                  {vehicle.maintenance.history.map((item, index) => (
                    <div key={index} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {item.type}
                          </Badge>
                          <p className="text-sm font-medium text-foreground">{item.description}</p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{item.cost}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="equipment" className="space-y-3 mt-4">
              {vehicle.equipment.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm text-foreground">{item.name}</span>
                  <Badge
                    variant="outline"
                    className={
                      item.status === "operational" ? "border-chart-2 text-chart-2" : "border-amber-500 text-amber-500"
                    }
                  >
                    {item.status === "operational" ? "Operacional" : "Vencendo"}
                  </Badge>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6 pt-6 border-t border-border">
            <Button className="flex-1">Agendar Manutenção</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Registrar Abastecimento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
