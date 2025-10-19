"use client"

import { useEffect, useState } from "react"

/**
 * Hook para detectar se o dispositivo é mobile
 * Usa media query para detecção responsiva
 */
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)

    // Media query para detectar telas mobile (max-width: 768px)
    const mediaQuery = window.matchMedia("(max-width: 768px)")

    // Função para atualizar o estado
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }

    // Set inicial
    handleChange(mediaQuery)

    // Listener para mudanças
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return {
    isMobile,
    hasMounted,
  }
}
