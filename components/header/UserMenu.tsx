"use client"

import React from "react"
import {
  User,
  Settings,
  LogOut,
  Shield,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  UserCircle,
  Bell,
  Lock,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface UserMenuProps {
  user?: {
    name: string
    email: string
    role: string
    avatar?: string
    status?: "online" | "offline" | "away"
  }
}

/**
 * Componente de Menu do Usuário
 * Inclui perfil, configurações, tema e ações rápidas
 */
export function UserMenu({
  user = {
    name: "Comandante Silva",
    email: "silva@sisp.gov.br",
    role: "Comandante Operacional",
    avatar: undefined,
    status: "online",
  },
}: UserMenuProps) {
  const { theme, setTheme } = useTheme()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-amber-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <HoverCard openDelay={200}>
      <DropdownMenu>
        <HoverCardTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-secondary/10 h-10 w-10"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              {/* Status indicator */}
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(
                  user.status || "offline"
                )}`}
              />
              <span className="sr-only">Menu do usuário</span>
            </Button>
          </DropdownMenuTrigger>
        </HoverCardTrigger>

        {/* Quick Profile Hover Card */}
        <HoverCardContent side="bottom" align="end" className="w-80">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{user.name}</h4>
                <Badge
                  variant={user.status === "online" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user.status === "online" ? "Online" : "Offline"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                <Shield className="h-3 w-3" />
                <span>{user.role}</span>
              </div>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="text-center p-2 rounded-md bg-muted">
                  <p className="text-lg font-bold">47</p>
                  <p className="text-xs text-muted-foreground">Ocorrências</p>
                </div>
                <div className="text-center p-2 rounded-md bg-muted">
                  <p className="text-lg font-bold">12h</p>
                  <p className="text-xs text-muted-foreground">Tempo Online</p>
                </div>
              </div>
            </div>
          </div>
        </HoverCardContent>

        {/* Dropdown Menu */}
        <DropdownMenuContent className="w-64" align="end">
          {/* User Info Header */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Main Actions */}
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Preferências de Notificação</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Theme Selector */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Monitor className="mr-2 h-4 w-4" />
              <span>Tema</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">
                  <Sun className="mr-2 h-4 w-4" />
                  Claro
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="mr-2 h-4 w-4" />
                  Escuro
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <Monitor className="mr-2 h-4 w-4" />
                  Sistema
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Session Info */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Sessão ativa desde 08:30</span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </HoverCard>
  )
}
