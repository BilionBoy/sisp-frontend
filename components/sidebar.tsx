"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Mapa de Ocorrências",
    href: "/ocorrencias",
    icon: MapPin,
  },
  {
    name: "Gestão de Agentes",
    href: "/agentes",
    icon: Users,
  },
  {
    name: "Viaturas",
    href: "/viaturas",
    icon: Car,
  },
  {
    name: "Monitoramento",
    href: "/monitoramento",
    icon: Camera,
  },
  {
    name: "Roteamento IA",
    href: "/roteamento",
    icon: Route,
  },
  {
    name: "Análises",
    href: "/analises",
    icon: BarChart3,
  },
  {
    name: "Portal Transparência",
    href: "/transparencia",
    icon: Globe,
  },
  {
    name: "Relatórios",
    href: "/relatorios",
    icon: FileText,
  },
  {
    name: "Configurações",
    href: "/configuracoes",
    icon: Settings,
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
              <Shield className="h-6 w-6 text-sidebar-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-sidebar-foreground">SISP</span>
                <span className="text-xs text-sidebar-foreground/80">Segurança Inteligente</span>
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
