"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'sonner'
import { NotificationsProvider } from '@/components/notifications-provider'
import { PWAInstallBanner } from '@/components/pwa/pwa-install-banner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>
        {/* Banner de instalação PWA (aparece apenas se NÃO estiver instalado) */}
        <PWAInstallBanner />

        {children}

        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={5000}
          toastOptions={{
            style: {
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </NotificationsProvider>
    </QueryClientProvider>
  )
}
