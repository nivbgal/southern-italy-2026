import { Suspense, lazy, useMemo, useState } from 'react'
import { venues } from '../data/trip'
import { venueBadge, venueRatingLabel } from '../lib/venue'

const RouteMap = lazy(() => import('../components/RouteMap'))

const routeStops = [
  ['Naples Airport', '14–15 Sep', 'Late arrival, sleep, collect the car'],
  ['Polignano a Mare', '15–19 Sep', 'Birthday, caves, beach and Valle d’Itria'],
  ['Lecce & Salento', '19–22 Sep', 'Baroque lanes and two swappable beach days'],
  ['Matera', '22–24 Sep', 'Two nights and one complete Sassi day'],
  ['Naples', '24–26 Sep', 'Return the car, shop, eat, fly'],
]

export function MapPage() {
  const [filter, setFilter] = useState<'all' | 'personal' | 'restaurant' | 'attraction' | 'beach' | 'shopping'>('all')
  const filtered = useMemo(() => venues.filter((venue) => filter === 'all' || (filter === 'personal' ? Boolean(venue.personalPickReason) : venue.kind === filter)), [filter])
  return (
    <>
      <header className="page-intro"><p className="eyebrow">Five bases · one clean loop</p><h1>Map the road trip at a glance.</h1><p>The map is deliberately a planning map. Open Google Maps from any card for turn-by-turn directions and live traffic.</p></header>
      <div className="map-shell">
        <Suspense fallback={<div className="map-panel map-loading" role="status"><span>Loading route map</span><i className="skeleton skeleton-map" /></div>}><RouteMap /></Suspense>
        <aside className="map-list" aria-label="Route stops" tabIndex={0}>{routeStops.map(([name, dates, note], index) => <article key={name}><span>{index + 1}</span><div><small>{dates}</small><h2>{name}</h2><p>{note}</p></div></article>)}</aside>
      </div>
      <section className="map-truth"><p><strong>Traffic data is typical.</strong> Each day shows its expected range. Check Google Maps on the travel morning before leaving.</p></section>
      <section>
        <div className="section-heading"><div><p className="eyebrow">Saved pins · dated rating checks</p><h2>Places by category</h2></div><div className="filter-tabs" role="group" aria-label="Filter places">{(['all', 'personal', 'restaurant', 'attraction', 'beach', 'shopping'] as const).map((item) => <button className={filter === item ? 'active' : ''} aria-label={item === 'all' ? 'Show all places' : item === 'personal' ? 'Show Rinat’s picks' : `Show ${item}s`} aria-pressed={filter === item} key={item} onClick={() => setFilter(item)}>{item === 'all' ? 'All' : item === 'personal' ? 'Rinat’s picks' : item === 'restaurant' ? 'Eat' : item === 'attraction' ? 'See' : item === 'beach' ? 'Swim' : 'Shop'}</button>)}</div></div>
        <div className="venue-grid">{filtered.map((venue) => <article className="venue-card" key={venue.id}><div><span className="badge">{venue.city}</span>{venue.personalPickReason && <span className="badge personal-pick-badge">{venueBadge(venue)}</span>}<span className="rating">{venueRatingLabel(venue)}</span></div><h3>{venue.name}</h3><p>{venue.localAngle}</p>{venue.personalPickReason && <p className="personal-pick-note"><strong>{venue.visitWindow}</strong>{venue.personalPickReason}</p>}<a className="button secondary" href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></article>)}</div>
      </section>
    </>
  )
}
