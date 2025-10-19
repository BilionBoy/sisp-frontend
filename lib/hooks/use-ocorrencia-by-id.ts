"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ocorrenciasAPI } from '@/lib/services/ocorrencias-api'
import { ocorrenciaAPIToIncident } from '@/lib/mappers/ocorrencia-mapper'
import { cacheDB } from '@/lib/cache/indexed-db'
import type { Incident } from '@/lib/types/map'
import type { OcorrenciaAPI } from '@/lib/types/ocorrencia-api'

export const ocorrenciaByIdKeys = {
  all: ['ocorrencia-by-id'] as const,
  detail: (id: number) => [...ocorrenciaByIdKeys.all, id] as const,
}

/**
 * Hook para buscar uma ocorrência específica por ID
 * Estratégia: Cache-first, depois API
 */
export function useOcorrenciaById(id: number | null) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ocorrenciaByIdKeys.detail(id || 0),
    queryFn: async (): Promise<Incident | null> => {
      if (!id) return null

      // CACHE-FIRST: Tentar buscar do IndexedDB primeiro
      const cached = await cacheDB.get<OcorrenciaAPI>('ocorrencias', String(id)).catch(() => null)

      if (cached) {
        console.log(`Loaded ocorrência ${id} from cache`)
        return ocorrenciaAPIToIncident(cached)
      }

      // Se não tem cache, buscar da API
      try {
        const ocorrencia = await ocorrenciasAPI.getById(id)

        // Cachear para próximas consultas
        await cacheDB.set('ocorrencias', String(id), ocorrencia, 10 * 60 * 1000).catch(() => {})

        return ocorrenciaAPIToIncident(ocorrencia)
      } catch (error) {
        console.error(`Erro ao buscar ocorrência ${id}:`, error)
        return null
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id: ocorrenciaId, payload }: { id: number; payload: Partial<OcorrenciaAPI> }) => {
      const ocorrencia = await ocorrenciasAPI.update(ocorrenciaId, { ocorrencia: payload as any })
      return ocorrenciaAPIToIncident(ocorrencia)
    },
    onSuccess: (updatedIncident, { id: ocorrenciaId }) => {
      // Atualizar cache específico
      queryClient.setQueryData(ocorrenciaByIdKeys.detail(ocorrenciaId), updatedIncident)

      // Invalidar listas para refletir mudança
      queryClient.invalidateQueries({ queryKey: ['ocorrencias', 'list'] })
    },
  })

  return {
    incident: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateOcorrencia: (idOcorrencia: number, payload: Partial<OcorrenciaAPI>) =>
      updateMutation.mutateAsync({ id: idOcorrencia, payload }),
  }
}
