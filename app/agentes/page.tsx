"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { AgentList } from "@/components/agent-list"
import { AgentDetails } from "@/components/agent-details"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserCheck, UserX, Clock, Search, Plus } from "lucide-react"

export default function AgentesPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const stats = {
    total: 156,
    active: 147,
    onLeave: 6,
    offDuty: 3,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Gestão de Agentes</h1>
            <p className="text-muted-foreground mt-1">Controle e monitoramento da força operacional</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Agente
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Agentes</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-chart-1" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Serviço</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-chart-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">De Licença</p>
                <p className="text-2xl font-bold text-foreground">{stats.onLeave}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fora de Serviço</p>
                <p className="text-2xl font-bold text-foreground">{stats.offDuty}</p>
              </div>
              <UserX className="h-8 w-8 text-muted-foreground" />
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
                  placeholder="Buscar por nome, matrícula ou função..."
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
                  <SelectItem value="active">Em Serviço</SelectItem>
                  <SelectItem value="patrol">Em Patrulha</SelectItem>
                  <SelectItem value="incident">Em Ocorrência</SelectItem>
                  <SelectItem value="leave">De Licença</SelectItem>
                  <SelectItem value="offduty">Fora de Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Agent List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Agentes</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentList
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              selectedId={selectedAgent}
              onSelect={setSelectedAgent}
            />
          </CardContent>
        </Card>

        {/* Agent Details Modal */}
        {selectedAgent && <AgentDetails agentId={selectedAgent} onClose={() => setSelectedAgent(null)} />}
      </main>
    </div>
  )
}
