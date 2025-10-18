"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { VehicleList } from "@/components/vehicle-list"
import { VehicleDetails } from "@/components/vehicle-details"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, CheckCircle, AlertTriangle, Wrench, Search, Plus } from "lucide-react"

export default function ViaturasPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const stats = {
    total: 38,
    active: 36,
    maintenance: 2,
    available: 4,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Gestão de Viaturas</h1>
            <p className="text-muted-foreground mt-1">Controle da frota e manutenção preventiva</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Viatura
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Viaturas</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Car className="h-8 w-8 text-chart-1" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Operação</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-chart-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Manutenção</p>
                <p className="text-2xl font-bold text-foreground">{stats.maintenance}</p>
              </div>
              <Wrench className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disponíveis</p>
                <p className="text-2xl font-bold text-foreground">{stats.available}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-chart-3" />
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por placa, modelo ou identificação..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="active">Em Operação</SelectItem>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="maintenance">Em Manutenção</SelectItem>
                  <SelectItem value="repair">Em Reparo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle List */}
        <Card>
          <CardHeader>
            <CardTitle>Frota de Viaturas</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleList
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              selectedId={selectedVehicle}
              onSelect={setSelectedVehicle}
            />
          </CardContent>
        </Card>

        {/* Vehicle Details Modal */}
        {selectedVehicle && <VehicleDetails vehicleId={selectedVehicle} onClose={() => setSelectedVehicle(null)} />}
      </main>
    </div>
  )
}
