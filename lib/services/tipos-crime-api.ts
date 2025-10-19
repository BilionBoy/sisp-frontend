/**
 * Serviço para API de Tipos de Crime
 * Base URL: /api/v1/tipos_crime
 */

import type {
  TipoCrimeAPI,
  ListTiposCrimeResponse,
  FiltrosTipoCrime,
} from "@/lib/types/tipos-crime-api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.0.1.66:3000/api/v1"

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout after 10 seconds')
    }
    throw error
  }
}

/**
 * Serviço para operações com tipos de crime
 */
export const tiposCrimeAPI = {
  /**
   * Listar todos os tipos de crime
   */
  async list(filtros?: FiltrosTipoCrime): Promise<TipoCrimeAPI[]> {
    const params = new URLSearchParams()

    if (filtros?.categoria) params.append("categoria", filtros.categoria)
    if (filtros?.ativo !== undefined) params.append("ativo", String(filtros.ativo))
    if (filtros?.page) params.append("page", String(filtros.page))
    if (filtros?.items) params.append("items", String(filtros.items))

    const queryString = params.toString()
    const endpoint = `/tipos_crime${queryString ? `?${queryString}` : ""}`

    const response = await fetchAPI<ListTiposCrimeResponse | TipoCrimeAPI[]>(endpoint)

    // API pode retornar array direto ou objeto com paginação
    if (Array.isArray(response)) {
      return response
    }

    return response.tipos_crime
  },

  /**
   * Buscar tipo de crime específico por ID
   */
  async getById(id: number): Promise<TipoCrimeAPI> {
    return fetchAPI<TipoCrimeAPI>(`/tipos_crime/${id}`)
  },

  /**
   * Buscar todos os tipos de crime ativos
   */
  async listAtivos(): Promise<TipoCrimeAPI[]> {
    return this.list({ ativo: true })
  },

  /**
   * Buscar tipos de crime por categoria
   */
  async listByCategoria(categoria: string): Promise<TipoCrimeAPI[]> {
    return this.list({ categoria: categoria as any })
  },
}

/**
 * Cache simples para tipos de crime (para evitar requests repetidos)
 */
let tiposCrimeCache: TipoCrimeAPI[] | null = null
let tiposCrimeCacheTimestamp: number = 0
let tiposCrimeCachePromise: Promise<TipoCrimeAPI[]> | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

/**
 * Buscar tipo de crime por ID com cache
 * OTIMIZAÇÃO: Evita múltiplas requisições simultâneas usando Promise cache
 */
export async function getTipoCrimeById(id: number): Promise<TipoCrimeAPI | null> {
  const now = Date.now()

  // Se cache está válido, buscar do cache
  if (tiposCrimeCache && now - tiposCrimeCacheTimestamp < CACHE_DURATION) {
    return tiposCrimeCache.find((t) => t.id_tipo_crime === id) || null
  }

  // Se já existe uma Promise em andamento, reutilizá-la
  // Isso evita centenas de requisições simultâneas quando cache está vazio
  if (tiposCrimeCachePromise) {
    try {
      const tipos = await tiposCrimeCachePromise
      return tipos.find((t) => t.id_tipo_crime === id) || null
    } catch (error) {
      console.error("Erro ao buscar tipos de crime (Promise cache):", error)
      return null
    }
  }

  // Cache inválido ou vazio, buscar da API
  try {
    // Criar Promise e armazená-la para reutilização
    tiposCrimeCachePromise = tiposCrimeAPI.listAtivos()

    tiposCrimeCache = await tiposCrimeCachePromise
    tiposCrimeCacheTimestamp = now

    // Limpar Promise cache após completar
    tiposCrimeCachePromise = null

    return tiposCrimeCache.find((t) => t.id_tipo_crime === id) || null
  } catch (error) {
    console.error("Erro ao buscar tipos de crime:", error)

    // Limpar Promise cache em caso de erro
    tiposCrimeCachePromise = null

    return null
  }
}

/**
 * Invalidar cache de tipos de crime
 */
export function invalidateTiposCrimeCache() {
  tiposCrimeCache = null
  tiposCrimeCacheTimestamp = 0
  tiposCrimeCachePromise = null
}
