/**
 * Dados mockados de ocorrências baseados em Porto Velho, Rondônia
 * Coordenadas reais das diferentes zonas da cidade
 * Baseado em dados reais de criminalidade 2015-2019 e análise socioeconômica
 */

import type { Incident } from "@/lib/types/map"
import {
  CORES_ZONA,
  COORDENADAS_ZONAS,
  POPULACAO_TOTAL,
  CRIMES_POR_ZONA
} from "./porto-velho-data"
import { gerarOcorrenciasIndividuais, exportarDadosBairros } from "./generate-realistic-data"

// Zonas de Porto Velho com coordenadas centrais (compatibilidade com código anterior)
export const ZONES = {
  CENTRO: {
    name: "Centro",
    center: [COORDENADAS_ZONAS.Centro.lat, COORDENADAS_ZONAS.Centro.lng] as [number, number],
    color: CORES_ZONA.Centro,
  },
  LESTE: {
    name: "Zona Leste",
    center: [COORDENADAS_ZONAS.Leste.lat, COORDENADAS_ZONAS.Leste.lng] as [number, number],
    color: CORES_ZONA.Leste,
  },
  SUL: {
    name: "Zona Sul",
    center: [COORDENADAS_ZONAS.Sul.lat, COORDENADAS_ZONAS.Sul.lng] as [number, number],
    color: CORES_ZONA.Sul,
  },
  NORTE: {
    name: "Zona Norte",
    center: [COORDENADAS_ZONAS.Norte.lat, COORDENADAS_ZONAS.Norte.lng] as [number, number],
    color: CORES_ZONA.Norte,
  },
}

// Tipos de crime comuns
export const CRIME_TYPES = [
  "Furto",
  "Roubo",
  "Acidente de Trânsito",
  "Perturbação do Sossego",
  "Vandalismo",
  "Suspeita",
  "Violência Doméstica",
  "Tráfico de Drogas",
  "Assalto",
  "Arrombamento",
] as const

export const INCIDENT_STATUS = [
  "Pendente",
  "Em Análise",
  "Despachado",
  "Em Atendimento",
  "Resolvido",
  "Arquivado",
] as const

/**
 * Gera coordenada aleatória próxima a um ponto central
 */
function generateNearbyCoordinate(center: [number, number], radiusKm: number = 2): [number, number] {
  const [lat, lng] = center

  // 1 grau de latitude ≈ 111km
  // 1 grau de longitude ≈ 111km * cos(latitude)
  const latOffset = (Math.random() - 0.5) * (radiusKm / 111)
  const lngOffset = (Math.random() - 0.5) * (radiusKm / (111 * Math.cos(lat * Math.PI / 180)))

  return [lat + latOffset, lng + lngOffset]
}

/**
 * Gera timestamp aleatório nas últimas 24 horas
 */
function generateTimestamp(): string {
  const now = new Date()
  const hoursAgo = Math.floor(Math.random() * 24)
  const minutesAgo = Math.floor(Math.random() * 60)

  if (hoursAgo === 0) {
    return `Há ${minutesAgo} minutos`
  } else if (hoursAgo === 1) {
    return `Há 1 hora`
  } else {
    return `Há ${hoursAgo} horas`
  }
}

/**
 * Gera endereço realista para cada zona
 */
const ADDRESSES = {
  CENTRO: [
    "Av. Presidente Dutra",
    "Av. Carlos Gomes",
    "Rua José de Alencar",
    "Av. Campos Sales",
    "Rua Dom Pedro II",
    "Av. Sete de Setembro",
    "Rua Tabajara",
    "Av. Farquar",
  ],
  LESTE: [
    "Av. Jorge Teixeira",
    "Rua Almirante Barroso",
    "Av. Rio Madeira",
    "Rua Marechal Rondon",
    "Av. Governador Jorge Teixeira",
  ],
  SUL: [
    "BR-364",
    "Av. Lauro Sodré",
    "Rua Mamoré",
    "Av. Guaporé",
    "Rua Ji-Paraná",
  ],
  NORTE: [
    "Av. Pinheiro Machado",
    "Rua Antenor Duarte Vilaça",
    "Av. Imigrantes",
    "Rua Rui Barbosa",
  ],
  OESTE: [
    "Av. Tiradentes",
    "Rua Padre Chiquinho",
    "Av. Presidente Kennedy",
    "Rua Benjamin Constant",
  ],
}

/**
 * Gera lista de incidentes mockados usando dados realistas
 * Agora baseado em dados reais de bairros e análise socioeconômica
 */
export function generateMockIncidents(count: number = 200): Incident[] {
  return gerarOcorrenciasIndividuais(count)
}

/**
 * Incidentes pré-gerados para uso consistente
 * Gerados com base em dados realistas de Porto Velho
 */
export const MOCK_INCIDENTS = generateMockIncidents(200)

/**
 * Dados enriquecidos dos bairros de Porto Velho
 * Inclui população, índices socioeconômicos, crimes estimados, etc.
 */
export const BAIRROS_DATA = exportarDadosBairros()

/**
 * Estatísticas gerais de Porto Velho
 */
export const ESTATISTICAS_GERAIS = {
  populacaoTotal: POPULACAO_TOTAL,
  crimesPorZona: CRIMES_POR_ZONA,
  totalCrimes: Object.values(CRIMES_POR_ZONA).reduce((a, b) => a + b, 0),
  periodo: "2015-2019",
  totalBairros: BAIRROS_DATA.length,
  zonasCobertas: Object.keys(CRIMES_POR_ZONA).length
}

/**
 * Filtrar incidentes por período
 */
export function filterIncidentsByTimeRange(
  incidents: Incident[],
  range: "today" | "week" | "month" | "all"
): Incident[] {
  const now = new Date()

  return incidents.filter((incident) => {
    const timestamp = incident.timestamp

    if (range === "all") return true

    if (timestamp.includes("minutos")) {
      return true // Últimas horas
    }

    const hoursAgo = parseInt(timestamp.match(/\d+/)?.[0] || "0")

    switch (range) {
      case "today":
        return hoursAgo <= 24
      case "week":
        return hoursAgo <= 24 * 7
      case "month":
        return hoursAgo <= 24 * 30
      default:
        return true
    }
  })
}

/**
 * Estatísticas por zona (atualizado com dados realistas)
 */
export function getZoneStatistics(incidents: Incident[]) {
  const stats: Record<string, {
    name: string
    count: number
    highPriority: number
    mediumPriority: number
    lowPriority: number
    color: string
    populacao?: number
    crimesHistoricos?: number
    taxaCriminalidade?: number
  }> = {}

  // Inicializar com dados das zonas
  Object.values(ZONES).forEach(zone => {
    const zoneName = zone.name.replace("Zona ", "")
    const zoneKey = zoneName as keyof typeof CRIMES_POR_ZONA

    // Calcular população da zona
    const bairrosZona = BAIRROS_DATA.filter(b => b.zona === zoneKey)
    const populacaoZona = bairrosZona.reduce((sum, b) => sum + b.populacao, 0)

    stats[zone.name] = {
      name: zone.name,
      count: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
      color: zone.color,
      populacao: populacaoZona,
      crimesHistoricos: CRIMES_POR_ZONA[zoneKey] || 0,
      taxaCriminalidade: 0
    }
  })

  // Contar incidentes atuais
  incidents.forEach(incident => {
    if (incident.zone && stats[incident.zone]) {
      stats[incident.zone].count++
      if (incident.priority === "high") stats[incident.zone].highPriority++
      if (incident.priority === "medium") stats[incident.zone].mediumPriority++
      if (incident.priority === "low") stats[incident.zone].lowPriority++
    }
  })

  // Calcular taxa de criminalidade
  Object.values(stats).forEach(stat => {
    if (stat.populacao && stat.populacao > 0) {
      stat.taxaCriminalidade = Number(((stat.count / stat.populacao) * 100000).toFixed(2))
    }
  })

  return Object.values(stats).sort((a, b) => b.count - a.count)
}

/**
 * Estatísticas por tipo de crime
 */
export function getCrimeTypeStatistics(incidents: Incident[]) {
  const stats: Record<string, number> = {}

  incidents.forEach(incident => {
    stats[incident.type] = (stats[incident.type] || 0) + 1
  })

  return Object.entries(stats)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Heatmap data para leaflet.heat
 */
export function getHeatmapData(incidents: Incident[]): [number, number, number][] {
  return incidents.map(incident => [
    incident.lat,
    incident.lng,
    incident.priority === "high" ? 1.0 : incident.priority === "medium" ? 0.6 : 0.3
  ])
}
