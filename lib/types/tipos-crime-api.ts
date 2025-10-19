/**
 * Tipos para API de Tipos de Crime
 * Endpoint: /api/v1/tipos_crime
 */

/**
 * Enum para gravidade do crime
 * Baseado na coluna `gravidade` da tabela tipos_crime
 */
export enum GravidadeCrime {
  BAIXA = "Baixa",
  MEDIA = "Média",
  ALTA = "Alta",
  ALTISSIMA = "Altíssima",
}

/**
 * Enum para categoria do crime
 */
export enum CategoriaCrime {
  CVP = "CVP", // Crimes Violentos contra a Pessoa
  CVE = "CVE", // Crimes Violentos contra o Estado
  CPP = "CPP", // Crimes contra o Patrimônio
  CVL = "CVL", // Crimes Violentos Letais
  OUTROS = "Outros",
}

/**
 * Estrutura de um tipo de crime retornado pela API
 */
export interface TipoCrimeAPI {
  id_tipo_crime: number
  codigo_senasp: string
  nome_crime: string
  categoria: CategoriaCrime
  descricao: string | null
  gravidade: GravidadeCrime
  ativo: boolean
  data_criacao: string // ISO 8601
}

/**
 * Resposta da API ao listar tipos de crime
 */
export interface ListTiposCrimeResponse {
  tipos_crime: TipoCrimeAPI[]
  current_page?: number
  per_page?: number
  total_pages?: number
  total_count?: number
}

/**
 * Parâmetros para filtrar tipos de crime
 */
export interface FiltrosTipoCrime {
  categoria?: CategoriaCrime
  ativo?: boolean
  page?: number
  items?: number
}

/**
 * Mapa de gravidade para prioridade do frontend
 */
export function gravidadeToPriority(gravidade: GravidadeCrime): "high" | "medium" | "low" {
  switch (gravidade) {
    case GravidadeCrime.ALTISSIMA:
    case GravidadeCrime.ALTA:
      return "high"
    case GravidadeCrime.MEDIA:
      return "medium"
    case GravidadeCrime.BAIXA:
      return "low"
    default:
      return "medium"
  }
}
