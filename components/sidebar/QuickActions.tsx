"use client"

import React from "react"
import { Plus, AlertCircle, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface QuickAction {
  id: string
  label: string
  icon: React.ElementType
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
  onClick: () => void
  shortcut?: string
}

interface QuickActionsProps {
  collapsed?: boolean
  className?: string
}

/**
 * Componente de ações rápidas para a sidebar
 * Fornece acesso rápido a ações comuns
 */
export function QuickActions({ collapsed = false, className }: QuickActionsProps) {
  const quickActions: QuickAction[] = [
    {
      id: "new-incident",
      label: "Nova Ocorrência",
      icon: Plus,
      variant: "default",
      onClick: () => console.log("Nova Ocorrência"),
      shortcut: "Ctrl+N",
    },
    {
      id: "emergency",
      label: "Emergência",
      icon: AlertCircle,
      variant: "destructive",
      onClick: () => console.log("Emergência"),
      shortcut: "Ctrl+E",
    },
    {
      id: "dispatch",
      label: "Despachar Viatura",
      icon: Phone,
      variant: "secondary",
      onClick: () => console.log("Despachar"),
      shortcut: "Ctrl+D",
    },
    {
      id: "report",
      label: "Gerar Relatório",
      icon: FileText,
      variant: "outline",
      onClick: () => console.log("Relatório"),
      shortcut: "Ctrl+R",
    },
  ]

  if (collapsed) {
    return (
      <div className={cn("space-y-2", className)}>
        {quickActions.slice(0, 2).map((action) => (
          <TooltipProvider key={action.id} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={action.variant}
                  size="icon"
                  onClick={action.onClick}
                  className="w-full h-9 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <action.icon className="h-4 w-4" />
                  <span className="sr-only">{action.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex flex-col gap-1">
                <span>{action.label}</span>
                {action.shortcut && (
                  <kbd className="text-xs text-muted-foreground bg-muted px-1 rounded">
                    {action.shortcut}
                  </kbd>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    )
  }

  return (
    <Card className={cn("p-3 bg-sidebar-accent/50 border-sidebar-border", className)}>
      <h4 className="text-xs font-semibold text-sidebar-foreground mb-2 uppercase tracking-wider">
        Ações Rápidas
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action) => (
          <TooltipProvider key={action.id} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={action.variant}
                  size="sm"
                  onClick={action.onClick}
                  className="h-auto py-2 flex flex-col items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <action.icon className="h-4 w-4" />
                  <span className="text-xs leading-tight text-center">{action.label}</span>
                </Button>
              </TooltipTrigger>
              {action.shortcut && (
                <TooltipContent>
                  <kbd className="text-xs bg-muted px-1 rounded">{action.shortcut}</kbd>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </Card>
  )
}
