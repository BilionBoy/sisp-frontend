"use client"

import { Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { Camera as CameraIcon, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Camera } from "@/lib/types/camera"
import { CAMERA_STATUS_COLORS, CAMERA_STATUS_LABELS } from "@/lib/types/camera"

interface CameraMarkerProps {
  camera: Camera
  onCameraClick: (cameraId: number) => void
  isSelected?: boolean
}

/**
 * Cria ícone customizado de câmera
 */
const createCameraIcon = (status: Camera["status"], isSelected: boolean = false) => {
  const color = CAMERA_STATUS_COLORS[status]
  const borderColor = isSelected ? "#ffffff" : "rgba(0,0,0,0.3)"
  const borderWidth = isSelected ? "3" : "1.5"

  const svgIcon = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-camera" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z"
            fill="${color}"
            stroke="${borderColor}"
            stroke-width="${borderWidth}"
            filter="url(#shadow-camera)"/>

      <!-- Ícone de câmera dentro do pin -->
      <g transform="translate(9, 9)">
        <rect x="0" y="4" width="14" height="10" rx="2" fill="white" opacity="0.95"/>
        <circle cx="3" cy="2" r="2" fill="white" opacity="0.95"/>
        <path d="M14 7 L18 5 L18 13 L14 11 Z" fill="white" opacity="0.95"/>
      </g>

      ${isSelected ? `
        <circle cx="16" cy="16" r="8" fill="none" stroke="white" stroke-width="2" opacity="0.8">
          <animate attributeName="r" from="8" to="12" dur="1s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite"/>
        </circle>
      ` : ''}
    </svg>
  `

  return L.divIcon({
    html: svgIcon,
    className: `custom-camera-icon ${isSelected ? "active" : ""}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

/**
 * Componente de Popup da Câmera
 */
function CameraPopupContent({
  camera,
  onViewCamera,
}: {
  camera: Camera
  onViewCamera: () => void
}) {
  return (
    <div className="p-2 bg-background border-2 min-w-[250px]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <CameraIcon className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">{camera.nome}</h3>
        </div>
        <Badge
          variant={camera.status === "online" ? "default" : "secondary"}
          className="text-xs"
        >
          {CAMERA_STATUS_LABELS[camera.status]}
        </Badge>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2">
          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
          <span className="text-muted-foreground">{camera.localizacao}</span>
        </div>

        {camera.descricao && (
          <p className="text-muted-foreground text-xs">{camera.descricao}</p>
        )}

        {camera.bairro && (
          <div className="pt-2 border-t border-border">
            <span className="text-muted-foreground text-[10px]">Bairro:</span>
            <span className="ml-2 font-medium">{camera.bairro}</span>
          </div>
        )}
      </div>

      <Button
        size="sm"
        variant="default"
        className="w-full mt-3 h-7 text-xs"
        onClick={onViewCamera}
        disabled={camera.status !== "online"}
      >
        <CameraIcon className="h-3 w-3 mr-2" />
        {camera.status === "online" ? "Visualizar Câmera" : "Câmera Indisponível"}
      </Button>
    </div>
  )
}

/**
 * Componente de Marker de Câmera
 */
export function CameraMarker({ camera, onCameraClick, isSelected }: CameraMarkerProps) {
  return (
    <Marker
      position={[camera.latitude, camera.longitude]}
      icon={createCameraIcon(camera.status, isSelected)}
      eventHandlers={{
        click: () => {
          if (camera.status === "online") {
            onCameraClick(camera.id)
          }
        },
      }}
    >
      <Popup>
        <CameraPopupContent
          camera={camera}
          onViewCamera={() => onCameraClick(camera.id)}
        />
      </Popup>
    </Marker>
  )
}
