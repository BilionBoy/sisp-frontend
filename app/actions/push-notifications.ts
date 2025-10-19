'use server'

import webpush from 'web-push'

// Configurar VAPID details
webpush.setVapidDetails(
  'mailto:walace.wilker@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// Em produção, isso seria armazenado em banco de dados
// Por enquanto, usamos uma variável em memória para desenvolvimento
let subscriptions: PushSubscription[] = []

/**
 * Registrar nova subscription de push notification
 */
export async function subscribeUser(sub: PushSubscription) {
  try {
    // Em produção: await db.subscriptions.create({ data: sub })
    subscriptions.push(sub)
    console.log('[Push] Nova subscription registrada:', sub.endpoint)
    return { success: true }
  } catch (error) {
    console.error('[Push] Erro ao registrar subscription:', error)
    return { success: false, error: 'Failed to subscribe' }
  }
}

/**
 * Remover subscription de push notification
 */
export async function unsubscribeUser(endpoint: string) {
  try {
    // Em produção: await db.subscriptions.delete({ where: { endpoint } })
    subscriptions = subscriptions.filter(sub => sub.endpoint !== endpoint)
    console.log('[Push] Subscription removida:', endpoint)
    return { success: true }
  } catch (error) {
    console.error('[Push] Erro ao remover subscription:', error)
    return { success: false, error: 'Failed to unsubscribe' }
  }
}

/**
 * Enviar notificação para um usuário específico
 */
export async function sendNotification(
  subscription: PushSubscription,
  message: string
) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'SISP - Notificação',
        body: message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        data: {
          url: '/',
          timestamp: Date.now(),
        },
      })
    )
    console.log('[Push] Notificação enviada com sucesso')
    return { success: true }
  } catch (error) {
    console.error('[Push] Erro ao enviar notificação:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}

/**
 * Enviar notificação para todos os usuários inscritos
 */
export async function broadcastNotification(
  title: string,
  message: string,
  url?: string
) {
  try {
    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      data: {
        url: url || '/',
        timestamp: Date.now(),
      },
    })

    const results = await Promise.allSettled(
      subscriptions.map(sub => webpush.sendNotification(sub, payload))
    )

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    console.log(
      `[Push] Broadcast enviado: ${successful} sucesso, ${failed} falhas`
    )

    return {
      success: true,
      sent: successful,
      failed,
      total: subscriptions.length,
    }
  } catch (error) {
    console.error('[Push] Erro ao enviar broadcast:', error)
    return { success: false, error: 'Failed to broadcast notification' }
  }
}

/**
 * Enviar notificação de nova ocorrência
 */
export async function notifyNewOcorrencia(
  numeroBO: string,
  tipo: string,
  localizacao: string
) {
  return broadcastNotification(
    `Nova Ocorrência: ${tipo}`,
    `BO ${numeroBO} - ${localizacao}`,
    '/ocorrencias'
  )
}

/**
 * Enviar notificação de ocorrência resolvida
 */
export async function notifyOcorrenciaResolved(
  numeroBO: string,
  tipo: string
) {
  return broadcastNotification(
    `Ocorrência Resolvida`,
    `BO ${numeroBO} - ${tipo} foi marcada como resolvida`,
    '/ocorrencias'
  )
}

/**
 * Obter número de subscriptions ativas
 */
export async function getSubscriptionsCount() {
  // Em produção: return await db.subscriptions.count()
  return subscriptions.length
}
