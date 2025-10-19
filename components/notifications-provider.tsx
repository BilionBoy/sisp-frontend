'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNotifications, type Notification } from '@/lib/hooks/use-notifications'
import { ocorrenciasKeys } from '@/lib/hooks/use-infinite-ocorrencias'
import { ocorrenciasAPI } from '@/lib/services/ocorrencias-api'
import { ocorrenciaAPIToIncident } from '@/lib/mappers/ocorrencia-mapper'
import { Badge } from './ui/badge'
import type { Incident } from '@/lib/types/map'

interface NotificationsProviderProps {
  children: React.ReactNode
}

/**
 * Provider de notificações em tempo real via WebSocket (Action Cable)
 *
 * Conecta ao backend Rails e exibe toasts quando:
 * - Nova ocorrência é criada
 * - Ocorrência é atualizada
 * - Ocorrência é finalizada
 * - Ocorrência é removida
 * - Mensagens de sistema são enviadas
 *
 * Também invalida cache do React Query automaticamente para atualizar listas.
 */
export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { isConnected, deviceId, deviceType, lastNotification } = useNotifications({
    onConnect: () => {
      console.log('[Notifications] Conectado ao sistema de notificações')
      console.log('[Notifications] Device ID:', deviceId)
   
    },

    onDisconnect: () => {
      console.log('[Notifications] Desconectado do sistema de notificações')
    },

    onNotification: (notification: Notification) => {
      handleNotification(notification)
    },

    enabled: true,
  })

  // Handler para processar notificações recebidas
  const handleNotification = async (notification: Notification) => {
    console.log('[Notifications] Processando notificação:', notification.type)

    // Handler especial para ocorrência criada: adicionar ao topo da lista
    if (notification.type === 'ocorrencia_criada' && notification.data?.id) {
      try {
        // Buscar ocorrência da API
        const ocorrenciaAPI = await ocorrenciasAPI.getById(notification.data.id)
        const newIncident = await ocorrenciaAPIToIncident(ocorrenciaAPI)

        // Adicionar ao topo de TODAS as queries de ocorrências (com e sem filtros)
        queryClient.setQueriesData(
          { queryKey: ocorrenciasKeys.lists() },
          (old: any) => {
            if (!old?.pages) return old

            // Verificar se já existe na lista (evitar duplicatas)
            const alreadyExists = old.pages.some((page: any) =>
              page.incidents.some((inc: Incident) => inc._apiData?.id_ocorrencia === notification.data.id)
            )

            if (alreadyExists) {
              console.log('[Notifications] Ocorrência já existe na lista, pulando')
              return old
            }

            // Adicionar ao topo da primeira página
            console.log('[Notifications] Adicionando nova ocorrência ao topo da lista:', newIncident.id)
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
      } catch (error) {
        console.error('[Notifications] Erro ao buscar ocorrência criada:', error)
        // Fallback: invalidar cache para forçar refresh
        queryClient.invalidateQueries({ queryKey: ocorrenciasKeys.all })
      }
    }

    // Invalidar cache para outros tipos de notificações de ocorrência
    if (notification.type.startsWith('ocorrencia_') && notification.type !== 'ocorrencia_criada') {
      queryClient.invalidateQueries({ queryKey: ocorrenciasKeys.all })
      console.log('[Notifications] Cache de ocorrências invalidado')
    }

    // Exibir toast baseado no tipo de notificação
    switch (notification.type) {
      case 'ocorrencia_criada':
        toast.success(notification.title, {
          description: notification.message,
          duration: 5000,
          action: notification.data?.id
            ? {
                label: 'Ver detalhes',
                onClick: () => {
                  // Navegar para detalhes (mobile ou web baseado no dispositivo)
                  const isMobile = window.innerWidth <= 768
                  if (isMobile) {
                    router.push(`/ocorrencias-mobile/${notification.data.id}`)
                  } else {
                    // No web, só mostra na lista lateral
                    toast.info('Ocorrência visível na lista lateral')
                  }
                },
              }
            : undefined,
        })
        break

      case 'ocorrencia_atualizada':
        toast.info(notification.title, {
          description: notification.message,
          duration: 4000,
        })
        break

      case 'ocorrencia_finalizada':
        toast.success(notification.title, {
          description: notification.message,
          duration: 5000,
          icon: '✅',
        })
        break

      case 'ocorrencia_removida':
        toast(notification.title, {
          description: notification.message,
          duration: 4000,
        })
        break

      case 'sistema':
        const level = notification.data?.level || 'info'
        if (level === 'error') {
          toast.error(notification.message, {
            duration: 7000,
          })
        } else if (level === 'warning') {
          toast.warning(notification.message, {
            duration: 6000,
          })
        } else {
          toast.info(notification.message, {
            duration: 5000,
          })
        }
        break

      case 'test':
        toast('🧪 ' + notification.title, {
          description: notification.message,
          duration: 3000,
        })
        break

      default:
        toast(notification.message, {
          duration: 4000,
        })
    }
  }

  // Efeito para debug de notificações (apenas em desenvolvimento)
  useEffect(() => {
    if (lastNotification && process.env.NODE_ENV === 'development') {
      console.log('[Notifications] Última notificação:', lastNotification)
    }
  }, [lastNotification])

  return <>{children}</>
}
