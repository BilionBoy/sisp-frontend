"use client"

import React from "react"
import { Search, FileQuestion, Inbox, AlertCircle, Database, Map, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ElementType
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

/**
 * Componente genérico de empty state
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center border-dashed",
        className
      )}
    >
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}
    </Card>
  )
}

/**
 * Empty state para resultados de busca
 */
export function NoSearchResults({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="Nenhum resultado encontrado"
      description={
        query
          ? `Não encontramos resultados para "${query}". Tente ajustar os filtros ou usar termos diferentes.`
          : "Nenhum resultado encontrado. Tente ajustar os filtros de busca."
      }
      action={
        onClear
          ? {
              label: "Limpar filtros",
              onClick: onClear,
            }
          : undefined
      }
    />
  )
}

/**
 * Empty state para ocorrências
 */
export function NoIncidents({ onCreateNew }: { onCreateNew?: () => void }) {
  return (
    <EmptyState
      icon={Map}
      title="Nenhuma ocorrência registrada"
      description="Não há ocorrências ativas no momento. Quando novas ocorrências forem registradas, elas aparecerão aqui."
      action={
        onCreateNew
          ? {
              label: "Registrar nova ocorrência",
              onClick: onCreateNew,
            }
          : undefined
      }
    />
  )
}

/**
 * Empty state para agentes
 */
export function NoAgents({ onAddAgent }: { onAddAgent?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="Nenhum agente cadastrado"
      description="Não há agentes cadastrados no sistema. Adicione agentes para começar a gerenciar a equipe."
      action={
        onAddAgent
          ? {
              label: "Adicionar agente",
              onClick: onAddAgent,
            }
          : undefined
      }
    />
  )
}

/**
 * Empty state para dados
 */
export function NoData({ message }: { message?: string }) {
  return (
    <EmptyState
      icon={Database}
      title="Sem dados disponíveis"
      description={message || "Não há dados disponíveis para exibição no momento."}
    />
  )
}

/**
 * Error state
 */
export function ErrorState({
  title = "Algo deu errado",
  description = "Ocorreu um erro ao carregar os dados. Por favor, tente novamente.",
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center border-destructive/50 bg-destructive/5">
      <div className="rounded-full bg-destructive/10 p-6 mb-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-destructive">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="lg">
          Tentar novamente
        </Button>
      )}
    </Card>
  )
}

/**
 * Offline state
 */
export function OfflineState() {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="p-4 border-amber-500/50 bg-amber-500/10">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-500/20 p-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-500">Você está offline</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Algumas funcionalidades podem não estar disponíveis. Verifique sua conexão.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

/**
 * Coming Soon state
 */
export function ComingSoon({ feature }: { feature?: string }) {
  return (
    <EmptyState
      icon={FileQuestion}
      title="Em breve"
      description={
        feature
          ? `A funcionalidade "${feature}" estará disponível em breve.`
          : "Esta funcionalidade estará disponível em breve."
      }
    />
  )
}

/**
 * Maintenance mode
 */
export function MaintenanceMode() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="max-w-2xl p-12 text-center">
        <div className="rounded-full bg-primary/10 p-8 mb-6 inline-block">
          <AlertCircle className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Manutenção em Andamento</h1>
        <p className="text-lg text-muted-foreground mb-8">
          O sistema está temporariamente indisponível para manutenção. Voltaremos em breve.
        </p>
        <p className="text-sm text-muted-foreground">
          Para emergências, entre em contato com o suporte pelo telefone: <strong>190</strong>
        </p>
      </Card>
    </div>
  )
}
