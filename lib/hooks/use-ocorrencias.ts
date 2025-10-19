/**
 * Hook customizado para gerenciar ocorrências
 * Integra com API e fornece estados de loading/error
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { ocorrenciasAPI } from "@/lib/services/ocorrencias-api"
import { ocorrenciasAPIToIncidents, ocorrenciaAPIToIncident } from "@/lib/mappers/ocorrencia-mapper"
import type { Incident } from "@/lib/types/map"
import type { OcorrenciaAPI, OcorrenciaFilters, CreateOcorrenciaPayload } from "@/lib/types/ocorrencia-api"

interface UseOcorrenciasReturn {
  incidents: Incident[]
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
  createOcorrencia: (payload: CreateOcorrenciaPayload) => Promise<Incident>
  updateOcorrencia: (id: number, payload: Partial<OcorrenciaAPI>) => Promise<Incident>
  deleteOcorrencia: (id: number) => Promise<void>
}

/**
 * Hook para buscar e gerenciar ocorrências da API
 */
export function useOcorrencias(filters?: OcorrenciaFilters): UseOcorrenciasReturn {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Busca ocorrências da API
   */
  const fetchOcorrencias = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const ocorrencias = await ocorrenciasAPI.list(filters)
      const mappedIncidents = ocorrenciasAPIToIncidents(ocorrencias)

      setIncidents(mappedIncidents)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao buscar ocorrências')
      setError(error)
      console.error('Erro ao buscar ocorrências:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  /**
   * Força atualização dos dados
   */
  const refresh = useCallback(async () => {
    await fetchOcorrencias()
  }, [fetchOcorrencias])

  /**
   * Cria nova ocorrência
   */
  const createOcorrencia = useCallback(async (payload: CreateOcorrenciaPayload): Promise<Incident> => {
    try {
      const novaOcorrencia = await ocorrenciasAPI.create(payload)
      const incident = ocorrenciaAPIToIncident(novaOcorrencia)

      // Adiciona ao estado local
      setIncidents(prev => [incident, ...prev])

      return incident
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao criar ocorrência')
      console.error('Erro ao criar ocorrência:', error)
      throw error
    }
  }, [])

  /**
   * Atualiza ocorrência existente
   */
  const updateOcorrencia = useCallback(async (
    id: number,
    payload: Partial<OcorrenciaAPI>
  ): Promise<Incident> => {
    try {
      const ocorrenciaAtualizada = await ocorrenciasAPI.update(id, { ocorrencia: payload })
      const incident = ocorrenciaAPIToIncident(ocorrenciaAtualizada)

      // Atualiza no estado local
      setIncidents(prev =>
        prev.map(inc => {
          // Verifica se é a mesma ocorrência (compara ID da API)
          if (inc._apiData?.id_ocorrencia === id) {
            return incident
          }
          return inc
        })
      )

      return incident
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao atualizar ocorrência')
      console.error('Erro ao atualizar ocorrência:', error)
      throw error
    }
  }, [])

  /**
   * Deleta ocorrência
   */
  const deleteOcorrencia = useCallback(async (id: number): Promise<void> => {
    try {
      await ocorrenciasAPI.delete(id)

      // Remove do estado local
      setIncidents(prev => prev.filter(inc => inc._apiData?.id_ocorrencia !== id))
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao deletar ocorrência')
      console.error('Erro ao deletar ocorrência:', error)
      throw error
    }
  }, [])

  // Busca inicial
  useEffect(() => {
    fetchOcorrencias()
  }, [fetchOcorrencias])

  return {
    incidents,
    isLoading,
    error,
    refresh,
    createOcorrencia,
    updateOcorrencia,
    deleteOcorrencia,
  }
}

/**
 * Hook para buscar uma ocorrência específica por ID
 */
export function useOcorrencia(id: number | null) {
  const [incident, setIncident] = useState<Incident | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setIncident(null)
      return
    }

    const fetchOcorrencia = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const ocorrencia = await ocorrenciasAPI.getById(id)
        const mappedIncident = ocorrenciaAPIToIncident(ocorrencia)

        setIncident(mappedIncident)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro ao buscar ocorrência')
        setError(error)
        console.error('Erro ao buscar ocorrência:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOcorrencia()
  }, [id])

  return {
    incident,
    isLoading,
    error,
  }
}
