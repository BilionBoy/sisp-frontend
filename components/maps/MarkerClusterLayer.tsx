import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import type { Incident } from '@/lib/types/map'

interface MarkerClusterLayerProps {
  incidents: Incident[]
  onIncidentClick?: (id: string) => void
  createCustomIcon: (priority: "high" | "medium" | "low", isActive: boolean) => L.DivIcon
  selectedIncident: string | null
}

export function MarkerClusterLayer({
  incidents,
  onIncidentClick,
  createCustomIcon,
  selectedIncident
}: MarkerClusterLayerProps) {
  const map = useMap()

  useEffect(() => {
    const markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount()
        const markers = cluster.getAllChildMarkers() as Array<L.Marker & { options: { priority?: string } }>

        const priorities = markers.map(m => m.options.priority)
        const highCount = priorities.filter(p => p === 'high').length

        const color = highCount > count / 2 ? '#ef4444' :
                     highCount > 0 ? '#f59e0b' : '#10b981'

        return L.divIcon({
          html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
            ${count}
          </div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(40, 40),
        })
      },
    })

    incidents.forEach(incident => {
      const marker = L.marker([incident.lat, incident.lng], {
        icon: createCustomIcon(incident.priority, selectedIncident === incident.id),
      })

      ;(marker as any).options.priority = incident.priority

      marker.bindPopup(`
        <div class="p-2 bg-background border-2 min-w-[250px]">
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-semibold text-sm">${incident.id}</h3>
            <span class="text-xs px-2 py-1 rounded ${
              incident.priority === 'high' ? 'bg-red-500 text-white' :
              incident.priority === 'medium' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
            }">${incident.priority === 'high' ? 'Alta' : incident.priority === 'medium' ? 'Média' : 'Baixa'}</span>
          </div>
          <div class="space-y-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">${incident.type}</span>
            </div>
            ${incident.address ? `<div class="flex items-start gap-2">
              <span class="text-muted-foreground">${incident.address}</span>
            </div>` : ''}
            ${incident.timestamp ? `<div class="flex items-center gap-2">
              <span class="text-muted-foreground">${incident.timestamp}</span>
            </div>` : ''}
            ${incident.zone ? `<div class="flex items-center gap-2">
              <span class="text-muted-foreground">${incident.zone}</span>
            </div>` : ''}
            <div class="mt-2">
              <span class="text-xs px-2 py-1 border rounded">${incident.status}</span>
            </div>
          </div>
        </div>
      `)

      marker.on('click', () => {
        if (onIncidentClick) {
          onIncidentClick(incident.id)
        }
      })

      markerClusterGroup.addLayer(marker)
    })

    map.addLayer(markerClusterGroup)

    return () => {
      map.removeLayer(markerClusterGroup)
    }
  }, [map, incidents, createCustomIcon, selectedIncident, onIncidentClick])

  return null
}
