import { useEffect, useRef, useState, useCallback } from 'react'
import { createConsumer, Cable } from '@rails/actioncable'
import { getDeviceId, getDeviceType, getDeviceInfo, type DeviceType } from '@/lib/utils/device'

export interface Notification {
  type: 'ocorrencia_criada' | 'ocorrencia_atualizada' | 'ocorrencia_finalizada' | 'ocorrencia_removida' | 'sistema' | 'connection_established' | 'test'
  title?: string
  message?: string
  data?: {
    id?: number
    numero_bo?: string
    status?: string
    latitude?: number
    longitude?: number
    level?: 'info' | 'warning' | 'error'
    [key: string]: any
  }
  device_info?: {
    device_id: string
    device_type: DeviceType
    connected_at: string
  }
  timestamp?: string
}

interface UseNotificationsOptions {
  onNotification?: (notification: Notification) => void
  onConnect?: () => void
  onDisconnect?: () => void
  enabled?: boolean
}

interface UseNotificationsReturn {
  isConnected: boolean
  deviceId: string
  deviceType: DeviceType
  lastNotification: Notification | null
  notifications: Notification[]
  clearNotifications: () => void
  ping: (data?: any) => void
}

// URL do WebSocket (detecta automaticamente entre localhost e IP da rede)
const getWebSocketUrl = () => {
  // Pegar URL da API do env
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

  // Extrair base URL (sem /api/v1)
  const baseUrl = apiUrl.replace('/api/v1', '')

  // Converter http(s) para ws(s)
  const wsUrl = baseUrl.replace('http://', 'ws://').replace('https://', 'wss://')

  return `${wsUrl}/cable`
}

/**
 * Hook para conectar ao sistema de notificações em tempo real via Action Cable (WebSocket)
 *
 * Conecta automaticamente ao backend Rails e recebe notificações de:
 * - Novas ocorrências criadas
 * - Ocorrências atualizadas
 * - Ocorrências finalizadas
 * - Ocorrências removidas
 * - Notificações de sistema
 *
 * @example
 * ```tsx
 * const { isConnected, lastNotification } = useNotifications({
 *   onNotification: (notification) => {
 *     toast.success(notification.message)
 *   }
 * })
 * ```
 */
export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { onNotification, onConnect, onDisconnect, enabled = true } = options

  const [isConnected, setIsConnected] = useState(false)
  const [deviceId, setDeviceId] = useState<string>('')
  const [deviceType, setDeviceType] = useState<DeviceType>('unknown')
  const [lastNotification, setLastNotification] = useState<Notification | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const consumerRef = useRef<Cable | null>(null)
  const subscriptionRef = useRef<any>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  // Inicializar device info
  useEffect(() => {
    const id = getDeviceId()
    const type = getDeviceType()
    setDeviceId(id)
    setDeviceType(type)
    console.log('[Device] Device Info:', { device_id: id, device_type: type })
  }, [])

  useEffect(() => {
    if (!enabled || !deviceId || deviceType === 'unknown') {
      return
    }

    // Criar consumidor WebSocket
    const wsUrl = getWebSocketUrl()
    console.log('[WebSocket] Conectando ao canal de notificações:', wsUrl)
    console.log('[WebSocket] Device Info:', { device_id: deviceId, device_type: deviceType })

    const consumer = createConsumer(wsUrl)
    consumerRef.current = consumer

    // Subscrever ao canal de notificações COM device differentiation
    const subscription = consumer.subscriptions.create(
      {
        channel: 'NotificationsChannel',
        device_type: deviceType,  // ← Identifica tipo de dispositivo
        device_id: deviceId,      // ← ID único persistente
      },
      {
      connected() {
        console.log('[WebSocket] Conectado ao canal de notificações')
        setIsConnected(true)
        onConnect?.()

        // Limpar timeout de reconexão se existir
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = undefined
        }
      },

      disconnected() {
        console.log('[WebSocket] Desconectado do canal de notificações')
        setIsConnected(false)
        onDisconnect?.()

        // Tentar reconectar após 5 segundos
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[WebSocket] Tentando reconectar...')
          subscription?.unsubscribe()
          // O useEffect vai recriar a conexão
        }, 5000)
      },

        received(notification: Notification) {
          console.log('[WebSocket] Notificação recebida:', notification)

          // Processar mensagem de conexão estabelecida
          if (notification.type === 'connection_established') {
            if (notification.device_info) {
              console.log('[WebSocket] Conexão estabelecida:', notification.device_info)
              // Device info já foi setado no início, apenas logamos confirmação
            }
            return // Não adicionar à lista de notificações
          }

          setLastNotification(notification)

          // Manter últimas 100 notificações
          setNotifications((prev) => [notification, ...prev].slice(0, 100))

          // Callback customizado
          onNotification?.(notification)
        },
      }
    )

    subscriptionRef.current = subscription

    // Cleanup ao desmontar
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      subscription?.unsubscribe()
      consumer?.disconnect()
    }
  }, [enabled, deviceId, deviceType, onNotification, onConnect, onDisconnect])

  // Limpar todas as notificações
  const clearNotifications = useCallback(() => {
    setNotifications([])
    setLastNotification(null)
  }, [])

  // Enviar ping ao servidor (útil para manter conexão viva)
  const ping = useCallback((data: any = {}) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.perform('ping', data)
    }
  }, [])

  return {
    isConnected,
    deviceId,
    deviceType,
    lastNotification,
    notifications,
    clearNotifications,
    ping,
  }
}
