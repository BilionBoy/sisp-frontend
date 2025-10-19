/**
 * Tipos e interfaces para o sistema de mapas interativos
 */

export interface Coordinates {
  lat: number
  lng: number
}

export interface Incident {
  id: string
  lat: number
  lng: number
  type: string
  priority: "high" | "medium" | "low"
  status: string
  description?: string
  address?: string
  timestamp?: string
  zone?: string
  zoneColor?: string
  reportedBy?: string
  bairro?: string
  bairroData?: {
    populacao: number
    indiceSocioeconomico: number
    iluminacaoPublica: number
    presencaPolicial: number
    taxaCriminalidade: number
  }
  // Campos adicionais da API
  coordinates?: [number, number] // [lat, lng] - alternativa a lat/lng
  location?: string // Nome completo da localização
  numeroBO?: string // Número do Boletim de Ocorrência
  pontoReferencia?: string
  vitimas?: number
  valorPrejuizo?: number
  recuperado?: boolean
  _apiData?: any // Dados originais da API para referência
}

export interface HeatmapPoint extends Coordinates {
  intensity: number
}

export interface MapLayer {
  id: string
  name: string
  visible: boolean
  type: "heatmap" | "markers" | "clusters" | "zones"
}

export interface MapZone {
  id: string
  name: string
  color: string
  coordinates: Coordinates[]
  incidentCount: number
}

export type MapView = "heat" | "markers" | "clusters"
export type TileLayer = "osm" | "carto-light" | "carto-dark" | "satellite"
