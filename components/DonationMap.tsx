'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useMemo } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const LOCATIONS = [
  {
    name: 'First Congregational Church',
    address: '122 Broad Street, Guilford, CT',
    position: [41.2839, -72.6759],
    description: 'Drop shoes inside the lobby collection box on the Green.'
  },
  {
    name: 'Guilford Racquet & Swim Club',
    address: '420 Church Street, Guilford, CT',
    position: [41.2966, -72.6788],
    description: 'Leave donations at reception; our volunteers pick them up weekly.'
  }
] as const

export default function DonationMap() {
  const bounds = useMemo(() => {
    return L.latLngBounds(LOCATIONS.map((l) => l.position as [number, number]))
  }, [])

  return (
    <MapContainer
      bounds={bounds}
      className="h-[360px] w-full rounded-2xl"
      scrollWheelZoom={false}
      minZoom={13}
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {LOCATIONS.map((location) => (
        <Marker key={location.name} position={location.position as [number, number]}>
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{location.name}</p>
              <p className="text-sm text-gray-600">{location.address}</p>
              <p className="text-xs text-gray-500">{location.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
