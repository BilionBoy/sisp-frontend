'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, X, Smartphone, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallPromptProps {
  className?: string
  onInstall?: () => void
  onDismiss?: () => void
}

export function InstallPrompt({
  className,
  onInstall,
  onDismiss,
}: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Verificar se é iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // Verificar se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://')

    setIsInstalled(isStandalone)

    // Verificar se foi dismissado antes
    const dismissed = localStorage.getItem('sisp-install-prompt-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)

      // Mostrar novamente após 7 dias
      if (daysSinceDismissed > 7) {
        localStorage.removeItem('sisp-install-prompt-dismissed')
      } else {
        setIsDismissed(true)
      }
    }

    // Capturar evento beforeinstallprompt (Chrome/Edge/Android)
    const handler = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setIsInstallable(true)
      console.log('[PWA] beforeinstallprompt event capturado')
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Detectar quando app foi instalado
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App instalado com sucesso')
      setIsInstalled(true)
      setDeferredPrompt(null)
      setIsInstallable(false)
      onInstall?.()
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [onInstall])

  /**
   * Mostrar prompt de instalação (Chrome/Edge/Android)
   */
  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return

    try {
      // Mostrar prompt de instalação
      await deferredPrompt.prompt()

      // Aguardar escolha do usuário
      const { outcome } = await deferredPrompt.userChoice

      console.log(`[PWA] Escolha do usuário: ${outcome}`)

      if (outcome === 'accepted') {
        setIsInstallable(false)
        setDeferredPrompt(null)
        onInstall?.()
      }
    } catch (error) {
      console.error('[PWA] Erro ao mostrar prompt de instalação:', error)
    }
  }, [deferredPrompt, onInstall])

  /**
   * Dismissar prompt
   */
  const handleDismiss = useCallback(() => {
    setIsDismissed(true)
    localStorage.setItem('sisp-install-prompt-dismissed', Date.now().toString())
    onDismiss?.()
  }, [onDismiss])

  // Não mostrar se já está instalado
  if (isInstalled) {
    return null
  }

  // Não mostrar se foi dismissado recentemente
  if (isDismissed) {
    return null
  }

  // Instruções para iOS
  if (isIOS && !isInstallable) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle>Instalar App</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Adicione o SISP à sua tela inicial para acesso rápido
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 text-sm">
            <Badge className="mt-0.5 shrink-0">1</Badge>
            <p>
              Toque no botão de compartilhar{' '}
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-500 text-white font-bold text-xs mx-1">
                ⎋
              </span>{' '}
              na barra inferior
            </p>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <Badge className="mt-0.5 shrink-0">2</Badge>
            <p>
              Role para baixo e toque em{' '}
              <span className="font-semibold">"Adicionar à Tela Inicial"</span>{' '}
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-500 text-white font-bold text-xs mx-1">
                ➕
              </span>
            </p>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <Badge className="mt-0.5 shrink-0">3</Badge>
            <p>
              Toque em <span className="font-semibold">"Adicionar"</span> no canto superior direito
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Prompt de instalação (Chrome/Edge/Android)
  if (isInstallable) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              <CardTitle>Instalar App</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Instale o SISP para acesso rápido e funcionalidade offline
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
              <Smartphone className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Acesso Rápido</span>
              <span className="text-xs text-muted-foreground text-center">
                Ícone na tela inicial
              </span>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
              <Monitor className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Modo Fullscreen</span>
              <span className="text-xs text-muted-foreground text-center">
                Interface nativa
              </span>
            </div>
          </div>

          <Button
            onClick={handleInstallClick}
            className="w-full"
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Instalar Aplicativo
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Funciona offline • Notificações push • Atualizações automáticas
          </p>
        </CardContent>
      </Card>
    )
  }

  return null
}
