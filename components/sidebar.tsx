"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MapPin,
  Camera,
  Shield,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/lib/contexts/sidebar-context"

const navigation = [
  {
    name: "Mapa de Ocorrências",
    href: "/ocorrencias",
    icon: MapPin,
  },
  {
    name: "Monitoramento",
    href: "/monitoramento",
    icon: Camera,
  },
  {
    name: "Analytics",
    href: "/",
    icon: LayoutDashboard,
  },
  
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, isCollapsed, closeSidebar, setCollapsed } = useSidebar()

  // Fechar sidebar ao mudar de rota (mobile)
  useEffect(() => {
    closeSidebar()
  }, [pathname, closeSidebar])

  // Prevenir scroll do body quando sidebar mobile está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handlers para hover (apenas desktop)
  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) { // md breakpoint
      setCollapsed(false)
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) { // md breakpoint
      setCollapsed(true)
    }
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1080] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-[1090] h-screen border-r-2 border-sidebar-border bg-sidebar shadow-lg transition-all duration-300",
          // Mobile: Drawer que desliza da esquerda
          "md:top-20 md:h-[calc(100vh-5rem)] md:z-[1050]",
          // Largura responsiva
          isCollapsed ? "w-16" : "w-64",
          // Visibility mobile
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex h-full flex-col">
          {/* Header do sidebar (visível em mobile e quando não colapsado) */}
          {(!isCollapsed || isOpen) && (
            <div className="border-b border-sidebar-border bg-sidebar-accent px-4 py-4 md:hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-sidebar-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-sidebar-foreground">SISP</span>
                    <span className="text-xs text-sidebar-foreground/80">Segurança Inteligente</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeSidebar}
                  className="text-sidebar-foreground hover:bg-sidebar-accent/70"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Header do sidebar (desktop quando não colapsado) */}
          {!isCollapsed && (
            <div className="hidden border-b border-sidebar-border bg-sidebar-accent px-4 py-4 md:block">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-sidebar-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-sidebar-foreground">SISP</span>
                  <span className="text-xs text-sidebar-foreground/80">Segurança Inteligente</span>
                </div>
              </div>
            </div>
          )}

          {/* Navegação */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground shadow-sm"
                        : "text-sidebar-foreground/90 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  )
}
