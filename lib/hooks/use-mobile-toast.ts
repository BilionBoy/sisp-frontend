/**
 * Hook customizado para toasts que aparecem APENAS no mobile
 */

import { toast } from "sonner"
import { useEffect, useState } from "react"

/**
 * Detecta se o dispositivo é mobile
 */
function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false

  // Verifica pelo tamanho da tela (mobile = < 768px)
  const isMobileWidth = window.innerWidth < 768

  // Verifica pelo userAgent (backup)
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  return isMobileWidth || isMobileUA
}

/**
 * Hook que fornece métodos de toast que só aparecem no mobile
 */
export function useMobileToast() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Verifica inicialmente
    setIsMobile(isMobileDevice())

    // Monitora mudanças no tamanho da tela
    const handleResize = () => {
      setIsMobile(isMobileDevice())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return {
    success: (message: string, options?: Parameters<typeof toast.success>[1]) => {
      if (isMobile) {
        toast.success(message, options)
      }
    },
    error: (message: string, options?: Parameters<typeof toast.error>[1]) => {
      if (isMobile) {
        toast.error(message, options)
      }
    },
    info: (message: string, options?: Parameters<typeof toast.info>[1]) => {
      if (isMobile) {
        toast.info(message, options)
      }
    },
    warning: (message: string, options?: Parameters<typeof toast.warning>[1]) => {
      if (isMobile) {
        toast.warning(message, options)
      }
    },
    // Expõe o estado para casos onde o componente precisa saber se é mobile
    isMobile,
  }
}
