"use client"

import { useState, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { Header } from "@/components/header"
import { OcorrenciasListCompact } from "@/components/ocorrencias-list-compact"
import { PriorityWidget } from "@/components/priority-widget"
import { IncidentDetails } from "@/components/incident-details"
import { CreateOcorrenciaModal } from "@/components/create-ocorrencia-modal"
import { CameraViewerModal } from "@/components/cameras/camera-viewer-modal"
import { MobileRedirect } from "@/components/mobile/mobile-redirect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInfiniteOcorrencias } from "@/lib/hooks/use-infinite-ocorrencias"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { useCameras } from "@/lib/hooks/use-cameras"
import { cn } from "@/lib/utils"
import type { Incident } from "@/lib/types/map"
import type { Camera } from "@/lib/types/camera"

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
  const [sourceCameraForOcorrencia, setSourceCameraForOcorrencia] = useState<Camera | undefined>(undefined)

  // Estado de collapse da lista de ocorrências
  // IMPORTANTE: Inicializar com false para evitar hydration error
  const [isListCollapsed, setIsListCollapsed] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  // Carregar estado salvo apenas no cliente (após mount)
  useEffect(() => {
    setHasMounted(true)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ocorrenciasList.collapsed')
      if (saved) {
        setIsListCollapsed(JSON.parse(saved))
      }
    }
  }, [])

  // Salvar estado no localStorage
  useEffect(() => {
    if (hasMounted && typeof window !== 'undefined') {
      localStorage.setItem('ocorrenciasList.collapsed', JSON.stringify(isListCollapsed))
    }
  }, [isListCollapsed, hasMounted])

  // Desktop: Paginação automática em background (50 em 50)
  const {
    incidents: allIncidents,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    error,
    refresh,
    createOcorrencia,
    updateOcorrencia
  } = useInfiniteOcorrencias()

  // Auto-load em background: carregar próximas páginas automaticamente
  useEffect(() => {
    if (!isLoading && hasMore && !isFetchingMore) {
      // Delay mínimo de 100ms entre cada página para evitar sobrecarga
      const timer = setTimeout(() => {
        console.log(`[AUTO-LOAD] Iniciando próxima página... (${allIncidents.length} carregados, hasMore: ${hasMore})`)
        loadMore()
      }, 100)
      return () => clearTimeout(timer)
    } else {
      console.log(`[AUTO-LOAD] Status: isLoading=${isLoading}, hasMore=${hasMore}, isFetchingMore=${isFetchingMore}, total=${allIncidents.length}`)
    }
  }, [allIncidents.length, hasMore, isFetchingMore, isLoading, loadMore])

  // Hook de câmeras
  const {
    onlineCameras,
    selectedCamera,
    selectCamera,
    navigateToNextCamera,
    navigateToPreviousCamera,
  } = useCameras()

  const debouncedPriorityFilter = useDebounce(priorityFilter, 300)

  // MAPA: Renderizar TODOS os pins (filtrados por prioridade se houver filtro)
  const filteredIncidents = useMemo(() => {
    const result = debouncedPriorityFilter === "all"
      ? allIncidents
      : allIncidents.filter(inc => inc.priority === debouncedPriorityFilter)

    console.log(`[DISPLAY] allIncidents: ${allIncidents.length}, filteredIncidents: ${result.length}, filter: ${debouncedPriorityFilter}`)
    return result
  }, [allIncidents, debouncedPriorityFilter])

  // LISTA LATERAL: Apenas 50 mais recentes (ordenados por data)
  const recentIncidents = useMemo(() => {
    const sorted = [...filteredIncidents].sort((a, b) => {
      // Ordenar por data de criação (mais recentes primeiro)
      const dateA = a._apiData?.data_ocorrencia ? new Date(a._apiData.data_ocorrencia).getTime() : 0
      const dateB = b._apiData?.data_ocorrencia ? new Date(b._apiData.data_ocorrencia).getTime() : 0
      return dateB - dateA
    })
    return sorted.slice(0, 50)
  }, [filteredIncidents])

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
    // Hook já adiciona localmente, não precisa fazer refresh
    // que poderia remover o item se houver paginação
    console.log('Ocorrência criada:', incident.id)
  }

  // Handler para clique direito no mapa (criar ocorrência com coordenadas)
  const handleMapRightClick = (lat: number, lng: number) => {
    setInitialCoordinates([lat, lng])
    setShowCreateModal(true)
  }

  // Handler para resolver ocorrência
  const handleResolveOcorrencia = async (id: number) => {
    // ENUM PostgreSQL: 'Registrada', 'Em Investigação', 'Resolvida', 'Arquivada'
    await updateOcorrencia(id, {
      status_ocorrencia: "Resolvida"
    })
  }

  // Handler para clique em câmera
  const handleCameraClick = (cameraId: number) => {
    selectCamera(cameraId)
  }

  // Handler para criar ocorrência a partir da câmera
  const handleCreateOcorrenciaFromCamera = (camera: Camera) => {
    setInitialCoordinates([camera.latitude, camera.longitude])
    setSourceCameraForOcorrencia(camera)
    setShowCreateModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Redirecionamento automático para mobile */}
      <MobileRedirect mobileRoute="/ocorrencias-mobile" desktopRoutes={["/ocorrencias"]} />

      <Header />

      <main>
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
              <div className="w-full h-full bg-muted rounded-lg flex flex-col items-center justify-center gap-4 px-4">
                <p className="text-destructive font-semibold">Sem conexão com servidor</p>
                <p className="text-sm text-muted-foreground max-w-md text-center">
                  {error.message?.includes('timeout')
                    ? 'O servidor não respondeu a tempo. Verifique sua conexão.'
                    : error.message?.includes('fetch')
                    ? 'Não foi possível conectar ao servidor.'
                    : error.message || "Não foi possível carregar as ocorrências"}
                </p>
                <p className="text-xs text-muted-foreground max-w-md text-center">
                  Certifique-se de que o servidor está rodando e acessível na rede.
                </p>
                <Button onClick={refresh} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            ) : (
              <EnhancedInteractiveMap
                incidents={filteredIncidents}
                cameras={onlineCameras}
                onIncidentClick={handleIncidentClick}
                onCameraClick={handleCameraClick}
                onMapRightClick={handleMapRightClick}
                center={[-8.76077, -63.8999]}
                zoom={12}
                showSearch={true}
                showAdvancedControls={true}
                showLegend={false}
                showCameras={true}
                height="100%"
                useViewportRendering={false}
                useCanvasRendering={true}
              />
            )}
          </div>

          {/* Container lateral direito com flex para organizar widgets */}
          <div className="absolute top-4 bottom-4 right-2 sm:right-4 z-[1000] w-[calc(100vw-1rem)] sm:w-96 md:w-[28rem] flex flex-col gap-3 pointer-events-none">
            {/* Widget de Prioridades */}
            <div className="pointer-events-auto">
              <PriorityWidget
                incidents={allIncidents}
                selectedPriority={priorityFilter}
                onPrioritySelect={setPriorityFilter}
              />
            </div>

            {/* Lista de Ocorrências */}
            <div className={cn(
              "pointer-events-auto transition-all duration-200",
              isListCollapsed ? "flex-none" : "flex-1 min-h-0"
            )}>
              <Card className={cn(
                "border-2 shadow-xl backdrop-blur-md bg-card/98 flex flex-col transition-all duration-200",
                isListCollapsed ? "h-auto" : "h-full"
              )}>
                <CardHeader className="pb-3 shrink-0">
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <span>Ocorrências Recentes</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-normal text-muted-foreground">
                        {recentIncidents.length} de {filteredIncidents.length}
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
                        incidents={recentIncidents}
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
          key={showCreateModal ? Date.now() : 'closed'}
          open={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            setInitialCoordinates(undefined)
            setSourceCameraForOcorrencia(undefined)
          }}
          onSuccess={handleCreateSuccess}
          onSubmit={createOcorrencia}
          initialCoordinates={initialCoordinates}
          sourceCamera={sourceCameraForOcorrencia}
        />

        {/* Modal de Visualização de Câmera */}
        <CameraViewerModal
          camera={selectedCamera}
          open={!!selectedCamera}
          onClose={() => selectCamera(null)}
          onNavigateNext={navigateToNextCamera}
          onNavigatePrevious={navigateToPreviousCamera}
          onCreateOcorrencia={handleCreateOcorrenciaFromCamera}
        />
      </main>
    </div>
  )
}
