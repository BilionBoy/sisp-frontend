"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, MapPin, AlertTriangle, CheckCircle2, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Incident } from "@/lib/types/map"

interface OcorrenciaCardMobileProps {
  incident: Incident
  onAssume: (id: string) => void
  isSelected?: boolean
}

export function OcorrenciaCardMobile({ incident, onAssume, isSelected = false }: OcorrenciaCardMobileProps) {
  // Formatar timestamp relativo
  const getRelativeTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)

      if (diffMins < 1) return "Agora"
      if (diffMins < 60) return `${diffMins} min atrás`
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)} h atrás`
      return format(date, "dd MMM yyyy", { locale: ptBR })
    } catch {
      return "Data inválida"
    }
  }

  // Cores de prioridade
  const priorityConfig = {
    high: {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-900",
      badge: "bg-red-500 text-white",
      icon: "text-red-600 dark:text-red-400",
      label: "Alta",
    },
    medium: {
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-200 dark:border-amber-900",
      badge: "bg-amber-500 text-white",
      icon: "text-amber-600 dark:text-amber-400",
      label: "Média",
    },
    low: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200 dark:border-blue-900",
      badge: "bg-blue-500 text-white",
      icon: "text-blue-600 dark:text-blue-400",
      label: "Baixa",
    },
  }

  const config = priorityConfig[incident.priority]

  // Status badge
  const statusConfig = {
    "Registrada": { variant: "default" as const, icon: FileText },
    "Em Investigação": { variant: "secondary" as const, icon: AlertTriangle },
    "Resolvida": { variant: "outline" as const, icon: CheckCircle2 },
    "Arquivada": { variant: "outline" as const, icon: FileText },
  }

  const statusInfo = statusConfig[incident.status as keyof typeof statusConfig] || statusConfig["Registrada"]
  const StatusIcon = statusInfo.icon

  return (
    <Card
      className={cn(
        "border-2 transition-all duration-200 active:scale-[0.98]",
        config.border,
        config.bg,
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="p-4 space-y-3">
        {/* Header com ID e Prioridade */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs font-mono shrink-0">
                #{incident.numeroBO || incident.id}
              </Badge>
              <Badge className={cn("text-xs shrink-0", config.badge)}>
                {config.label}
              </Badge>
            </div>
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
              {incident.type}
            </h3>
          </div>
          <div className={cn("p-2 rounded-full shrink-0", config.bg)}>
            <AlertTriangle className={cn("h-5 w-5", config.icon)} />
          </div>
        </div>

        {/* Localização */}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground line-clamp-1">
              {incident.bairro || incident.location || incident.address || "Localização não informada"}
            </p>
            {incident.zone && (
              <p className="text-xs text-muted-foreground">
                {incident.zone}
              </p>
            )}
          </div>
        </div>

        {/* Timestamp e Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">
              {incident.timestamp ? getRelativeTime(incident.timestamp) : "Sem data"}
            </span>
          </div>
          <Badge variant={statusInfo.variant} className="text-xs gap-1">
            <StatusIcon className="h-3 w-3" />
            {incident.status}
          </Badge>
        </div>

        {/* Descrição (opcional) */}
        {incident.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 pt-1 border-t">
            {incident.description}
          </p>
        )}

        {/* Botão Assumir */}
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onAssume(incident.id)
          }}
          className="w-full mt-2"
          size="sm"
          variant={incident.status === "Resolvida" ? "outline" : "default"}
        >
          {incident.status === "Resolvida" ? "Ver Detalhes" : "Assumir Ocorrência"}
        </Button>
      </div>
    </Card>
  )
}
