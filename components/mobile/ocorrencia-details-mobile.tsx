"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { EncerrarOcorrenciaSheet } from "./encerrar-ocorrencia-sheet"
import { cn } from "@/lib/utils"
import type { Incident } from "@/lib/types/map"

// Mapa dinâmico (SSR desabilitado)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

interface OcorrenciaDetailsMobileProps {
  incident: Incident
  onBack: () => void
  onEncerrar: (id: number, data: { observacoes: string; resultado: string }) => Promise<void>
}

export function OcorrenciaDetailsMobile({
  incident,
  onBack,
  onEncerrar,
}: OcorrenciaDetailsMobileProps) {
  const [showEncerrarSheet, setShowEncerrarSheet] = useState(false)

  // Configuração de prioridade
  const priorityConfig = {
    high: {
      bg: "bg-red-50 dark:bg-red-950/20",
      text: "text-red-700 dark:text-red-400",
      badge: "bg-red-500",
      label: "Alta Prioridade",
    },
    medium: {
      bg: "bg-amber-50 dark:bg-amber-950/20",
      text: "text-amber-700 dark:text-amber-400",
      badge: "bg-amber-500",
      label: "Média Prioridade",
    },
    low: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      text: "text-blue-700 dark:text-blue-400",
      badge: "bg-blue-500",
      label: "Baixa Prioridade",
    },
  }

  const config = priorityConfig[incident.priority]

  // Status badge
  const statusConfig = {
    "Registrada": { variant: "default" as const, icon: FileText },
    "Em Investigação": { variant: "secondary" as const, icon: AlertTriangle },
    "Resolvida": { variant: "outline" as const, icon: CheckCircle2 },
    "Arquivada": { variant: "outline" as const, icon: FileText },
  }

  const statusInfo = statusConfig[incident.status as keyof typeof statusConfig] || statusConfig["Registrada"]
  const StatusIcon = statusInfo.icon

  // Handler para encerrar
  const handleEncerrarConfirm = async (data: { observacoes: string; resultado: string }) => {
    if (!incident._apiData?.id_ocorrencia) {
      throw new Error("ID da ocorrência não encontrado")
    }
    await onEncerrar(incident._apiData.id_ocorrencia, data)
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch {
      return "Data inválida"
    }
  }

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: ptBR })
    } catch {
      return "--:--"
    }
  }

  const isResolvida = incident.status === "Resolvida"

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sm truncate">Detalhes da Ocorrência</h1>
            <p className="text-xs text-muted-foreground">
              #{incident.numeroBO || incident.id}
            </p>
          </div>
        </div>
      </header>

      {/* Mapa */}
      <div className="w-full h-[35vh] bg-muted relative">
        <MapContainer
          center={[incident.lat, incident.lng]}
          zoom={15}
          className="h-full w-full"
          zoomControl={true}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[incident.lat, incident.lng]}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{incident.type}</p>
                <p className="text-xs text-muted-foreground">{incident.location}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Badge de prioridade no mapa */}
        <div className="absolute top-4 right-4 z-[1000]">
          <Badge className={cn("text-white shadow-lg", config.badge)}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </div>

      {/* Conteúdo Scrollable */}
      <div className="space-y-4 p-4">
        {/* Header da Ocorrência */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-xl leading-tight mb-2">
                  {incident.type}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={statusInfo.variant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {incident.status}
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs">
                    BO #{incident.numeroBO || incident.id}
                  </Badge>
                </div>
              </div>
            </div>

            {incident.description && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {incident.description}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Localização */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Localização</h3>
            </div>

            <div className="space-y-2 text-sm">
              {incident.address && (
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Endereço</span>
                  <span className="font-medium">{incident.address}</span>
                </div>
              )}

              {incident.bairro && (
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Bairro</span>
                  <span className="font-medium">{incident.bairro}</span>
                </div>
              )}

              {incident.zone && (
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Zona</span>
                  <span className="font-medium">{incident.zone}</span>
                </div>
              )}

              {incident._apiData?.ponto_referencia && (
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Ponto de Referência</span>
                  <span className="font-medium">{incident._apiData.ponto_referencia}</span>
                </div>
              )}

              <div className="flex flex-col pt-2 border-t">
                <span className="text-xs text-muted-foreground">Coordenadas</span>
                <span className="font-mono text-xs">
                  {incident.lat.toFixed(6)}, {incident.lng.toFixed(6)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data e Hora */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Data e Hora</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Data</span>
                <span className="font-medium">
                  {incident.timestamp ? formatDate(incident.timestamp) : "Não informada"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Hora</span>
                <span className="font-medium font-mono">
                  {incident.timestamp ? formatTime(incident.timestamp) : "--:--"}
                </span>
              </div>

              {incident._apiData?.periodo_dia && (
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-muted-foreground">Período</span>
                  <span className="font-medium">{incident._apiData.periodo_dia}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        {(incident.vitimas || incident.valorPrejuizo || incident.recuperado) && (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Informações Adicionais</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {incident.vitimas !== undefined && incident.vitimas > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Vítimas</span>
                      <span className="font-medium">{incident.vitimas}</span>
                    </div>
                  </div>
                )}

                {incident.valorPrejuizo && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Prejuízo</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(incident.valorPrejuizo)}
                      </span>
                    </div>
                  </div>
                )}

                {incident.recuperado !== undefined && (
                  <div className="flex items-center gap-2 col-span-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Recuperado</span>
                      <span className="font-medium">
                        {incident.recuperado ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Botões de Ação Fixos */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 space-y-2">
        {!isResolvida ? (
          <Button
            onClick={() => setShowEncerrarSheet(true)}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-base font-semibold"
            size="lg"
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Encerrar Ocorrência
          </Button>
        ) : (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Ocorrência Resolvida</span>
            </div>
          </div>
        )}

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-11"
          size="lg"
        >
          Voltar
        </Button>
      </div>

      {/* Sheet de Encerramento */}
      <EncerrarOcorrenciaSheet
        open={showEncerrarSheet}
        onClose={() => setShowEncerrarSheet(false)}
        onConfirm={handleEncerrarConfirm}
        incidentId={incident.numeroBO || incident.id}
        incidentType={incident.type}
      />
    </div>
  )
}
