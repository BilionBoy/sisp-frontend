"use client"

import React, { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, MapPin, Navigation2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  type: "incident" | "address" | "landmark"
}

interface MapSearchProps {
  onSelectLocation?: (lat: number, lng: number, zoom?: number) => void
  onClose?: () => void
  className?: string
  placeholder?: string
}

/**
 * Componente de busca geográfica - Versão melhorada
 */
export function MapSearch({
  onSelectLocation,
  onClose,
  className,
  placeholder = "Buscar endereço, local ou ocorrência...",
}: MapSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      name: "Av. Presidente Dutra",
      address: "Centro, Porto Velho - RO",
      lat: -8.76077,
      lng: -63.8999,
      type: "address",
    },
    {
      id: "2",
      name: "Praça das Três Caixas D'Água",
      address: "Centro, Porto Velho - RO",
      lat: -8.7607,
      lng: -63.9001,
      type: "landmark",
    },
    {
      id: "3",
      name: "Terminal Rodoviário",
      address: "Zona Leste, Porto Velho - RO",
      lat: -8.7620,
      lng: -63.8850,
      type: "landmark",
    },
    {
      id: "4",
      name: "Parque da Cidade",
      address: "Zona Norte, Porto Velho - RO",
      lat: -8.7400,
      lng: -63.8750,
      type: "landmark",
    },
  ]

  const handleSearch = useCallback(() => {
    if (!query.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)

    setTimeout(() => {
      const filtered = mockResults.filter(
        (result) =>
          result.name.toLowerCase().includes(query.toLowerCase()) ||
          result.address.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setShowResults(true)
      setIsSearching(false)
    }, 300)
  }, [query])

  const handleSelectResult = (result: SearchResult) => {
    onSelectLocation?.(result.lat, result.lng, 16)
    setQuery(result.name)
    setShowResults(false)
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
  }

  const getResultIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "incident":
        return <MapPin className="h-4 w-4 text-destructive" />
      case "landmark":
        return <Navigation2 className="h-4 w-4 text-primary" />
      case "address":
      default:
        return <MapPin className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getResultBadge = (type: SearchResult["type"]) => {
    switch (type) {
      case "incident":
        return <Badge variant="destructive" className="text-[9px] px-1.5 py-0.5">Ocorrência</Badge>
      case "landmark":
        return <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5">Ponto Ref.</Badge>
      case "address":
      default:
        return <Badge variant="outline" className="text-[9px] px-1.5 py-0.5">Endereço</Badge>
    }
  }

  return (
    <Card className={cn(
      "absolute top-[4.5rem] right-2 sm:right-4 md:top-24 z-[1000] shadow-xl backdrop-blur-md bg-card/98 border-2",
      "w-[calc(100vw-1rem)] sm:w-80",
      className
    )}>
      <div className="p-3 space-y-2">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
            placeholder={placeholder}
            className="pl-9 pr-20 h-10 text-sm border-2 focus-visible:ring-2"
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-accent"
                onClick={handleClear}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              size="sm"
              className="h-7 px-3 text-xs font-medium shadow-sm"
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
            >
              {isSearching ? "..." : "Buscar"}
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="space-y-1 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
            {results.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-6 w-6 text-muted-foreground opacity-40" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Nenhum resultado</p>
                <p className="text-xs text-muted-foreground">
                  Tente outro termo de busca
                </p>
              </div>
            ) : (
              results.map((result) => (
                <Button
                  key={result.id}
                  variant="ghost"
                  className="w-full justify-start h-auto py-2.5 px-3 text-left hover:bg-accent/80 rounded-lg transition-colors"
                  onClick={() => handleSelectResult(result)}
                >
                  <div className="flex items-start gap-2.5 w-full">
                    <div className="mt-0.5 flex-shrink-0">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-medium truncate text-foreground">{result.name}</p>
                        {getResultBadge(result.type)}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {result.address}
                      </p>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        )}

        {/* Quick Locations */}
        {!showResults && !query && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">LOCAIS RÁPIDOS</p>
            </div>
            <div className="space-y-1">
              {mockResults.slice(0, 3).map((result) => (
                <Button
                  key={result.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-9 text-xs font-normal hover:bg-accent/80 transition-colors"
                  onClick={() => handleSelectResult(result)}
                >
                  <Navigation2 className="h-3.5 w-3.5 mr-2.5 flex-shrink-0 text-primary" />
                  <span className="truncate">{result.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </Card>
  )
}
