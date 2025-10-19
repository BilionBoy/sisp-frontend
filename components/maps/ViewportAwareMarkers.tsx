import { useState, useEffect, useMemo } from 'react'
import { useMap, useMapEvents, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Incident } from '@/lib/types/map'

interface ViewportAwareMarkersProps {
  incidents: Incident[]
  onIncidentClick?: (id: string) => void
  createCustomIcon: (priority: "high" | "medium" | "low", isActive: boolean) => L.DivIcon
  selectedIncident: string | null
  renderPopupContent: (incident: Incident) => React.ReactNode
}

export function ViewportAwareMarkers({
  incidents,
  onIncidentClick,
  createCustomIcon,
  selectedIncident,
  renderPopupContent
}: ViewportAwareMarkersProps) {
  const map = useMap()
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null)

  useMapEvents({
    moveend: () => {
      setBounds(map.getBounds())
    },
    zoomend: () => {
      setBounds(map.getBounds())
    },
  })

  useEffect(() => {
    setBounds(map.getBounds())
  }, [map])

  const visibleIncidents = useMemo(() => {
    if (!bounds) return incidents

    const padding = 0.1
    const extendedBounds = bounds.pad(padding)

    return incidents.filter(inc =>
      extendedBounds.contains([inc.lat, inc.lng])
    )
  }, [incidents, bounds])

  return (
    <>
      {visibleIncidents.map(incident => (
        <Marker
          key={incident.id}
          position={[incident.lat, incident.lng]}
          icon={createCustomIcon(incident.priority, selectedIncident === incident.id)}
          eventHandlers={{
            click: () => onIncidentClick?.(incident.id),
          }}
        >
          <Popup className="p-3">
            {renderPopupContent(incident)}
          </Popup>
        </Marker>
      ))}
    </>
  )
}
