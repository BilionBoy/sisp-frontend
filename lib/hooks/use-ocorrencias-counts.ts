"use client"

import { useQuery } from '@tanstack/react-query'
import { ocorrenciasAPI } from '@/lib/services/ocorrencias-api'
import { ocorrenciasAPIToIncidents } from '@/lib/mappers/ocorrencia-mapper'
import { cacheDB } from '@/lib/cache/indexed-db'
import type { OcorrenciaAPI } from '@/lib/types/ocorrencia-api'

export const countsKeys = {
  all: ['ocorrencias-counts'] as const,
  byCriteria: (criteria?: string) => [...countsKeys.all, criteria] as const,
}

interface PriorityCounts {
  all: number
  high: number
  medium: number
  low: number
}

/**
 * Hook para buscar contagens totais de ocorrências por prioridade
 * Estratégia: Busca todas as ocorrências (cache-first) e conta localmente
 *
 * OTIMIZAÇÕES:
 * - Cache-first: mostra contagens do cache instantaneamente
 * - Background fetch: atualiza dados em segundo plano
 * - Evita múltiplas requisições para contagens
 */
export function useOcorrenciasCounts() {
  const query = useQuery({
    queryKey: countsKeys.byCriteria('priority'),
    queryFn: async (): Promise<PriorityCounts> => {
      // CACHE-FIRST: Buscar do IndexedDB primeiro
      const cached = await cacheDB.getAll<OcorrenciaAPI>('ocorrencias').catch(() => null)

      if (cached && cached.length > 0) {
        console.log(`Calculando contagens de ${cached.length} ocorrências do cache`)
        const incidents = await ocorrenciasAPIToIncidents(cached)

        return {
          all: incidents.length,
          high: incidents.filter(i => i.priority === 'high').length,
          medium: incidents.filter(i => i.priority === 'medium').length,
          low: incidents.filter(i => i.priority === 'low').length,
        }
      }

      // Se não tem cache, buscar da API
      try {
        // Buscar TODAS as ocorrências para contagem precisa
        const ocorrencias = await ocorrenciasAPI.list({ per_page: 10000 })

        // Cachear para próximas consultas
        await Promise.all(
          ocorrencias.slice(0, 100).map(oc =>
            cacheDB.set('ocorrencias', String(oc.id_ocorrencia), oc, 10 * 60 * 1000).catch(() => {})
          )
        )

        const incidents = await ocorrenciasAPIToIncidents(ocorrencias)

        return {
          all: incidents.length,
          high: incidents.filter(i => i.priority === 'high').length,
          medium: incidents.filter(i => i.priority === 'medium').length,
          low: incidents.filter(i => i.priority === 'low').length,
        }
      } catch (error) {
        console.error('Erro ao buscar contagens:', error)

        // Fallback para valores zerados
        return {
          all: 0,
          high: 0,
          medium: 0,
          low: 0,
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 1,
    retryDelay: 2000,
  })

  return {
    counts: query.data || { all: 0, high: 0, medium: 0, low: 0 },
    isLoading: query.isLoading,
    error: query.error,
  }
}
