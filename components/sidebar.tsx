"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  MapPinned,
  Users2,
  Target,
  FolderKanban,
  Shield,
  Heart,
  GraduationCap,
  Hammer,
  Leaf,
  ChevronLeft,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navigation = [
  {
    name: "Dashboard Geral",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Secretarias",
    href: "/secretarias",
    icon: Building2,
  },
  {
    name: "Administrações Regionais",
    href: "/distritos",
    icon: MapPinned,
  },
  {
    name: "Participação Social",
    href: "/participacao",
    icon: Users2,
  },
  {
    name: "PAEDS 2030-2050",
    href: "/paeds",
    icon: Target,
  },
  {
    name: "Projetos Intersetoriais",
    href: "/projetos",
    icon: FolderKanban,
  },
]

const secretariasMenu = [
  {
    name: "Segurança Pública",
    href: "/seguranca",
    icon: Shield,
  },
  {
    name: "Saúde",
    href: "/saude",
    icon: Heart,
  },
  {
    name: "Educação",
    href: "/educacao",
    icon: GraduationCap,
  },
  {
    name: "Infraestrutura",
    href: "/infraestrutura",
    icon: Hammer,
  },
  {
    name: "Meio Ambiente",
    href: "/meio-ambiente",
    icon: Leaf,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] border-r-2 border-sidebar-border bg-sidebar shadow-lg transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {!collapsed && (
          <div className="border-b border-sidebar-border bg-sidebar-accent px-4 py-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-sidebar-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-sidebar-foreground">Porto Velho Digital</span>
                <span className="text-xs text-sidebar-foreground/80">Governança Integrada</span>
              </div>
            </div>
          </div>
        )}

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
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}

            {!collapsed && (
              <>
                <Separator className="my-3 bg-sidebar-border" />
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-sidebar-foreground/70">SECRETARIAS</p>
                </div>
              </>
            )}

            {secretariasMenu.map((item) => {
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
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="text-xs">{item.name}</span>}
                </Link>
              )
            })}

            {!collapsed && <Separator className="my-3 bg-sidebar-border" />}

            <Link
              href="/configuracoes"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                pathname === "/configuracoes"
                  ? "bg-sidebar-accent text-sidebar-foreground shadow-sm"
                  : "text-sidebar-foreground/90 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
              )}
              title={collapsed ? "Configurações" : undefined}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Configurações</span>}
            </Link>
          </nav>
        </div>

        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>
      </div>
    </aside>
  )
}
