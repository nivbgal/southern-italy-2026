import { divIcon, latLngBounds } from 'leaflet'
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const route = [
  { name: 'Naples Airport', dates: '14–15 Sep', point: [40.886, 14.2908] as [number, number] },
  { name: 'Polignano a Mare', dates: '15–19 Sep', point: [40.9952, 17.2207] as [number, number] },
  { name: 'Lecce', dates: '19–22 Sep', point: [40.3515, 18.175] as [number, number] },
  { name: 'Matera', dates: '22–24 Sep', point: [40.6664, 16.6043] as [number, number] },
  { name: 'Naples', dates: '24–26 Sep', point: [40.8518, 14.2681] as [number, number] },
]

function FitRoute() {
  const map = useMap()
  map.fitBounds(latLngBounds(route.map((stop) => stop.point)), { padding: [32, 32] })
  return null
}

export default function RouteMap() {
  void divIcon
  return (
    <MapContainer className="map-panel" center={[40.7, 16.2]} zoom={7} scrollWheelZoom={false} aria-label="Map of the Southern Italy route">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={route.map((stop) => stop.point)} pathOptions={{ color: '#483cff', weight: 5, opacity: 0.85, dashArray: '10 8' }} />
      {route.map((stop, index) => <CircleMarker key={`${stop.name}-${index}`} center={stop.point} radius={index === 0 || index === route.length - 1 ? 10 : 8} pathOptions={{ color: '#004449', fillColor: index === 2 ? '#d7ffc2' : '#fffef0', fillOpacity: 1, weight: 4 }}><Popup><strong>{stop.name}</strong><br />{stop.dates}</Popup></CircleMarker>)}
      <FitRoute />
    </MapContainer>
  )
}
