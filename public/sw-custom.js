/**
 * Service Worker customizado para SISP PWA
 * Gerencia Push Notifications e eventos de notificação
 */

// Evento: Push Notification recebida
self.addEventListener('push', function (event) {
  console.log('[SW] Push notification recebida')

  if (event.data) {
    try {
      const data = event.data.json()
      const options = {
        body: data.body,
        icon: data.icon || '/icons/icon-192x192.png',
        badge: data.badge || '/icons/icon-96x96.png',
        vibrate: [200, 100, 200], // Vibração personalizada
        tag: 'sisp-notification',
        requireInteraction: false, // Não requer interação para fechar
        data: {
          dateOfArrival: Date.now(),
          url: data.data?.url || '/',
          ...data.data,
        },
        actions: [
          {
            action: 'open',
            title: 'Abrir',
            icon: '/icons/icon-96x96.png'
          },
          {
            action: 'close',
            title: 'Fechar'
          }
        ]
      }

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      )
    } catch (error) {
      console.error('[SW] Erro ao processar push notification:', error)
    }
  }
})

// Evento: Clique na notificação
self.addEventListener('notificationclick', function (event) {
  console.log('[SW] Notificação clicada:', event.action)

  event.notification.close()

  if (event.action === 'close') {
    return
  }

  // Abrir URL da notificação
  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        // Se já existe uma janela aberta, focar nela
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }

        // Caso contrário, abrir nova janela
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Evento: Notificação fechada
self.addEventListener('notificationclose', function (event) {
  console.log('[SW] Notificação fechada')

  // Aqui você pode enviar analytics sobre notificações fechadas
  // Por exemplo: fetch('/api/analytics/notification-closed', { ... })
})

// Evento: Instalação do Service Worker
self.addEventListener('install', function (event) {
  console.log('[SW] Service Worker instalado')
  self.skipWaiting()
})

// Evento: Ativação do Service Worker
self.addEventListener('activate', function (event) {
  console.log('[SW] Service Worker ativado')
  event.waitUntil(clients.claim())
})

// Evento: Mensagens do cliente
self.addEventListener('message', function (event) {
  console.log('[SW] Mensagem recebida:', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
