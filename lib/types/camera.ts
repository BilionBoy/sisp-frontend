/**
 * Tipos e interfaces para o sistema de câmeras de segurança IP
 */

export interface Camera {
  id: number
  nome: string
  descricao: string
  localizacao: string
  latitude: number
  longitude: number
  videoUrl: string // URL do stream do YouTube (embed)
  status: "online" | "offline" | "manutencao"
  bairro?: string
  idBairro?: number
  ativo: boolean
}

export interface CameraWithOcorrencia extends Camera {
  idCamera?: number // Para compatibilidade com backend futuro
}

export type CameraStatus = "online" | "offline" | "manutencao"

export const CAMERA_STATUS_LABELS: Record<CameraStatus, string> = {
  online: "Online",
  offline: "Offline",
  manutencao: "Em Manutenção",
}

export const CAMERA_STATUS_COLORS: Record<CameraStatus, string> = {
  online: "#22c55e", // green
  offline: "#ef4444", // red
  manutencao: "#f59e0b", // yellow/orange
}
