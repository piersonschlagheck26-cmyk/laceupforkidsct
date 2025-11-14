'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const LOCATIONS = [
  {
    name: 'First Congregational Church',
    address: '122 Broad Street, Guilford, CT',
    position: [41.2819, -72.675],
    description: 'Drop shoes inside the lobby collection box on the Green.'
  },
  {
    name: 'Guilford Racquet & Swim Club',
    address: '420 Church Street, Guilford, CT',
    position: [41.2915, -72.6735],
    description: 'Leave donations at the reception desk—pickup happens weekly.'
  }
] as const

const sneakerIcon = L.icon({
  iconUrl: '/images/sneaker-top.svg',
  iconSize: [42, 90],
  iconAnchor: [21, 45],
  popupAnchor: [0, -40],
  className: 'map-sneaker-icon'
})

export default function DonationMap() {
  const bounds = useMemo(() => {
    return L.latLngBounds(LOCATIONS.map((l) => l.position as [number, number]))
  }, [])

  return (
    <MapContainer
      bounds={bounds}
      className="h-[360px] w-full rounded-2xl"
      scrollWheelZoom={false}
      minZoom={12}
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {LOCATIONS.map((location) => (
        <Marker key={location.name} position={location.position as [number, number]} icon={sneakerIcon}>
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
