"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Search, Clock, MapPin, FileText, X } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "incident" | "page"
  href: string
  metadata?: string
}

/**
 * Componente de busca global com Command Palette
 * Ativado por Cmd+K / Ctrl+K
 */
export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([])

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recent-searches")
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5))
      }
    }
  }, [])

  // Mock search results - em produção, isto seria uma API call
  const mockResults: SearchResult[] = [
    {
      id: "OC-2847",
      title: "Ocorrência OC-2847",
      description: "Furto em estabelecimento comercial - Alta prioridade",
      type: "incident",
      href: "/ocorrencias/OC-2847",
      metadata: "Há 15 min",
    },
    {
      id: "OC-2846",
      title: "Ocorrência OC-2846",
      description: "Roubo de veículo - Zona Leste",
      type: "incident",
      href: "/ocorrencias/OC-2846",
      metadata: "Há 1 hora",
    },
    {
      id: "page-ocorrencias",
      title: "Mapa de Ocorrências",
      description: "Visualização interativa de ocorrências no mapa",
      type: "page",
      href: "/ocorrencias",
    },
    {
      id: "page-monitoramento",
      title: "Monitoramento",
      description: "Sistema de monitoramento e câmeras",
      type: "page",
      href: "/monitoramento",
    },
  ]

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "incident":
        return <MapPin className="h-4 w-4" />
      case "page":
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "incident":
        return "Ocorrência"
      case "page":
        return "Página"
    }
  }

  const handleSelect = useCallback((result: SearchResult) => {
    // Adicionar aos recentes
    const updated = [result, ...recentSearches.filter((r) => r.id !== result.id)].slice(0, 5)
    setRecentSearches(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("recent-searches", JSON.stringify(updated))
    }

    // Navegar
    router.push(result.href)
    setOpen(false)
  }, [recentSearches, router])

  const clearRecentSearches = () => {
    setRecentSearches([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("recent-searches")
    }
  }

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Buscar...</span>
        <span className="inline-flex lg:hidden">Buscar...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar ocorrências, páginas..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <>
              <CommandGroup heading="Buscas Recentes">
                {recentSearches.map((result) => (
                  <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium">{result.title}</span>
                      <span className="text-xs text-muted-foreground">{result.description}</span>
                    </div>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {getTypeLabel(result.type)}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
              <div className="flex items-center justify-between px-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="h-6 text-xs text-muted-foreground"
                >
                  <X className="mr-1 h-3 w-3" />
                  Limpar histórico
                </Button>
              </div>
              <CommandSeparator />
            </>
          )}

          {/* All Results grouped by type */}
          <CommandGroup heading="Ocorrências">
            {mockResults
              .filter((r) => r.type === "incident")
              .map((result) => (
                <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                  {getIcon(result.type)}
                  <div className="ml-2 flex flex-col flex-1">
                    <span className="text-sm font-medium">{result.title}</span>
                    <span className="text-xs text-muted-foreground">{result.description}</span>
                  </div>
                  {result.metadata && (
                    <span className="ml-2 text-xs text-muted-foreground">{result.metadata}</span>
                  )}
                </CommandItem>
              ))}
          </CommandGroup>

          <CommandGroup heading="Páginas">
            {mockResults
              .filter((r) => r.type === "page")
              .map((result) => (
                <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                  {getIcon(result.type)}
                  <div className="ml-2 flex flex-col flex-1">
                    <span className="text-sm font-medium">{result.title}</span>
                    <span className="text-xs text-muted-foreground">{result.description}</span>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
