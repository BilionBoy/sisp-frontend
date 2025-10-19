"use client"

import { useState, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"
import { Plus, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { OcorrenciasListCompact } from "@/components/ocorrencias-list-compact"
import { PriorityWidget } from "@/components/priority-widget"
import { IncidentDetails } from "@/components/incident-details"
import { CreateOcorrenciaModal } from "@/components/create-ocorrencia-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useOcorrencias } from "@/lib/hooks/use-ocorrencias"
import { useSidebar } from "@/lib/contexts/sidebar-context"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import type { Incident } from "@/lib/types/map"

// Carregar mapa dinamicamente apenas no cliente
const EnhancedInteractiveMap = dynamic(
  () => import("@/components/maps/EnhancedInteractiveMap").then((mod) => mod.EnhancedInteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Carregando mapa interativo...</p>
      </div>
    ),
  }
)

export default function OcorrenciasPage() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [initialCoordinates, setInitialCoordinates] = useState<[number, number] | undefined>(undefined)

  // Estado de collapse da lista de ocorrências
  const [isListCollapsed, setIsListCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ocorrenciasList.collapsed')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  // Salvar estado no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ocorrenciasList.collapsed', JSON.stringify(isListCollapsed))
    }
  }, [isListCollapsed])

  // Obter estado da sidebar
  const { isCollapsed } = useSidebar()

  // Buscar dados da API
  const { incidents: allIncidents, isLoading, error, refresh, createOcorrencia, updateOcorrencia } = useOcorrencias()

  // Filtrar incidentes por prioridade
  const filteredIncidents = useMemo(() => {
    if (priorityFilter === "all") return allIncidents
    return allIncidents.filter(inc => inc.priority === priorityFilter)
  }, [allIncidents, priorityFilter])

  // Handler para clique em incidente (do mapa ou da lista)
  const handleIncidentClick = (id: string) => {
    setSelectedIncident(id)
  }

  // Handler para fechar modal de detalhes
  const handleCloseModal = () => {
    setSelectedIncident(null)
  }

  // Handler para criar nova ocorrência
  const handleCreateSuccess = (incident: Incident) => {
    // Atualiza a lista
    refresh()
  }

  // Handler para clique direito no mapa (criar ocorrência com coordenadas)
  const handleMapRightClick = (lat: number, lng: number) => {
    setInitialCoordinates([lat, lng])
    setShowCreateModal(true)
  }

  // Handler para resolver ocorrência
  const handleResolveOcorrencia = async (id: number) => {
    await updateOcorrencia(id, {
      status_ocorrencia: "Concluída"
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <Toaster position="top-right" richColors />

      <main className={cn(
        "transition-all duration-300",
        // Ajusta margem baseado no estado da sidebar (apenas desktop)
        isCollapsed ? "md:ml-16" : "md:ml-64"
      )}>
        {/* Container do mapa em tela cheia */}
        <div className="relative h-screen">
          {/* Mapa principal */}
          <div className="absolute inset-0">
            {isLoading && !allIncidents.length ? (
              <div className="w-full h-full bg-muted animate-pulse rounded-lg flex flex-col items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Carregando ocorrências...</p>
              </div>
            ) : error ? (
              <div className="w-full h-full bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
                <p className="text-destructive font-semibold">Erro ao carregar ocorrências</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
                <Button onClick={refresh} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            ) : (
              <EnhancedInteractiveMap
                incidents={filteredIncidents}
                onIncidentClick={handleIncidentClick}
                onMapRightClick={handleMapRightClick}
                center={[-8.76077, -63.8999]}
                zoom={12}
                showSearch={true}
                showAdvancedControls={true}
                showLegend={false}
                height="100%"
              />
            )}
          </div>
          <div className="absolute top-4 left-4 z-[1000]">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="shadow-lg"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nova Ocorrência
            </Button>
          </div>
          

          {/* Container lateral direito com flex para organizar widgets */}
          <div className="absolute top-4 bottom-4 right-2 sm:right-4 z-[1000] w-[calc(100vw-1rem)] sm:w-96 md:w-[28rem] flex flex-col gap-3 pointer-events-none">
            {/* Botão de Nova Ocorrência - Canto superior esquerdo */}
          
            {/* Widget de Prioridades */}
            <div className="pointer-events-auto">
              <PriorityWidget
                incidents={allIncidents}
                selectedPriority={priorityFilter}
                onPrioritySelect={setPriorityFilter}
              />
            </div>

            {/* Lista de Ocorrências */}
            <div className="flex-1 min-h-0 pointer-events-auto">
              <Card className="border-2 shadow-xl backdrop-blur-md bg-card/98 h-full flex flex-col">
                <CardHeader className="pb-3 shrink-0">
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <span>Ocorrências Recentes</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-normal text-muted-foreground">
                        {filteredIncidents.length} {filteredIncidents.length === 1 ? "ocorrência" : "ocorrências"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={refresh}
                        disabled={isLoading}
                      >
                        <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => setIsListCollapsed(!isListCollapsed)}
                      >
                        {isListCollapsed ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                {!isListCollapsed && (
                  <CardContent className="flex-1 min-h-0 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {isLoading && !allIncidents.length ? (
                      <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-muted-foreground">Carregando...</p>
                      </div>
                    ) : (
                      <OcorrenciasListCompact
                        incidents={filteredIncidents}
                        selectedId={selectedIncident}
                        onSelect={handleIncidentClick}
                        priorityFilter={priorityFilter}
                      />
                    )}
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Modal de Detalhes */}
        {selectedIncident && (
          <IncidentDetails
            incidentId={selectedIncident}
            onClose={handleCloseModal}
            incidents={allIncidents}
            onResolve={handleResolveOcorrencia}
          />
        )}

        {/* Modal de Criar Nova Ocorrência */}
        <CreateOcorrenciaModal
          open={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            setInitialCoordinates(undefined)
          }}
          onSuccess={handleCreateSuccess}
          onSubmit={createOcorrencia}
          initialCoordinates={initialCoordinates}
        />
      </main>
    </div>
  )
}
