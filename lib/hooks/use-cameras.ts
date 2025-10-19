/**
 * Hook para gerenciar estado das câmeras de segurança
 */

import { useState, useCallback, useMemo } from "react"
import { MOCK_CAMERAS, getCameraById } from "@/lib/data/mock-cameras"
import type { Camera } from "@/lib/types/camera"

export function useCameras() {
  const [cameras] = useState<Camera[]>(MOCK_CAMERAS)
  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(null)

  const selectedCamera = useMemo(() => {
    if (!selectedCameraId) return null
    return getCameraById(selectedCameraId)
  }, [selectedCameraId])

  const onlineCameras = useMemo(() => {
    return cameras.filter((camera) => camera.status === "online" && camera.ativo)
  }, [cameras])

  const selectCamera = useCallback((cameraId: number | null) => {
    setSelectedCameraId(cameraId)
  }, [])

  const navigateToNextCamera = useCallback(() => {
    if (!selectedCameraId) return
    const currentIndex = onlineCameras.findIndex((c) => c.id === selectedCameraId)
    const nextIndex = (currentIndex + 1) % onlineCameras.length
    setSelectedCameraId(onlineCameras[nextIndex].id)
  }, [selectedCameraId, onlineCameras])

  const navigateToPreviousCamera = useCallback(() => {
    if (!selectedCameraId) return
    const currentIndex = onlineCameras.findIndex((c) => c.id === selectedCameraId)
    const prevIndex = (currentIndex - 1 + onlineCameras.length) % onlineCameras.length
    setSelectedCameraId(onlineCameras[prevIndex].id)
  }, [selectedCameraId, onlineCameras])

  return {
    cameras,
    onlineCameras,
    selectedCamera,
    selectedCameraId,
    selectCamera,
    navigateToNextCamera,
    navigateToPreviousCamera,
  }
}
