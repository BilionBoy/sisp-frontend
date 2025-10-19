/**
 * Serviço de API para Ocorrências
 * Comunicação com backend Rails
 */

import type {
  OcorrenciaAPI,
  CreateOcorrenciaPayload,
  UpdateOcorrenciaPayload,
  ListOcorrenciasResponse,
  OcorrenciaResponse,
  OcorrenciaFilters,
} from "@/lib/types/ocorrencia-api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.0.1.66:3000/api/v1"

/**
 * Helper para fazer requests HTTP
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const controller = new AbortController()
  // Timeout de 30s para permitir conexões mobile mais lentas
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message ||
        errorData.error ||
        `HTTP Error: ${response.status} ${response.statusText}`
      )
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout after 30 seconds')
    }
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

/**
 * Serviço de Ocorrências
 */
export const ocorrenciasAPI = {
  /**
   * Listar todas as ocorrências
   * GET /ocorrencias
   *
   * IMPORTANTE: API retorna resposta paginada:
   * {
   *   ocorrencias: [...],
   *   current_page: 1,
   *   per_page: 6,
   *   total_pages: 667,
   *   total_count: 4000
   * }
   */
  async list(filters?: OcorrenciaFilters): Promise<OcorrenciaAPI[]> {
    const params = new URLSearchParams()

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }

    // Se não especificado per_page, o backend usará seu default
    // Não forçamos um valor aqui para permitir que o hook controle

    const queryString = params.toString()
    const endpoint = `/ocorrencias${queryString ? `?${queryString}` : ""}`

    console.log(`[ocorrencias-api] Request: GET ${endpoint}`)
    console.log(`[ocorrencias-api] Filters:`, filters)

    const response = await fetchAPI<ListOcorrenciasResponse>(endpoint)

    console.log(`[ocorrencias-api] Response: ${response.ocorrencias?.length || 0} ocorrências, total_count: ${response.total_count}, total_pages: ${response.total_pages}`)

    // API retorna { ocorrencias: [...], ... }
    return response.ocorrencias || []
  },

  /**
   * Buscar ocorrência por ID
   * GET /ocorrencias/:id
   */
  async getById(id: number): Promise<OcorrenciaAPI> {
    const response = await fetchAPI<OcorrenciaAPI | OcorrenciaResponse>(
      `/ocorrencias/${id}`
    )

    // API pode retornar objeto direto ou wrapped em data
    if ('data' in response && response.data) {
      return response.data
    }

    return response as OcorrenciaAPI
  },

  /**
   * Criar nova ocorrência
   * POST /ocorrencias
   */
  async create(payload: CreateOcorrenciaPayload): Promise<OcorrenciaAPI> {
    const response = await fetchAPI<OcorrenciaAPI | OcorrenciaResponse>(
      "/ocorrencias",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    )

    if ('data' in response && response.data) {
      return response.data
    }

    return response as OcorrenciaAPI
  },

  /**
   * Atualizar ocorrência existente
   * PUT /ocorrencias/:id
   */
  async update(
    id: number,
    payload: UpdateOcorrenciaPayload
  ): Promise<OcorrenciaAPI> {
    const response = await fetchAPI<OcorrenciaAPI | OcorrenciaResponse>(
      `/ocorrencias/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    )

    if ('data' in response && response.data) {
      return response.data
    }

    return response as OcorrenciaAPI
  },

  /**
   * Deletar ocorrência
   * DELETE /ocorrencias/:id
   */
  async delete(id: number): Promise<void> {
    await fetchAPI(`/ocorrencias/${id}`, {
      method: "DELETE",
    })
  },
}

/**
 * Helper para construir payload de criação
 */
export function buildCreatePayload(
  data: Partial<{
    numero_bo: string
    id_tipo_crime: number
    id_bairro: number
    data_ocorrencia: string
    hora_ocorrencia: string
    dia_semana: string
    periodo_dia: string
    latitude_ocorrencia: number | string
    longitude_ocorrencia: number | string
    logradouro: string
    numero_endereco: string
    ponto_referencia: string
    descricao_ocorrencia: string
    vitimas: number
    valor_prejuizo: number
    recuperado: boolean
    status_ocorrencia: string
    origem_registro: string
    data_registro: string
    usuario_registro: number
  }>
): CreateOcorrenciaPayload {
  return {
    ocorrencia: {
      numero_bo: data.numero_bo || "",
      id_tipo_crime: data.id_tipo_crime || 23,
      id_bairro: data.id_bairro || 1,
      data_ocorrencia: data.data_ocorrencia || new Date().toISOString().split('T')[0],
      hora_ocorrencia: data.hora_ocorrencia || new Date().toTimeString().slice(0, 5),
      dia_semana: data.dia_semana || "",
      periodo_dia: data.periodo_dia || "Manhã",
      // IMPORTANTE: Coordenadas devem ser strings!
      latitude_ocorrencia: String(data.latitude_ocorrencia || 0),
      longitude_ocorrencia: String(data.longitude_ocorrencia || 0),
      logradouro: data.logradouro,
      numero_endereco: data.numero_endereco,
      ponto_referencia: data.ponto_referencia,
      descricao_ocorrencia: data.descricao_ocorrencia,
      vitimas: data.vitimas || 0,
      valor_prejuizo: data.valor_prejuizo,
      recuperado: data.recuperado || false,
      status_ocorrencia: data.status_ocorrencia || "Registrada",
      origem_registro: data.origem_registro || "Sistema Integrado",
      data_registro: data.data_registro || new Date().toISOString(),
      usuario_registro: data.usuario_registro,
    },
  }
}
