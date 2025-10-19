"use client"

import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ocorrenciasAPI } from '@/lib/services/ocorrencias-api'
import { tiposCrimeAPI } from '@/lib/services/tipos-crime-api'
import { ocorrenciasAPIToIncidents, ocorrenciaAPIToIncident } from '@/lib/mappers/ocorrencia-mapper'
import { cacheDB } from '@/lib/cache/indexed-db'
import type { Incident } from '@/lib/types/map'
import type { OcorrenciaAPI, OcorrenciaFilters, CreateOcorrenciaPayload } from '@/lib/types/ocorrencia-api'
import { useMemo } from 'react'
import { ocorrenciasKeys, tiposCrimeKeys } from './use-ocorrencias-query'

export function useInfiniteOcorrencias(filters?: OcorrenciaFilters) {
  const queryClient = useQueryClient()

  useQuery({
    queryKey: tiposCrimeKeys.ativos(),
    queryFn: () => tiposCrimeAPI.listAtivos(),
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })

  const query = useInfiniteQuery({
    queryKey: ocorrenciasKeys.list(filters),
    queryFn: async ({ pageParam = 1 }) => {

      try {
        const ocorrencias = await ocorrenciasAPI.list({
          ...filters,
          page: pageParam,
          per_page: 100,
        })

        await Promise.all(
          ocorrencias.slice(0, 20).map(oc =>
            cacheDB.set('ocorrencias', String(oc.id_ocorrencia), oc, 10 * 60 * 1000).catch(() => {})
          )
        )

        const incidents = await ocorrenciasAPIToIncidents(ocorrencias)

        return {
          incidents,
          nextPage: ocorrencias.length === 100 ? pageParam + 1 : undefined,
          currentPage: pageParam,
        }
      } catch (error) {
        console.error('Erro ao buscar ocorrências da API:', error)

        const cachedOcorrencias = await cacheDB.getAll<OcorrenciaAPI>('ocorrencias').catch(() => [])

        if (cachedOcorrencias.length > 0) {
          console.log(`Usando ${cachedOcorrencias.length} ocorrências do cache offline`)
          const incidents = await ocorrenciasAPIToIncidents(cachedOcorrencias)
          return {
            incidents,
            nextPage: undefined,
            currentPage: 1,
          }
        }

        throw error
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })

  const allIncidents = useMemo(() => {
    if (!query.data) return []
    return query.data.pages.flatMap(page => page.incidents)
  }, [query.data])

  const createMutation = useMutation({
    mutationFn: async (payload: CreateOcorrenciaPayload) => {
      const ocorrencia = await ocorrenciasAPI.create(payload)
      return ocorrenciaAPIToIncident(ocorrencia)
    },
    onSuccess: (newIncident) => {
      queryClient.setQueryData(
        ocorrenciasKeys.list(filters),
        (old: any) => {
          if (!old) return old
          return {
            pages: [
              {
                incidents: [newIncident, ...(old.pages[0]?.incidents || [])],
                nextPage: old.pages[0]?.nextPage,
                currentPage: 1,
              },
              ...old.pages.slice(1),
            ],
            pageParams: old.pageParams,
          }
        }
      )
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<OcorrenciaAPI> }) => {
      const ocorrencia = await ocorrenciasAPI.update(id, { ocorrencia: payload as any })
      return ocorrenciaAPIToIncident(ocorrencia)
    },
    onSuccess: (updatedIncident, { id }) => {
      queryClient.setQueryData(
        ocorrenciasKeys.list(filters),
        (old: any) => {
          if (!old) return old
          return {
            pages: old.pages.map((page: any) => ({
              ...page,
              incidents: page.incidents.map((inc: Incident) =>
                inc._apiData?.id_ocorrencia === id ? updatedIncident : inc
              ),
            })),
            pageParams: old.pageParams,
          }
        }
      )
    },
  })

  return {
    incidents: allIncidents,
    isLoading: query.isLoading,
    isFetchingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage,
    loadMore: query.fetchNextPage,
    error: query.error,
    refresh: () => queryClient.invalidateQueries({ queryKey: ocorrenciasKeys.lists() }),
    createOcorrencia: createMutation.mutateAsync,
    updateOcorrencia: (id: number, payload: Partial<OcorrenciaAPI>) =>
      updateMutation.mutateAsync({ id, payload }),
  }
}
