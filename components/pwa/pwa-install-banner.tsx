'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Banner fixo que aparece quando o app NÃO está rodando como PWA
 * Incentiva o usuário a instalar o aplicativo
 */
export function PWAInstallBanner() {
  const [isInstalled, setIsInstalled] = useState(true) // Começa true para evitar flash
  const [isVisible, setIsVisible] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Verificar se está rodando como PWA instalado
    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')

    setIsInstalled(isPWA)

    // Verificar se é iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // Se JÁ está instalado, não fazer nada
    if (isPWA) {
      return
    }

    // Se NÃO está instalado, configurar banner e evento
    // Verificar se foi permanentemente dismissado
    const permanentlyDismissed = localStorage.getItem('sisp-install-banner-dismissed-permanent')
    if (permanentlyDismissed) {
      return
    }

    // Verificar dismiss temporário (3 dias)
    const dismissed = localStorage.getItem('sisp-install-banner-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)

      if (daysSinceDismissed < 3) {
        return
      } else {
        localStorage.removeItem('sisp-install-banner-dismissed')
      }
    }

    // Capturar evento beforeinstallprompt (Chrome/Edge/Android)
    const handler = (e: Event) => {
      e.preventDefault()
      console.log('[PWA] beforeinstallprompt event captured')
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Delay de 3 segundos antes de mostrar banner
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  /**
   * Mostrar prompt de instalação (Chrome/Android)
   */
  const handleInstall = async () => {
    console.log('[PWA] handleInstall called, deferredPrompt:', !!deferredPrompt, 'isIOS:', isIOS)

    if (!deferredPrompt) {
      console.log('[PWA] No deferred prompt available')
      // Se não tem prompt nativo, scroll para instruções iOS
      if (isIOS) {
        console.log('[PWA] iOS detected, scrolling to instructions')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        console.warn('[PWA] No install prompt available. App may already be installed or browser does not support PWA installation.')
      }
      return
    }

    try {
      console.log('[PWA] Showing install prompt...')
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log('[PWA] User choice:', outcome)

      if (outcome === 'accepted') {
        console.log('[PWA] Installation accepted!')
        setIsVisible(false)
        localStorage.setItem('sisp-install-banner-dismissed-permanent', 'true')
      } else {
        console.log('[PWA] Installation dismissed by user')
      }

      setDeferredPrompt(null)
    } catch (error) {
      console.error('[PWA] Erro ao mostrar prompt:', error)
    }
  }

  /**
   * Dismissar temporariamente (3 dias)
   */
  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('sisp-install-banner-dismissed', Date.now().toString())
  }

  /**
   * Não mostrar mais (permanente)
   */
  const handleDismissPermanent = () => {
    setIsVisible(false)
    localStorage.setItem('sisp-install-banner-dismissed-permanent', 'true')
  }

  // Não mostrar se:
  // - Já está instalado como PWA
  // - Foi dismissado
  // - Ainda não passou o delay
  if (isInstalled || !isVisible) {
    return null
  }

  return (
    <>
      {/* Banner fixo no topo */}
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-[9999]',
          'bg-gradient-to-r from-primary to-blue-600 text-white',
          'shadow-lg border-b-4 border-blue-700',
          'animate-in slide-in-from-top duration-500'
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Ícone e Mensagem */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="shrink-0 bg-white/20 p-2 rounded-lg">
                <Smartphone className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight">
                  Instale o SISP360
                </p>
                <p className="text-xs opacity-90 leading-tight mt-0.5">
                  {isIOS
                    ? 'Adicione à tela inicial para acesso rápido'
                    : 'Acesso rápido, offline e notificações'}
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-semibold h-8"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden sm:inline">Instalar</span>
                <span className="sm:hidden">OK</span>
              </Button>

              <Button
                onClick={handleDismiss}
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-white/20"
                title="Lembrar mais tarde"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Instruções iOS (expandível) */}
          {isIOS && (
            <div className="mt-2 pt-2 border-t border-white/20 text-xs space-y-1">
              <p className="opacity-90">
                <span className="font-semibold">1.</span> Toque em{' '}
                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-white/20 text-white font-bold text-xs mx-0.5">
                  ⎋
                </span>{' '}
                na barra inferior
              </p>
              <p className="opacity-90">
                <span className="font-semibold">2.</span> Selecione "Adicionar à Tela Inicial"
              </p>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={handleDismissPermanent}
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-white hover:bg-white/20"
                >
                  Não mostrar novamente
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spacer para empurrar conteúdo para baixo */}
      <div className="h-[76px]" aria-hidden="true" />
    </>
  )
}

/**
 * Hook para detectar se está rodando como PWA
 */
export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    const isPWAInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')

    setIsPWA(isPWAInstalled)
  }, [])

  return isPWA
}

/**
 * Badge indicador "Instalado como PWA"
 * Mostra apenas quando está instalado
 */
export function PWABadge({ className }: { className?: string }) {
  const isPWA = useIsPWA()

  if (!isPWA) return null

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full',
        'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400',
        'text-xs font-medium border border-green-200 dark:border-green-900',
        className
      )}
    >
      <Smartphone className="h-3 w-3" />
      <span>App Instalado</span>
    </div>
  )
}
