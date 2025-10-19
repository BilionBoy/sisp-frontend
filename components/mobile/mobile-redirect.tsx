"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useMobileDetection } from "@/lib/hooks/use-mobile-detection"

interface MobileRedirectProps {
  /**
   * Rota de destino mobile (ex: "/ocorrencias-mobile")
   */
  mobileRoute: string
  /**
   * Rotas que devem ser redirecionadas (ex: ["/ocorrencias"])
   * Se não informado, redireciona apenas a rota atual
   */
  desktopRoutes?: string[]
}

/**
 * Componente para redirecionar automaticamente para versão mobile
 * quando detectar que o usuário está em dispositivo móvel
 */
export function MobileRedirect({ mobileRoute, desktopRoutes }: MobileRedirectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isMobile, hasMounted } = useMobileDetection()

  useEffect(() => {
    // Só executar após montar (evitar hydration error)
    if (!hasMounted) return

    // Verificar se já está na rota mobile
    if (pathname?.startsWith(mobileRoute)) return

    // Verificar se está em uma rota que deve ser redirecionada
    const shouldRedirect = desktopRoutes
      ? desktopRoutes.some(route => pathname === route)
      : true

    // Redirecionar se for mobile e deve redirecionar
    if (isMobile && shouldRedirect) {
      router.replace(mobileRoute)
    }
  }, [isMobile, hasMounted, pathname, mobileRoute, desktopRoutes, router])

  // Componente não renderiza nada
  return null
}
