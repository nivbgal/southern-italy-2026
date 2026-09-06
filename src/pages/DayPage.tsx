import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Timeline } from '../components/Timeline'
import { WeatherPanel } from '../components/WeatherPanel'
import { DestinationPhoto } from '../components/DestinationPhoto'
import { photoForDay } from '../data/images'
import { days, lodging, venues } from '../data/trip'
import { venueBadge, venueRatingLabel } from '../lib/venue'
import { useTripState } from '../state/TripStateContext'

const birthdayRequest = `Hello, I would like to reserve a table for two at 20:00 on Wednesday, 16 September 2026. It is Rinat's 27th birthday. Could you add a birthday note and serve one dessert with a candle? If possible, we would like a quiet table. Please confirm the cover charge and whether the six-course chef menu is €75 per person. We have no dietary restrictions. Thank you, Niv.`

export function DayPage() {
  const { date } = useParams()
  const index = days.findIndex((day) => day.date === date)
  const day = days[index]
  const { state, patch } = useTripState()
  const [birthdayMessageStatus, setBirthdayMessageStatus] = useState('')
  if (!day) return <Navigate to="/" replace />

  const hotel = lodging.find((item) => item.id === day.overnightLodgingId)
  const featured = day.featuredVenueIds.map((id) => venues.find((venue) => venue.id === id)).filter(Boolean)
  const photo = photoForDay(day)

  return (
    <article className={day.date === '2026-09-16' ? 'is-birthday-page' : undefined}>
      <div className="day-opening">
        <header className="day-header">
          <div>
            <p className="eyebrow">Day {day.dayNumber} · {day.weekday}, {Number(day.date.slice(-2))} September</p>
            <h1>{day.title}</h1>
            <p>{day.subtitle}</p>
          </div>
          <div className="day-location"><small>Base</small><span>Sleep tonight<strong>{day.base}</strong></span></div>
        </header>

        <DestinationPhoto photo={photo} variant="day" eager />
      </div>

      <section className="day-meta">
        <div><small>Rise</small><span>Sunrise<strong>{day.sun.sunrise}</strong></span></div>
        <div><small>Set</small><span>Sunset<strong>{day.sun.sunset}</strong></span></div>
        <div><small>Cash</small><span>Cash ceiling<strong>€{day.cash.recommendedCarryEur}</strong></span></div>
        <div><small>Move</small><span>Mobility<strong>{day.driving.required ? 'Drive' : day.driving.mode === 'walk-and-transit' ? 'No car' : 'Transfer'}</strong></span></div>
      </section>

      <div className="day-dashboard">
        <WeatherPanel key={day.id} day={day} />
        <section className="cash-card">
          <p className="eyebrow">Wallet plan · for two</p>
          <h2>Carry up to €{day.cash.recommendedCarryEur}</h2>
          <p>{day.cash.note}</p>
          <ul>{day.cash.intendedFor.map((reason) => <li key={reason}>{reason}</li>)}</ul>
          <small>{day.cash.cardStrategy}</small>
        </section>
        <section className="drive-card">
          <p className="eyebrow">Movement & traffic</p>
          <h2>{day.driving.route ?? (day.driving.required ? 'Rental-car day' : 'No long drive')}</h2>
          {day.driving.distanceKm && <strong>{day.driving.distanceKm} km · {day.driving.plannedMinutes ? `${Math.floor(day.driving.plannedMinutes / 60)}h ${day.driving.plannedMinutes % 60}m planned` : ''}</strong>}
          <p>{day.driving.note}</p>
          {day.driving.traffic && <div className="traffic-note"><strong>Traffic:</strong> Typical delay +{day.driving.traffic.likelyDelayMinutes[0]}–{day.driving.traffic.likelyDelayMinutes[1]} min. {day.driving.traffic.explanation}</div>}
          {day.driving.parking && <small><strong>Parking:</strong> {day.driving.parking}</small>}
        </section>
      </div>

      {day.date === '2026-09-16' && (
        <section className="birthday-request">
          <div><p className="eyebrow">Draft only · review before sending</p><h2>Note for Radimare</h2><p>Use this in the booking note or send it before the meal. No message has been sent.</p><a className="inline-link" href="https://radimare.com/reservation/en" target="_blank" rel="noopener noreferrer">Open the live reservation page</a></div>
          <textarea readOnly value={birthdayRequest} aria-label="Birthday request draft" />
          <button className="button primary" type="button" onClick={() => { if (!navigator.clipboard) { setBirthdayMessageStatus('Copy is unavailable. Select the text above.'); return } void navigator.clipboard.writeText(birthdayRequest).then(() => setBirthdayMessageStatus('Copied. Review it before you send it.')).catch(() => setBirthdayMessageStatus('Copy failed. Select the text above.')) }}>Copy request</button>
          {birthdayMessageStatus && <p role="status">{birthdayMessageStatus}</p>}
        </section>
      )}

      <section className="timeline-section">
        <div className="section-heading"><div><p className="eyebrow">The lived-in version</p><h2>Hour by hour</h2></div><p>Tap the checks as the day unfolds. They stay only on this device.</p></div>
        <Timeline items={day.timeline} />
      </section>

      {featured.length > 0 && (
        <section>
          <div className="section-heading"><div><p className="eyebrow">Saved nearby</p><h2>Places worth the pin</h2></div><p>Each Google rating shows its check date and may change.</p></div>
          <div className="venue-grid">
            {featured.map((venue) => venue && (
              <article className="venue-card" key={venue.id}>
                <div><span className={`badge ${venue.personalPickReason ? 'personal-pick-badge' : ''}`}>{venueBadge(venue)}</span><span className="rating">{venueRatingLabel(venue)}</span></div>
                <h3>{venue.name}</h3><p>{venue.localAngle}</p>
                <address className="venue-address">{venue.address ?? `${venue.city}, Italy`}</address>
                {venue.personalPickReason && <p className="personal-pick-note"><strong>{venue.visitWindow}</strong>{venue.personalPickReason}</p>}
                <div className="venue-tags">{venue.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <a className="button secondary" href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="fallback-panel">
        <div className="card-heading"><span className="section-number" aria-hidden="true">B</span><div><p className="eyebrow">Plan B still works</p><h2>Weather, energy and closure fallbacks</h2></div></div>
        <div className="fallback-grid">{day.fallbacks.map((fallback) => <article key={fallback.title}><strong>{fallback.trigger}</strong><h3>{fallback.title}</h3><p>{fallback.plan}</p><small>{fallback.costImpact}</small></article>)}</div>
      </section>

      <section className="state-panel private-note">
        <div><p className="eyebrow">Private · stored only on this device</p><h2>Your note for {day.weekday}</h2></div>
        <textarea aria-label={`Private note for ${day.weekday}`} value={state.privateNotes[day.id] ?? ''} onChange={(event) => patch({ privateNotes: { ...state.privateNotes, [day.id]: event.target.value } })} placeholder="Booking code, outfit note, or surprise detail. This never syncs to the public repo." />
      </section>

      <section className="day-practical">
        <div>
          <p className="eyebrow">Sleep</p>
          <h2>{hotel?.name ?? 'Departure day'}</h2>
          {hotel && <address>{hotel.address}</address>}
          <p>{hotel?.notes.join(' ')}</p>
          {hotel && <div className="day-practical-links"><a href={hotel.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a><a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">Open Booking.com</a></div>}
        </div>
        <div><p className="eyebrow">Carry forward</p><ul>{day.practicalNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>
      </section>

      <nav className="day-pagination" aria-label="Adjacent days">
        {days[index - 1] ? <Link className="button secondary" to={`/day/${days[index - 1].date}`}>Previous day</Link> : <span />}
        {days[index + 1] ? <Link className="button primary" to={`/day/${days[index + 1].date}`}>Next day</Link> : <Link className="button primary" to="/">Trip overview</Link>}
      </nav>
    </article>
  )
}
