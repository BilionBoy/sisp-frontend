"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface CameraVideoPlayerProps {
  videoUrl: string
  cameraNome: string
}

/**
 * Player de vídeo YouTube embarcado para câmeras de segurança
 */
export function CameraVideoPlayer({ videoUrl, cameraNome }: CameraVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Reset loading state quando a URL mudar
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [videoUrl])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
            <p className="text-sm text-white/80">Carregando transmissão ao vivo...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/90">
          <div className="text-center px-4">
            <p className="text-white text-sm mb-2">Erro ao carregar vídeo</p>
            <p className="text-white/60 text-xs">
              A transmissão pode estar temporariamente indisponível
            </p>
          </div>
        </div>
      )}

      {/* YouTube Iframe */}
      <iframe
        src={`${videoUrl}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
        title={`Câmera de segurança - ${cameraNome}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
