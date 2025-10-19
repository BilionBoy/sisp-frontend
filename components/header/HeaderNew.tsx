"use client"

import React from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlobalSearch } from "./GlobalSearch"
import { NotificationCenter } from "./NotificationCenter"
import { UserMenu } from "./UserMenu"
import { Breadcrumbs } from "./Breadcrumbs"

/**
 * Componente Header melhorado com:
 * - Busca global com Command Palette (Cmd+K)
 * - Central de notificações categorizada
 * - Menu de usuário com hover card e tema switcher
 * - Breadcrumbs para navegação hierárquica
 * - Status indicators e quick actions
 */
export function HeaderNew() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-secondary bg-white dark:bg-gray-950 shadow-sm">
      <div className="flex h-20 items-center justify-between px-4 md:px-6">
        {/* Left side - Logo and Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex h-14 w-14 items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle cx="20" cy="50" r="18" fill="#FFD700" />
                <circle cx="50" cy="50" r="18" fill="#76BC21" />
                <circle cx="80" cy="50" r="18" fill="#003DA5" />
              </svg>
            </div>

            {/* Title and Breadcrumbs */}
            <div className="flex flex-col gap-1">
              <div className="hidden md:flex flex-col">
                <span className="text-base font-bold leading-tight text-primary">CIDADE DE</span>
                <span className="text-xl font-black leading-tight text-primary">PORTO VELHO</span>
              </div>
              <div className="hidden lg:block">
                <Breadcrumbs />
              </div>
              <div className="md:hidden">
                <span className="text-sm font-bold text-primary">PORTO VELHO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <GlobalSearch />
        </div>

        {/* Right side - Actions and User Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile search button */}
          <div className="md:hidden">
            <GlobalSearch />
          </div>

          {/* Notification Center */}
          <NotificationCenter />

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {/* Mobile Breadcrumbs */}
      <div className="lg:hidden border-t border-border px-4 py-2 bg-muted/30">
        <Breadcrumbs />
      </div>
    </header>
  )
}
