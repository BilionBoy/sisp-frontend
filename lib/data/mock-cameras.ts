/**
 * Dados mockados de câmeras de segurança IP em Porto Velho
 *
 * URLs de vídeos ao vivo do YouTube (24/7 streams) que simulam câmeras de segurança
 */

import type { Camera } from "@/lib/types/camera"

export const MOCK_CAMERAS: Camera[] = [
  {
    id: 1,
    nome: "Câmera Centro - Av. 7 de Setembro",
    descricao: "Monitoramento do centro comercial de Porto Velho",
    localizacao: "Av. 7 de Setembro, Centro",
    latitude: -8.76077,
    longitude: -63.8999,
    videoUrl: "https://www.youtube.com/embed/1EiC9bvVGnk", // Earthcam NYC Times Square
    status: "online",
    bairro: "Centro",
    idBairro: 1,
    ativo: true,
  },
  {
    id: 2,
    nome: "Câmera Avenida Norte - Ponte",
    descricao: "Monitoramento de tráfego na Avenida Jorge Teixeira",
    localizacao: "Av. Jorge Teixeira, próximo à ponte",
    latitude: -8.7489,
    longitude: -63.8726,
    videoUrl: "https://www.youtube.com/embed/wCcMv7CUI1U", // Traffic camera live stream
    status: "online",
    bairro: "Agenor de Carvalho",
    idBairro: 2,
    ativo: true,
  },
  {
    id: 3,
    nome: "Câmera Zona Leste - Shopping",
    descricao: "Monitoramento da área comercial da zona leste",
    localizacao: "Av. Rio Madeira, Zona Leste",
    latitude: -8.7612,
    longitude: -63.8521,
    videoUrl: "https://www.youtube.com/embed/5_XSYlAfJZM", // Tokyo live camera
    status: "online",
    bairro: "Três Marias",
    idBairro: 3,
    ativo: true,
  },
  {
    id: 4,
    nome: "Câmera Zona Sul - Terminal Rodoviário",
    descricao: "Monitoramento da área do terminal rodoviário",
    localizacao: "Terminal Rodoviário, Zona Sul",
    latitude: -8.7834,
    longitude: -63.9156,
    videoUrl: "https://www.youtube.com/embed/AWpsv-tt6FI", // LA traffic camera
    status: "online",
    bairro: "Olaria",
    idBairro: 4,
    ativo: true,
  },
  {
    id: 5,
    nome: "Câmera Zona Norte - Parque da Cidade",
    descricao: "Monitoramento da área de lazer e segurança pública",
    localizacao: "Parque da Cidade, Zona Norte",
    latitude: -8.7302,
    longitude: -63.9012,
    videoUrl: "https://www.youtube.com/embed/jbPp6n-U6zQ", // Beach live camera
    status: "online",
    bairro: "Nacional",
    idBairro: 5,
    ativo: true,
  },
]

/**
 * Obtém câmera por ID
 */
export function getCameraById(id: number): Camera | undefined {
  return MOCK_CAMERAS.find((camera) => camera.id === id)
}

/**
 * Obtém câmeras próximas a uma coordenada
 */
export function getCamerasProximas(
  latitude: number,
  longitude: number,
  raioKm: number = 2
): Camera[] {
  return MOCK_CAMERAS.filter((camera) => {
    const distance = calculateDistance(
      latitude,
      longitude,
      camera.latitude,
      camera.longitude
    )
    return distance <= raioKm && camera.status === "online"
  })
}

/**
 * Calcula distância entre dois pontos em km (fórmula de Haversine)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Raio da Terra em km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
