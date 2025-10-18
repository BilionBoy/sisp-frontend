"use client"

import { Bell, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-secondary bg-white shadow-sm">
      <div className="flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle cx="20" cy="50" r="18" fill="#FFD700" />
                <circle cx="50" cy="50" r="18" fill="#76BC21" />
                <circle cx="80" cy="50" r="18" fill="#003DA5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight text-primary">CIDADE DE</span>
              <span className="text-xl font-black leading-tight text-primary">PORTO VELHO</span>
              <span className="text-xs font-semibold leading-tight text-muted-foreground">
                SISP - Sistema Integrado de Segurança Pública
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative hover:bg-secondary/10">
            <Bell className="h-5 w-5 text-primary" />
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-secondary/10">
                <User className="h-5 w-5 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Comandante Silva</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
