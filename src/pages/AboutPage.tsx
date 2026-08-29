import { ExternalLink, Globe2, LockKeyhole, RefreshCw, ShieldCheck } from 'lucide-react'
import { trip } from '../data/trip'

export function AboutPage() {
  return (
    <>
      <header className="page-intro"><p className="eyebrow">How to read this guide</p><h1>About this itinerary</h1><p>This public tool plans the trip. It cannot reserve anything. Each item shows its current status.</p></header>
      <div className="principles-grid">
        <article className="state-panel"><ShieldCheck /><h2>Status language</h2><p><strong>Confirmed</strong> means booked. <strong>Live quote</strong> means researched but not reserved. <strong>Requested</strong> means an operator still needs to reply. <strong>Typical</strong> means climate or traffic, not live conditions.</p></article>
        <article className="state-panel"><RefreshCw /><h2>Freshness</h2><p>Ratings, prices and hours were assembled on {trip.dataAsOf}. Reopen checkout pages and Maps immediately before reserving or visiting.</p></article>
        <article className="state-panel"><LockKeyhole /><h2>Privacy</h2><p>Flights, hotel candidates and the itinerary are public. Emails, booking references, payment information and private notes are never stored in the repository. Notes stay in this browser.</p></article>
        <article className="state-panel"><Globe2 /><h2>Online boundaries</h2><p>Itinerary content works offline. Live weather, OpenStreetMap tiles, Google Maps and booking links require an internet connection.</p></article>
      </div>
      <section className="sources-section">
        <div className="section-heading"><div><p className="eyebrow">Source register</p><h2>Where the facts came from</h2></div><p>Official sources win when they conflict with aggregators or Maps.</p></div>
        <div className="source-list">{trip.sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer"><span className="badge">{source.kind}</span><div><strong>{source.title}</strong><small>{source.publisher} · accessed {source.accessedOn} · {source.confidence} confidence</small></div><ExternalLink /></a>)}</div>
      </section>
      <section className="editorial-note"><h2>About the recommendations</h2><p>A Google Maps rating is evidence of broad approval, not proof that locals recommend a place. “Recommended by locals” appears only when a separate local editorial, tourism or municipal source supports it. Casa Grotta is the one permitted cultural exception to the 4.7/150 rule and is visibly labeled wherever it appears.</p></section>
    </>
  )
}
