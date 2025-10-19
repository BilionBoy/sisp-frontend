"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ocorrenciasAPI } from '@/lib/services/ocorrencias-api'
import { tiposCrimeAPI } from '@/lib/services/tipos-crime-api'
import { ocorrenciasAPIToIncidents, ocorrenciaAPIToIncident } from '@/lib/mappers/ocorrencia-mapper'
import { cacheDB } from '@/lib/cache/indexed-db'
import type { Incident } from '@/lib/types/map'
import type { OcorrenciaAPI, OcorrenciaFilters, CreateOcorrenciaPayload } from '@/lib/types/ocorrencia-api'

export const ocorrenciasKeys = {
  all: ['ocorrencias'] as const,
  lists: () => [...ocorrenciasKeys.all, 'list'] as const,
  list: (filters?: OcorrenciaFilters) => [...ocorrenciasKeys.lists(), filters] as const,
}

export const tiposCrimeKeys = {
  all: ['tipos_crime'] as const,
  ativos: () => [...tiposCrimeKeys.all, 'ativos'] as const,
}

export function useOcorrenciasQuery(filters?: OcorrenciaFilters) {
  const queryClient = useQueryClient()

  useQuery({
    queryKey: tiposCrimeKeys.ativos(),
    queryFn: () => tiposCrimeAPI.listAtivos(),
    staleTime: 10 * 60 * 1000,
  })

  const query = useQuery({
    queryKey: ocorrenciasKeys.list(filters),
    queryFn: async () => {
      const cached = await cacheDB.getAll<OcorrenciaAPI>('ocorrencias').catch(() => null)

      if (cached && cached.length > 0) {
        console.log(`Loaded ${cached.length} ocorrências from cache`)
        const mappedFromCache = await ocorrenciasAPIToIncidents(cached)
        queryClient.setQueryData(ocorrenciasKeys.list(filters), mappedFromCache)
      }

      const ocorrencias = await ocorrenciasAPI.list(filters)

      await Promise.all(
        ocorrencias.map(oc =>
          cacheDB.set('ocorrencias', String(oc.id_ocorrencia), oc, 10 * 60 * 1000).catch(() => {})
        )
      )

      return ocorrenciasAPIToIncidents(ocorrencias)
    },
    staleTime: 5 * 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: async (payload: CreateOcorrenciaPayload) => {
      const ocorrencia = await ocorrenciasAPI.create(payload)
      return ocorrenciaAPIToIncident(ocorrencia)
    },
    onSuccess: (newIncident) => {
      queryClient.setQueryData(
        ocorrenciasKeys.list(filters),
        (old: Incident[] | undefined) => [newIncident, ...(old || [])]
      )
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<OcorrenciaAPI> }) => {
      const ocorrencia = await ocorrenciasAPI.update(id, { ocorrencia: payload })
      return ocorrenciaAPIToIncident(ocorrencia)
    },
    onSuccess: (updatedIncident, { id }) => {
      queryClient.setQueryData(
        ocorrenciasKeys.list(filters),
        (old: Incident[] | undefined) =>
          old?.map(inc =>
            inc._apiData?.id_ocorrencia === id ? updatedIncident : inc
          ) || []
      )
    },
  })

  return {
    incidents: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refresh: () => queryClient.invalidateQueries({ queryKey: ocorrenciasKeys.lists() }),
    createOcorrencia: createMutation.mutateAsync,
    updateOcorrencia: (id: number, payload: Partial<OcorrenciaAPI>) =>
      updateMutation.mutateAsync({ id, payload }),
  }
}
