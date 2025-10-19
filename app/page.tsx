'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isMobile } from '@/lib/utils/device'

/**
 * Página raiz - Redireciona para tela de ocorrências apropriada
 *
 * - Desktop: /ocorrencias (mapa interativo)
 * - Mobile: /ocorrencias-mobile (lista otimizada)
 */
export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar baseado no dispositivo
    const deviceIsMobile = isMobile()

    if (deviceIsMobile) {
      router.replace('/ocorrencias-mobile')
    } else {
      router.replace('/ocorrencias')
    }
  }, [router])

  // Mostrar loading enquanto redireciona
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle cx="20" cy="50" r="18" fill="#FFD700" />
            <circle cx="50" cy="50" r="18" fill="#76BC21" />
            <circle cx="80" cy="50" r="18" fill="#003DA5" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">SISP Porto Velho</h1>
          <p className="text-sm text-muted-foreground mt-1">Carregando...</p>
        </div>
      </div>
    </div>
  )
}
