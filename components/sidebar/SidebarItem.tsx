"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SubMenuItem {
  name: string
  href: string
  badge?: string | number
}

export interface SidebarItemProps {
  name: string
  href?: string
  icon: LucideIcon
  isActive?: boolean
  collapsed?: boolean
  badge?: string | number
  subItems?: SubMenuItem[]
  onClick?: () => void
}

/**
 * Componente de item individual da sidebar
 * Suporta subitems, badges, tooltips e animações
 */
export function SidebarItem({
  name,
  href,
  icon: Icon,
  isActive = false,
  collapsed = false,
  badge,
  subItems = [],
  onClick,
}: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubItems = subItems.length > 0

  const ItemContent = (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
        "hover:scale-[1.02] active:scale-[0.98]",
        isActive
          ? "bg-sidebar-accent text-sidebar-foreground shadow-sm"
          : "text-sidebar-foreground/90 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      {/* Ripple effect container */}
      <span className="absolute inset-0 overflow-hidden rounded-md">
        <span
          className={cn(
            "absolute inset-0 bg-sidebar-foreground/10 transform scale-0 rounded-full transition-transform duration-500",
            "group-active:scale-100 group-active:opacity-0"
          )}
        />
      </span>

      {/* Icon */}
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-all duration-200",
          isActive && "text-primary",
          !collapsed && "group-hover:scale-110"
        )}
      />

      {/* Label and Badge */}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{name}</span>
          {badge !== undefined && (
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="h-5 min-w-[20px] px-1.5 text-xs font-semibold animate-in fade-in zoom-in duration-300"
            >
              {badge}
            </Badge>
          )}
          {hasSubItems && (
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                isOpen && "rotate-90"
              )}
            />
          )}
        </>
      )}

      {/* Active indicator */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full animate-in slide-in-from-left duration-300" />
      )}
    </div>
  )

  // Se estiver collapsed, mostrar tooltip
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {href ? (
              <Link href={href} onClick={onClick}>
                {ItemContent}
              </Link>
            ) : (
              <button onClick={onClick} className="w-full">
                {ItemContent}
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <span>{name}</span>
            {badge !== undefined && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Se não tiver subitems, renderizar link simples
  if (!hasSubItems) {
    return href ? (
      <Link href={href} onClick={onClick}>
        {ItemContent}
      </Link>
    ) : (
      <button onClick={onClick} className="w-full">
        {ItemContent}
      </button>
    )
  }

  // Se tiver subitems, renderizar collapsible
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button onClick={onClick} className="w-full">
          {ItemContent}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 mt-1 animate-in slide-in-from-top-2 duration-300">
        {subItems.map((subItem) => (
          <Link
            key={subItem.href}
            href={subItem.href}
            className={cn(
              "flex items-center justify-between gap-2 rounded-md px-3 py-2 pl-11 text-sm",
              "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              "transition-all duration-150 hover:translate-x-1"
            )}
          >
            <span className="truncate">{subItem.name}</span>
            {subItem.badge !== undefined && (
              <Badge variant="outline" className="h-4 px-1.5 text-xs">
                {subItem.badge}
              </Badge>
            )}
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
