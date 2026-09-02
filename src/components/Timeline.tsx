import type { TimelineItem } from '../data/types'
import { placeForTimelineItem } from '../lib/timeline-place'
import { useTripState } from '../state/TripStateContext'
import { StatusBadge } from './StatusBadge'

const checkedDate = (date: string) => {
  const [year, month, day] = date.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  const { state, patch } = useTripState()
  const toggle = (key: 'completed' | 'favorites', id: string) => {
    patch({ [key]: { ...state[key], [id]: !state[key][id] } })
  }

  return (
    <ol className="timeline">
      {items.map((item) => {
        const place = placeForTimelineItem(item)
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
                  <button aria-label={`${complete ? 'Mark incomplete' : 'Mark complete'}: ${item.title}`} aria-pressed={complete} className="text-action" onClick={() => toggle('completed', item.id)}>{complete ? 'Undo' : 'Done'}</button>
                  <button aria-label={`Save: ${item.title}`} aria-pressed={Boolean(state.favorites[item.id])} className="text-action" onClick={() => toggle('favorites', item.id)}>{state.favorites[item.id] ? 'Saved' : 'Save'}</button>
                </div>
              </div>
              <p className="timeline-detail">{item.detail}</p>
              {place && (
                <div className="timeline-location">
                  <div className="timeline-location-copy">
                    <small>{place.label} · checked {checkedDate(place.checkedOn)}</small>
                    <strong>{place.name}</strong>
                    <address>{place.address}</address>
                    {place.note && <p>{place.note}</p>}
                  </div>
                  <div className="timeline-location-links">
                    {place.links.map((link) => (
                      <a href={link.url} key={`${item.id}-${link.label}`} target="_blank" rel="noopener noreferrer">{link.label}</a>
                    ))}
                  </div>
                </div>
              )}
              <div className="timeline-footer">
                {item.endTime && <span>Until {item.endTime}</span>}
                {typeof item.costEurForTwo === 'number' && <span>€{item.costEurForTwo} for two · {item.priceStatus}</span>}
              </div>
            </article>
          </li>
        )
      })}
    </ol>
  )
}
