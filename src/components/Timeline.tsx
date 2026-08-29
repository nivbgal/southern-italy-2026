import { Check, Clock3, ExternalLink, Heart, MapPin } from 'lucide-react'
import { venues } from '../data/trip'
import type { TimelineItem } from '../data/types'
import { useTripState } from '../state/TripStateContext'
import { StatusBadge } from './StatusBadge'

export function Timeline({ items }: { items: TimelineItem[] }) {
  const { state, patch } = useTripState()
  const toggle = (key: 'completed' | 'favorites', id: string) => {
    patch({ [key]: { ...state[key], [id]: !state[key][id] } })
  }

  return (
    <ol className="timeline">
      {items.map((item) => {
        const venue = venues.find((candidate) => candidate.id === item.venueId)
        const complete = Boolean(state.completed[item.id])
        return (
          <li className={`timeline-item ${complete ? 'is-complete' : ''}`} key={item.id}>
            <time className="timeline-time">{item.time}<small>{item.timeZone === 'Asia/Jerusalem' ? 'TLV' : 'Italy'}</small></time>
            <article className="timeline-body">
              <div className="timeline-title">
                <div>
                  <StatusBadge status={item.status} />
                  <h3>{item.title}</h3>
                </div>
                <div className="icon-actions">
                  <button aria-label={`${complete ? 'Mark incomplete' : 'Mark complete'}: ${item.title}`} className="icon-button" onClick={() => toggle('completed', item.id)}><Check /></button>
                  <button aria-label={`Favorite: ${item.title}`} aria-pressed={Boolean(state.favorites[item.id])} className="icon-button" onClick={() => toggle('favorites', item.id)}><Heart /></button>
                </div>
              </div>
              <p className="timeline-detail">{item.detail}</p>
              <div className="timeline-footer">
                {item.endTime && <span><Clock3 /> Until {item.endTime}</span>}
                {typeof item.costEurForTwo === 'number' && <span>€{item.costEurForTwo} for two · {item.priceStatus}</span>}
                {venue && <a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin /> Open in Maps <ExternalLink /></a>}
              </div>
            </article>
          </li>
        )
      })}
    </ol>
  )
}
