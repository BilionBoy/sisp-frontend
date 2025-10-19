"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { MOCK_INCIDENTS } from "@/lib/data/mock-incidents"
import type { Incident } from "@/lib/types/map"

// Dynamic import do mapa melhorado
const EnhancedInteractiveMap = dynamic(
  () => import("@/components/maps/EnhancedInteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full rounded-lg border border-border bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando mapa de calor...</p>
        </div>
      </div>
    ),
  }
)

interface HeatMapProps {
  onIncidentClick: (id: string) => void
  incidents?: Incident[]
  height?: string
  showSearch?: boolean
  showAdvancedControls?: boolean
  showLegend?: boolean
}

/**
 * Componente HeatMap Real - Substituição do mapa mockado
 *
 * Este componente mantém a mesma interface do heat-map.tsx original,
 * mas usa o mapa interativo real com React-Leaflet.
 *
 * Características:
 * - Mapa de calor real com leaflet.heat
 * - Markers interativos
 * - Clustering de ocorrências
 * - Controles avançados
 * - Busca geográfica
 * - Dados realistas de Porto Velho
 *
 * @param onIncidentClick - Callback quando uma ocorrência é clicada
 * @param incidents - Array de ocorrências (opcional, usa mock se não fornecido)
 * @param height - Altura do mapa
 * @param showSearch - Mostrar campo de busca
 * @param showAdvancedControls - Mostrar controles avançados
 * @param showLegend - Mostrar legenda
 */
export function HeatMapReal({
  onIncidentClick,
  incidents,
  height = "500px",
  showSearch = true,
  showAdvancedControls = true,
  showLegend = true,
}: HeatMapProps) {
  // Usar dados mockados se não fornecidos
  const mapIncidents = useMemo(() => {
    return incidents || MOCK_INCIDENTS.slice(0, 50) // Limitar a 50 para performance
  }, [incidents])

  return (
    <EnhancedInteractiveMap
      incidents={mapIncidents}
      onIncidentClick={onIncidentClick}
      center={[-8.76077, -63.8999]} // Porto Velho, RO
      zoom={12}
      height={height}
      showSearch={showSearch}
      showAdvancedControls={showAdvancedControls}
      showLegend={showLegend}
    />
  )
}

// Export adicional para retrocompatibilidade
export { HeatMapReal as HeatMap }
