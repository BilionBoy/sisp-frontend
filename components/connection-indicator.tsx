'use client'

import { Wifi, WifiOff } from 'lucide-react'
import { useNotifications } from '@/lib/hooks/use-notifications'
import { cn } from '@/lib/utils'

interface ConnectionIndicatorProps {
  className?: string
  showLabel?: boolean
}

/**
 * Indicador de conexão WebSocket
 * Mostra um ícone que muda de cor baseado no estado da conexão
 */
export function ConnectionIndicator({ className, showLabel = false }: ConnectionIndicatorProps) {
  const { isConnected } = useNotifications({ enabled: true })

  return (
    <div
      className={cn(
        'flex items-center gap-1.5',
        className
      )}
      title={isConnected ? 'Conectado ao servidor' : 'Reconectando...'}
    >
      {isConnected ? (
        <>
          <Wifi className={cn('h-4 w-4 text-green-500')} />
          {showLabel && (
            <span className="text-xs text-green-500 font-medium">Online</span>
          )}
        </>
      ) : (
        <>
          <WifiOff className={cn('h-4 w-4 text-red-500 animate-pulse')} />
          {showLabel && (
            <span className="text-xs text-red-500 font-medium">Offline</span>
          )}
        </>
      )}
    </div>
  )
}
