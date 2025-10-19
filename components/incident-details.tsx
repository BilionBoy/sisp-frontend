"use client"

import { useState, useMemo } from "react"
import { X, MapPin, Clock, User, Car, FileText, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { Incident } from "@/lib/types/map"

interface IncidentDetailsProps {
  incidentId: string
  onClose: () => void
  incidents?: Incident[]
  onResolve?: (id: number) => Promise<void>
}

export function IncidentDetails({ incidentId, onClose, incidents = [], onResolve }: IncidentDetailsProps) {
  const [isResolving, setIsResolving] = useState(false)

  // Buscar incident real dos dados
  const incident = useMemo(() => {
    return incidents.find(inc => inc.id === incidentId)
  }, [incidents, incidentId])

  // Se não encontrou, retornar null (não renderizar)
  if (!incident) {
    return null
  }

  // Função para resolver ocorrência
  const handleResolve = async () => {
    if (!incident._apiData?.id_ocorrencia) {
      toast.error("Erro: ID da ocorrência não encontrado")
      return
    }

    if (!onResolve) {
      toast.error("Erro: Função de resolução não disponível")
      return
    }

    try {
      setIsResolving(true)
      await onResolve(incident._apiData.id_ocorrencia)
      toast.success("Ocorrência resolvida com sucesso!")
      onClose()
    } catch (error) {
      console.error("Erro ao resolver ocorrência:", error)
      toast.error("Erro ao resolver ocorrência. Tente novamente.")
    } finally {
      setIsResolving(false)
    }
  }

  // Determinar se pode ser resolvida (não está resolvida ou arquivada)
  const canResolve = incident.status !== "Resolvido" && incident.status !== "Arquivado"

  // Formatar data/hora
  const formattedDate = incident.timestamp
    ? new Date(incident.timestamp).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    : "Não informado"

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-4 sm:px-6">
          <div>
            <CardTitle className="text-lg sm:text-2xl">Detalhes da Ocorrência</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{incident.id}</p>
            {incident.numeroBO && (
              <p className="text-xs text-muted-foreground">BO: {incident.numeroBO}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)] px-4 sm:px-6">
          {/* Status and Priority */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge variant="outline" className="border-primary text-primary text-xs sm:text-sm">
              {incident.status}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs sm:text-sm ${
                incident.priority === "high"
                  ? "border-destructive text-destructive"
                  : incident.priority === "medium"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-green-500 text-green-500"
              }`}
            >
              Prioridade {incident.priority === "high" ? "Alta" : incident.priority === "medium" ? "Média" : "Baixa"}
            </Badge>
          </div>

          {/* Main Info */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{incident.type}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{incident.description || "Sem descrição"}</p>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground">Localização</p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">
                    {incident.location || incident.bairro || "Não informado"}
                  </p>
                  {incident.address && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{incident.address}</p>
                  )}
                  {incident.pontoReferencia && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Ref: {incident.pontoReferencia}</p>
                  )}
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-mono mt-1">
                    {incident.lat.toFixed(5)}, {incident.lng.toFixed(5)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground">Data e Hora</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{formattedDate}</p>
                </div>
              </div>

              {incident.vitimas !== undefined && incident.vitimas > 0 && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground">Vítimas</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{incident.vitimas}</p>
                  </div>
                </div>
              )}

              {incident.valorPrejuizo !== undefined && incident.valorPrejuizo > 0 && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground">Valor do Prejuízo</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.valorPrejuizo)}
                    </p>
                    {incident.recuperado && (
                      <p className="text-[10px] sm:text-xs text-green-500 mt-1">✓ Recuperado</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:pt-4">
            {canResolve ? (
              <Button
                className="flex-1 text-xs sm:text-sm"
                onClick={handleResolve}
                disabled={isResolving}
              >
                {isResolving ? (
                  <>
                    <div className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Resolvendo...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Marcar como Resolvida
                  </>
                )}
              </Button>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Ocorrência já resolvida
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
