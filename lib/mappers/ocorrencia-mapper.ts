/**
 * Mapper para converter entre formatos de API e Frontend
 */

import type { OcorrenciaAPI } from "@/lib/types/ocorrencia-api"
import type { Incident } from "@/lib/types/map"
import { getTipoCrimeNome } from "@/lib/data/tipos-crime"
import { getBairroInfo, getLocalizacaoCompleta } from "@/lib/data/bairros"

/**
 * Mapeia prioridade baseado no tipo de crime e outros fatores
 */
function mapPriority(ocorrencia: OcorrenciaAPI): "high" | "medium" | "low" {
  // IDs de crimes graves (baseado nos dados)
  // TODO: Ajustar baseado na tabela real de tipos de crimes
  const crimesGravesIds = [1, 2, 3, 4, 5] // Homicídio, Latrocínio, etc

  if (crimesGravesIds.includes(ocorrencia.id_tipo_crime)) {
    return "high"
  }

  // Crimes com vítimas ou alto prejuízo = média prioridade
  if (ocorrencia.vitimas > 0 || (ocorrencia.valor_prejuizo && ocorrencia.valor_prejuizo > 5000)) {
    return "medium"
  }

  // Demais casos = baixa prioridade
  return "low"
}

/**
 * Mapeia status da API para status do frontend
 * ENUM PostgreSQL: 'Registrada', 'Em Investigação', 'Resolvida', 'Arquivada'
 */
function mapStatus(status: string): string {
  const statusMap: Record<string, string> = {
    "Registrada": "Pendente",
    "Em Investigação": "Em Investigação",
    "Resolvida": "Resolvido",
    "Arquivada": "Arquivado",
  }

  return statusMap[status] || status
}

/**
 * Gera ID no formato OC-XXXX
 */
function generateIncidentId(apiId: number, numeroBO?: string): string {
  if (apiId) {
    return `OC-${String(apiId).padStart(4, '0')}`
  }

  if (numeroBO) {
    // Extrai últimos 4 dígitos do BO
    const digits = numeroBO.replace(/\D/g, '').slice(-4)
    return `OC-${digits}`
  }

  return `OC-${Math.floor(1000 + Math.random() * 9000)}`
}

/**
 * Converte string de coordenada para número
 * API retorna: "-8.74960884" (string)
 * Precisamos: -8.74960884 (number)
 */
function parseCoordinate(coord: string | number): number {
  if (typeof coord === 'number') return coord
  const parsed = parseFloat(coord)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Converte OcorrenciaAPI para Incident (formato do frontend)
 */
export function ocorrenciaAPIToIncident(ocorrencia: OcorrenciaAPI): Incident {
  // Nome do tipo de crime (usando mapeamento real)
  const tipo = getTipoCrimeNome(ocorrencia.id_tipo_crime)

  // Informações do bairro (usando mapeamento real)
  const bairroInfo = getBairroInfo(ocorrencia.id_bairro)
  const bairro = bairroInfo.nome

  // Localização formatada "Bairro - Zona"
  const location = getLocalizacaoCompleta(ocorrencia.id_bairro)

  // Converter coordenadas de string para número
  const lat = parseCoordinate(ocorrencia.latitude_ocorrencia)
  const lng = parseCoordinate(ocorrencia.longitude_ocorrencia)

  // Endereço formatado
  const addressParts = []
  if (ocorrencia.logradouro) addressParts.push(ocorrencia.logradouro)
  if (ocorrencia.numero_endereco) addressParts.push(ocorrencia.numero_endereco)
  const address = addressParts.length > 0 ? addressParts.join(', ') : undefined

  return {
    id: generateIncidentId(ocorrencia.id_ocorrencia, ocorrencia.numero_bo),
    type: tipo,
    description: ocorrencia.descricao_ocorrencia || `Ocorrência ${ocorrencia.numero_bo}`,
    location,
    lat,
    lng,
    coordinates: [lat, lng],
    timestamp: ocorrencia.data_registro,
    status: mapStatus(ocorrencia.status_ocorrencia),
    priority: mapPriority(ocorrencia),
    bairro,
    zone: bairroInfo.zona,
    // Dados adicionais
    numeroBO: ocorrencia.numero_bo,
    address,
    pontoReferencia: ocorrencia.ponto_referencia || undefined,
    vitimas: ocorrencia.vitimas,
    valorPrejuizo: ocorrencia.valor_prejuizo || undefined,
    recuperado: ocorrencia.recuperado,
    // Dados originais da API para referência
    _apiData: ocorrencia,
  }
}

/**
 * Converte array de OcorrenciaAPI para array de Incident
 */
export function ocorrenciasAPIToIncidents(ocorrencias: OcorrenciaAPI[]): Incident[] {
  return ocorrencias.map(ocorrenciaAPIToIncident)
}

/**
 * Converte Incident parcial para formato de criação da API
 * (usado no formulário de nova ocorrência)
 */
export function incidentToOcorrenciaAPI(
  incident: Partial<Incident>,
  extraData?: Partial<OcorrenciaAPI>
): Partial<OcorrenciaAPI> {
  const now = new Date()
  const dataOcorrencia = incident.timestamp
    ? new Date(incident.timestamp).toISOString().split('T')[0]
    : now.toISOString().split('T')[0]

  const horaOcorrencia = incident.timestamp
    ? new Date(incident.timestamp).toTimeString().slice(0, 5)
    : now.toTimeString().slice(0, 5)

  // Determina dia da semana
  const diaSemana = incident.timestamp
    ? new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(new Date(incident.timestamp))
    : new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(now)

  // Determina período do dia baseado na hora
  const hora = parseInt(horaOcorrencia.split(':')[0])
  let periodoDia = "Manhã"
  if (hora >= 0 && hora < 6) periodoDia = "Madrugada"
  else if (hora >= 6 && hora < 12) periodoDia = "Manhã"
  else if (hora >= 12 && hora < 18) periodoDia = "Tarde"
  else periodoDia = "Noite"

  // Coordenadas devem ser strings
  const lat = incident.lat || incident.coordinates?.[0] || extraData?.latitude_ocorrencia || 0
  const lng = incident.lng || incident.coordinates?.[1] || extraData?.longitude_ocorrencia || 0

  return {
    numero_bo: incident.numeroBO || extraData?.numero_bo || "",
    descricao_ocorrencia: incident.description || extraData?.descricao_ocorrencia || null,
    data_ocorrencia: dataOcorrencia,
    hora_ocorrencia: horaOcorrencia,
    dia_semana: diaSemana,
    periodo_dia: periodoDia,
    latitude_ocorrencia: String(lat),
    longitude_ocorrencia: String(lng),
    logradouro: incident.address?.split(',')[0] || extraData?.logradouro || null,
    numero_endereco: incident.address?.split(',')[1]?.trim() || extraData?.numero_endereco || null,
    ponto_referencia: incident.pontoReferencia || extraData?.ponto_referencia || null,
    vitimas: incident.vitimas || extraData?.vitimas || 0,
    valor_prejuizo: incident.valorPrejuizo || extraData?.valor_prejuizo || null,
    recuperado: incident.recuperado || extraData?.recuperado || false,
    status_ocorrencia: incident.status || extraData?.status_ocorrencia || "Registrada",
    ...extraData,
  }
}
