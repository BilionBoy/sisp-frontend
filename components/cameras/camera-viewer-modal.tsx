"use client"

import { useEffect, useCallback, useState } from "react"
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  AlertCircle,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CameraVideoPlayer } from "./camera-video-player"
import { cn } from "@/lib/utils"
import type { Camera } from "@/lib/types/camera"
import { CAMERA_STATUS_LABELS } from "@/lib/types/camera"

interface CameraViewerModalProps {
  camera: Camera | null
  open: boolean
  onClose: () => void
  onNavigateNext?: () => void
  onNavigatePrevious?: () => void
  onCreateOcorrencia?: (camera: Camera) => void
}

/**
 * Modal de visualização de câmera com player de vídeo e navegação
 * Suporta 3 estados: normal, expandido (fullscreen) e minimizado (widget compacto)
 */
export function CameraViewerModal({
  camera,
  open,
  onClose,
  onNavigateNext,
  onNavigatePrevious,
  onCreateOcorrencia,
}: CameraViewerModalProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Reset estados quando modal fecha
  useEffect(() => {
    if (!open) {
      setIsExpanded(false)
      setIsMinimized(false)
    }
  }, [open])

  // Listener para teclas de navegação
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && onNavigateNext) {
        onNavigateNext()
      } else if (e.key === "ArrowLeft" && onNavigatePrevious) {
        onNavigatePrevious()
      } else if (e.key === "Escape") {
        if (isExpanded) {
          setIsExpanded(false) // Sair do fullscreen
        } else if (isMinimized) {
          setIsMinimized(false) // Restaurar do minimizado
        } else {
          onClose() // Fechar modal
        }
      } else if (e.key === "f" || e.key === "F") {
        setIsExpanded(!isExpanded) // Toggle fullscreen
      } else if (e.key === "m" || e.key === "M") {
        setIsMinimized(!isMinimized) // Toggle minimizar
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onNavigateNext, onNavigatePrevious, onClose, isExpanded, isMinimized])

  const handleCreateOcorrencia = useCallback(() => {
    if (camera && onCreateOcorrencia) {
      onCreateOcorrencia(camera)
      onClose()
    }
  }, [camera, onCreateOcorrencia, onClose])

  if (!camera) return null

  const currentTimestamp = new Date().toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  })

  // Renderizar widget minimizado
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[1300] animate-in slide-in-from-bottom-4">
        <Card className="w-80 border-2 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{camera.nome}</h3>
                <p className="text-xs text-muted-foreground truncate">{camera.localizacao}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsMinimized(false)}
                  title="Restaurar"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mini video preview */}
            <div className="aspect-video rounded-md overflow-hidden bg-black mb-3">
              <CameraVideoPlayer videoUrl={camera.videoUrl} cameraNome={camera.nome} />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMinimized(false)}
                className="flex-1 text-xs"
              >
                <ChevronUp className="h-3 w-3 mr-1" />
                Restaurar
              </Button>
              {onCreateOcorrencia && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCreateOcorrencia}
                  className="flex-1 text-xs"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Criar Ocorrência
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "p-0 flex flex-col overflow-hidden transition-all duration-300",
          isExpanded
            ? "max-w-[98vw] w-[98vw] max-h-[98vh] h-[98vh]"
            : "max-w-6xl w-[90vw] max-h-[90vh]"
        )}
      >
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                {camera.nome}
                <Badge variant="default" className="text-xs">
                  {CAMERA_STATUS_LABELS[camera.status]}
                </Badge>
              </DialogTitle>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{camera.localizacao}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{currentTimestamp}</span>
                </div>
              </div>

              {camera.descricao && (
                <p className="text-sm text-muted-foreground">{camera.descricao}</p>
              )}
            </div>

            {/* Botões de controle */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(true)}
                title="Minimizar (M)"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Restaurar (F)" : "Expandir (F)"}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Video Player */}
          <div className="p-6 pt-4">
            <CameraVideoPlayer videoUrl={camera.videoUrl} cameraNome={camera.nome} />
          </div>

          {/* Controls */}
          <div className="px-6 pb-6 space-y-4">
          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigatePrevious}
              disabled={!onNavigatePrevious}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="text-xs text-muted-foreground whitespace-nowrap">
              Use as setas do teclado para navegar
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateNext}
              disabled={!onNavigateNext}
              className="flex-1"
            >
              Seguinte
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Informações Adicionais */}
          {camera.bairro && (
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Bairro:</span>
                  <p className="font-medium">{camera.bairro}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Status:</span>
                  <p className="font-medium">{CAMERA_STATUS_LABELS[camera.status]}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Latitude:</span>
                  <p className="font-mono font-medium text-xs">
                    {camera.latitude.toFixed(5)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Longitude:</span>
                  <p className="font-mono font-medium text-xs">
                    {camera.longitude.toFixed(5)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Fechar
            </Button>

            {onCreateOcorrencia && (
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateOcorrencia}
                className="flex-1"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Criar Ocorrência
              </Button>
            )}
          </div>

          {/* Hint */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Dica:</p>
                <p>
                  Se você identificar algo suspeito na câmera, clique em &quot;Criar
                  Ocorrência&quot; para registrar o incidente. As coordenadas serão
                  preenchidas automaticamente com a localização da câmera.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
