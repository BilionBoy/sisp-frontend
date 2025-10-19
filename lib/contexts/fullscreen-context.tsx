"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface FullscreenContextType {
  isFullscreen: boolean
  setFullscreen: (value: boolean) => void
  toggleFullscreen: () => void
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined)

export function FullscreenProvider({ children }: { children: ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const setFullscreen = (value: boolean) => setIsFullscreen(value)

  const toggleFullscreen = () => setIsFullscreen(prev => !prev)

  return (
    <FullscreenContext.Provider
      value={{
        isFullscreen,
        setFullscreen,
        toggleFullscreen,
      }}
    >
      {children}
    </FullscreenContext.Provider>
  )
}

export function useFullscreen() {
  const context = useContext(FullscreenContext)
  if (context === undefined) {
    throw new Error("useFullscreen deve ser usado dentro de FullscreenProvider")
  }
  return context
}
