/**
 * Tipos para integração com API de Ocorrências
 * Base URL: http://10.0.1.66:3000/api/v1
 *
 * ESTRUTURA REAL DA API (baseado na resposta)
 */

/**
 * Estrutura da ocorrência retornada pela API
 * IMPORTANTE: Campos em snake_case conforme API Rails
 */
export interface OcorrenciaAPI {
  id_ocorrencia: number
  numero_bo: string
  id_tipo_crime: number
  id_bairro: number
  data_ocorrencia: string // YYYY-MM-DD
  hora_ocorrencia: string // ISO 8601 datetime
  dia_semana: string
  periodo_dia: string // "Manhã" | "Tarde" | "Noite" | "Madrugada"
  latitude_ocorrencia: string // STRING na API! Ex: "-8.74960884"
  longitude_ocorrencia: string // STRING na API! Ex: "-63.89237171"
  logradouro: string | null
  numero_endereco: string | null
  ponto_referencia: string | null
  descricao_ocorrencia: string | null
  vitimas: number
  valor_prejuizo: number | null
  recuperado: boolean
  status_ocorrencia: string // "Registrada" | "Em Atendimento" | etc.
  origem_registro: string
  data_registro: string // ISO 8601
  usuario_registro: number | null
}

/**
 * Resposta da API ao listar ocorrências (PAGINADA)
 */
export interface ListOcorrenciasResponse {
  ocorrencias: OcorrenciaAPI[]
  current_page: number
  per_page: number
  total_pages: number
  total_count: number
}

/**
 * Resposta da API ao criar/atualizar/mostrar ocorrência
 */
export interface OcorrenciaResponse {
  data?: OcorrenciaAPI
  message?: string
}

/**
 * Payload para criar nova ocorrência
 */
export interface CreateOcorrenciaPayload {
  ocorrencia: {
    numero_bo: string
    id_tipo_crime: number
    id_bairro: number
    data_ocorrencia: string
    hora_ocorrencia: string
    dia_semana: string
    periodo_dia: string
    latitude_ocorrencia: string // STRING!
    longitude_ocorrencia: string // STRING!
    logradouro?: string
    numero_endereco?: string
    ponto_referencia?: string
    descricao_ocorrencia?: string
    vitimas: number
    valor_prejuizo?: number
    recuperado: boolean
    status_ocorrencia: string
    origem_registro: string
    data_registro: string
    usuario_registro?: number
  }
}

/**
 * Payload para atualizar ocorrência
 */
export interface UpdateOcorrenciaPayload {
  ocorrencia: Partial<{
    numero_bo: string
    id_tipo_crime: number
    id_bairro: number
    data_ocorrencia: string
    hora_ocorrencia: string
    dia_semana: string
    periodo_dia: string
    latitude_ocorrencia: string
    longitude_ocorrencia: string
    logradouro: string
    numero_endereco: string
    ponto_referencia: string
    descricao_ocorrencia: string
    vitimas: number
    valor_prejuizo: number
    recuperado: boolean
    status_ocorrencia: string
  }>
}

/**
 * Parâmetros de filtro para listagem
 */
export interface OcorrenciaFilters {
  numero_bo?: string
  id_tipo_crime?: number
  id_bairro?: number
  data_inicio?: string
  data_fim?: string
  status_ocorrencia?: string
  page?: number
  per_page?: number
}

/**
 * Status de ocorrência
 * VALORES REAIS DO ENUM POSTGRESQL (confirmado):
 * tipo_status_ocorrencia as enum ('Registrada', 'Em Investigação', 'Resolvida', 'Arquivada')
 */
export enum StatusOcorrencia {
  REGISTRADA = "Registrada",
  EM_INVESTIGACAO = "Em Investigação",
  RESOLVIDA = "Resolvida",
  ARQUIVADA = "Arquivada",
}

/**
 * Períodos do dia
 */
export enum PeriodoDia {
  MADRUGADA = "Madrugada",
  MANHA = "Manhã",
  TARDE = "Tarde",
  NOITE = "Noite",
}
