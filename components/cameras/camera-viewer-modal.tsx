"use client"

import { useEffect, useCallback } from "react"
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  AlertCircle,
  Maximize2,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CameraVideoPlayer } from "./camera-video-player"
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
 */
export function CameraViewerModal({
  camera,
  open,
  onClose,
  onNavigateNext,
  onNavigatePrevious,
  onCreateOcorrencia,
}: CameraViewerModalProps) {
  // Listener para teclas de navegação
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && onNavigateNext) {
        onNavigateNext()
      } else if (e.key === "ArrowLeft" && onNavigatePrevious) {
        onNavigatePrevious()
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onNavigateNext, onNavigatePrevious, onClose])

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border">
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

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

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
              Câmera Anterior
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
              Câmera Seguinte
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
      </DialogContent>
    </Dialog>
  )
}
