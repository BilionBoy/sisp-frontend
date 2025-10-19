"use client"

import React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"

interface BreadcrumbSegment {
  label: string
  href: string
  items?: { label: string; href: string }[]
}

/**
 * Componente de Breadcrumbs com dropdown para navegação hierárquica
 */
export function Breadcrumbs() {
  const pathname = usePathname()

  // Mapear rotas para breadcrumbs
  const routeMap: Record<string, BreadcrumbSegment[]> = {
    "/": [{ label: "Dashboard", href: "/" }],
    "/ocorrencias": [
      { label: "Dashboard", href: "/" },
      { label: "Mapa de Ocorrências", href: "/ocorrencias" },
    ],
    "/monitoramento": [
      { label: "Dashboard", href: "/" },
      { label: "Monitoramento", href: "/monitoramento" },
    ],
  }

  const breadcrumbs = routeMap[pathname] || [{ label: "Dashboard", href: "/" }]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((segment, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <React.Fragment key={segment.href}>
              <BreadcrumbItem>
                {segment.items && segment.items.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                      {index === 0 && <Home className="h-3.5 w-3.5" />}
                      {segment.label}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {segment.items.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link href={item.href}>{item.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {index === 0 && <Home className="h-3.5 w-3.5" />}
                    {segment.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={segment.href} className="flex items-center gap-1">
                      {index === 0 && <Home className="h-3.5 w-3.5" />}
                      {segment.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
