"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface SidebarContextType {
  isOpen: boolean
  isCollapsed: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  openSidebar: () => void
  toggleCollapsed: () => void
  setCollapsed: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true) // Iniciar colapsado

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)
  const openSidebar = () => setIsOpen(true)
  const toggleCollapsed = () => setIsCollapsed(!isCollapsed)
  const setCollapsed = (value: boolean) => setIsCollapsed(value)

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isCollapsed,
        toggleSidebar,
        closeSidebar,
        openSidebar,
        toggleCollapsed,
        setCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
