"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MapPin,
  Users,
  Car,
  Route,
  BarChart3,
  Globe,
  Settings,
  ChevronLeft,
  Camera,
  FileText,
  Shield,
  Search,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarItem, type SidebarItemProps } from "./SidebarItem"
import { QuickActions } from "./QuickActions"

interface NavigationItem extends Omit<SidebarItemProps, "isActive" | "collapsed"> {
  category?: string
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: 3,
  },
  {
    name: "Mapa de Ocorrências",
    href: "/ocorrencias",
    icon: MapPin,
    badge: 12,
  },
  {
    name: "Monitoramento",
    href: "/monitoramento",
    icon: Camera,
    category: "Sistema",
  },
]

/**
 * Componente Sidebar melhorado com:
 * - Animações suaves
 * - Submenu com items aninhados
 * - Busca integrada
 * - Ações rápidas
 * - Notificações por seção
 * - Modo collapsed com tooltips
 * - Categorização de items
 */
export function SidebarNew() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filtrar navigation baseado na busca
  const filteredNavigation = navigation.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Agrupar items por categoria
  const groupedNavigation = filteredNavigation.reduce(
    (acc, item) => {
      const category = item.category || "Principal"
      if (!acc[category]) acc[category] = []
      acc[category].push(item)
      return acc
    },
    {} as Record<string, NavigationItem[]>
  )

  return (
    <aside
      className={cn(
        "fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] border-r-2 border-sidebar-border bg-sidebar shadow-lg",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header com logo */}
        {!collapsed && (
          <div className="border-b border-sidebar-border bg-sidebar-accent px-4 py-4 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-sidebar-foreground">SISP</span>
                <span className="text-xs text-sidebar-foreground/80">Segurança Inteligente</span>
              </div>
            </div>
          </div>
        )}

        {/* Search bar */}
        {!collapsed && (
          <div className="p-3 border-b border-sidebar-border animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 bg-sidebar-accent/50 border-sidebar-border focus-visible:ring-primary"
              />
            </div>
            {searchQuery && (
              <p className="text-xs text-muted-foreground mt-2">
                {filteredNavigation.length} resultado(s)
              </p>
            )}
          </div>
        )}

        {/* Navigation items */}
        <ScrollArea className="flex-1 px-2 py-3">
          <nav className="space-y-1">
            {mounted &&
              Object.entries(groupedNavigation).map(([category, items], categoryIndex) => (
                <div key={category} className="space-y-1">
                  {/* Category separator */}
                  {!collapsed && categoryIndex > 0 && (
                    <Separator className="my-3 bg-sidebar-border" />
                  )}

                  {/* Category label */}
                  {!collapsed && items.length > 0 && (
                    <div className="px-3 py-2">
                      <p className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                        {category}
                      </p>
                    </div>
                  )}

                  {/* Navigation items */}
                  {items.map((item) => (
                    <SidebarItem
                      key={item.name}
                      {...item}
                      isActive={pathname === item.href || pathname?.startsWith(item.href + "/")}
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              ))}
          </nav>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="border-t border-sidebar-border p-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <QuickActions collapsed={collapsed} />
        </div>

        {/* Notifications summary (só quando não collapsed) */}
        {!collapsed && (
          <div className="border-t border-sidebar-border p-3 bg-sidebar-accent/30 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-sidebar-foreground" />
                <span className="text-sidebar-foreground">Notificações</span>
              </div>
              <Badge variant="destructive" className="h-5 px-1.5 animate-pulse">
                8
              </Badge>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              "transition-all duration-200 hover:scale-105 active:scale-95"
            )}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
            {!collapsed && <span className="ml-2 text-xs">Recolher</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
