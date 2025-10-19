'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, BellOff, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
} from '@/app/actions/push-notifications'

/**
 * Converte VAPID public key de base64 para Uint8Array
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

interface PushNotificationManagerProps {
  className?: string
  compact?: boolean
}

export function PushNotificationManager({
  className,
  compact = false,
}: PushNotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { toast } = useToast()

  // Verificar suporte e registrar Service Worker
  useEffect(() => {
    if (typeof window === 'undefined') return

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    } else {
      console.warn('[Push] Push notifications não suportadas neste navegador')
    }
  }, [])

  /**
   * Registrar Service Worker e verificar subscription existente
   */
  async function registerServiceWorker() {
    try {
      // Registrar SW customizado para push notifications
      const registration = await navigator.serviceWorker.register('/sw-custom.js', {
        scope: '/',
        updateViaCache: 'none',
      })

      console.log('[Push] Service Worker registrado:', registration.scope)

      // Verificar se já existe subscription
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)

      if (sub) {
        console.log('[Push] Subscription existente encontrada')
      }
    } catch (error) {
      console.error('[Push] Erro ao registrar Service Worker:', error)
      toast({
        title: 'Erro ao registrar Service Worker',
        description: 'Não foi possível ativar notificações push.',
        variant: 'destructive',
      })
    }
  }

  /**
   * Inscrever-se para receber push notifications
   */
  const subscribeToPush = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: 'Não suportado',
        description: 'Seu navegador não suporta notificações push.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready

      // Solicitar permissão
      const permission = await Notification.requestPermission()

      if (permission !== 'granted') {
        toast({
          title: 'Permissão negada',
          description: 'Você precisa permitir notificações nas configurações do navegador.',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      // Criar subscription
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })

      setSubscription(sub)

      // Enviar subscription para o servidor
      const serializedSub = JSON.parse(JSON.stringify(sub))
      const result = await subscribeUser(serializedSub)

      if (result.success) {
        toast({
          title: 'Notificações ativadas!',
          description: 'Você receberá notificações sobre novas ocorrências.',
        })
      } else {
        throw new Error(result.error || 'Falha ao registrar subscription')
      }
    } catch (error) {
      console.error('[Push] Erro ao se inscrever:', error)
      toast({
        title: 'Erro ao ativar notificações',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, toast])

  /**
   * Cancelar inscrição de push notifications
   */
  const unsubscribeFromPush = useCallback(async () => {
    if (!subscription) return

    setIsLoading(true)

    try {
      await subscription.unsubscribe()
      await unsubscribeUser(subscription.endpoint)

      setSubscription(null)

      toast({
        title: 'Notificações desativadas',
        description: 'Você não receberá mais notificações push.',
      })
    } catch (error) {
      console.error('[Push] Erro ao desinscrever:', error)
      toast({
        title: 'Erro ao desativar notificações',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [subscription, toast])

  /**
   * Enviar notificação de teste
   */
  const sendTestNotification = useCallback(async () => {
    if (!subscription || !message.trim()) return

    setIsLoading(true)

    try {
      const result = await sendNotification(subscription, message)

      if (result.success) {
        toast({
          title: 'Notificação enviada!',
          description: 'Verifique suas notificações.',
        })
        setMessage('')
      } else {
        throw new Error(result.error || 'Falha ao enviar notificação')
      }
    } catch (error) {
      console.error('[Push] Erro ao enviar notificação:', error)
      toast({
        title: 'Erro ao enviar notificação',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [subscription, message, toast])

  // Versão compacta (para header/menu)
  if (compact) {
    return (
      <div className={className}>
        {isSupported ? (
          subscription ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={unsubscribeFromPush}
              disabled={isLoading}
              title="Desativar notificações"
            >
              <Bell className="h-4 w-4 text-green-500" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={subscribeToPush}
              disabled={isLoading}
              title="Ativar notificações"
            >
              <BellOff className="h-4 w-4 text-muted-foreground" />
            </Button>
          )
        ) : null}
      </div>
    )
  }

  // Versão completa (para página de configurações)
  if (!isSupported) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Notificações Push</CardTitle>
          <CardDescription>
            Seu navegador não suporta notificações push.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notificações Push</CardTitle>
            <CardDescription>
              Receba alertas sobre novas ocorrências e atualizações importantes
            </CardDescription>
          </div>
          <Badge variant={subscription ? 'default' : 'secondary'}>
            {subscription ? 'Ativado' : 'Desativado'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {subscription ? (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bell className="h-4 w-4 text-green-500" />
              <span>Você está inscrito para receber notificações push.</span>
            </div>

            {/* Teste de notificação (apenas em dev) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Enviar notificação de teste</p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Digite uma mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && message.trim()) {
                        sendTestNotification()
                      }
                    }}
                  />
                  <Button
                    onClick={sendTestNotification}
                    disabled={isLoading || !message.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <Button
              onClick={unsubscribeFromPush}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <BellOff className="h-4 w-4 mr-2" />
              Desativar Notificações
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BellOff className="h-4 w-4" />
              <span>Você não está inscrito para receber notificações push.</span>
            </div>

            <Button
              onClick={subscribeToPush}
              disabled={isLoading}
              className="w-full"
            >
              <Bell className="h-4 w-4 mr-2" />
              Ativar Notificações
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
