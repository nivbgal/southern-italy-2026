import { useState } from 'react'
import { ArrowLeft, ArrowRight, Car, CircleEuro, ClipboardCopy, CloudRain, Navigation, ShieldAlert, Sunrise, Sunset } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Timeline } from '../components/Timeline'
import { WeatherPanel } from '../components/WeatherPanel'
import { days, lodging, venues } from '../data/trip'
import { useTripState } from '../state/TripStateContext'

const birthdayRequest = `Hello, I would like to book the evening cooking class on 16 September 2026 for two people. It is Rinat's 27th birthday. Can you offer a 19:30 start, a small cake presentation, lively music, local wine, and a safe, playful flour moment? Please confirm the total price for two, start time, duration, cancellation terms, and the birthday details that you can guarantee. We will book after your reply. Thank you, Niv.`

export function DayPage() {
  const { date } = useParams()
  const index = days.findIndex((day) => day.date === date)
  const day = days[index]
  const { state, patch } = useTripState()
  const [birthdayMessageStatus, setBirthdayMessageStatus] = useState('')
  if (!day) return <Navigate to="/" replace />

  const hotel = lodging.find((item) => item.id === day.overnightLodgingId)
  const featured = day.featuredVenueIds.map((id) => venues.find((venue) => venue.id === id)).filter(Boolean)

  return (
    <article className={day.date === '2026-09-16' ? 'is-birthday-page' : undefined}>
      <header className="day-header">
        <div>
          <p className="eyebrow">Day {day.dayNumber} · {day.weekday}, {Number(day.date.slice(-2))} September</p>
          <h1>{day.title}</h1>
          <p>{day.subtitle}</p>
        </div>
        <div className="day-location"><Navigation /><span>Base tonight<strong>{day.base}</strong></span></div>
      </header>

      <section className="day-meta">
        <div><Sunrise /><span>Sunrise<strong>{day.sun.sunrise}</strong></span></div>
        <div><Sunset /><span>Sunset<strong>{day.sun.sunset}</strong></span></div>
        <div><CircleEuro /><span>Cash ceiling<strong>€{day.cash.recommendedCarryEur}</strong></span></div>
        <div><Car /><span>Mobility<strong>{day.driving.required ? 'Drive' : day.driving.mode === 'walk-and-transit' ? 'No car' : 'Transfer'}</strong></span></div>
      </section>

      <div className="day-dashboard">
        <WeatherPanel day={day} />
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
          {day.driving.traffic && <div className="traffic-note"><ShieldAlert /> Typical delay +{day.driving.traffic.likelyDelayMinutes[0]}–{day.driving.traffic.likelyDelayMinutes[1]} min. {day.driving.traffic.explanation}</div>}
          {day.driving.parking && <small><strong>Parking:</strong> {day.driving.parking}</small>}
        </section>
      </div>

      {day.date === '2026-09-16' && (
        <section className="birthday-request">
          <div><p className="eyebrow">Draft only · approval needed before sending</p><h2>Message for Pugliamare</h2><p>The class page includes dinner, wine and limoncello. It does not promise a party.</p></div>
          <textarea readOnly value={birthdayRequest} aria-label="Birthday request draft" />
          <button className="button primary" type="button" onClick={() => { if (!navigator.clipboard) { setBirthdayMessageStatus('Copy is unavailable. Select the text above.'); return } void navigator.clipboard.writeText(birthdayRequest).then(() => setBirthdayMessageStatus('Copied. Review it before you send it.')).catch(() => setBirthdayMessageStatus('Copy failed. Select the text above.')) }}><ClipboardCopy /> Copy request</button>
          {birthdayMessageStatus && <p role="status">{birthdayMessageStatus}</p>}
        </section>
      )}

      <section className="timeline-section">
        <div className="section-heading"><div><p className="eyebrow">The lived-in version</p><h2>Hour by hour</h2></div><p>Tap the checks as the day unfolds. They stay only on this device.</p></div>
        <Timeline items={day.timeline} />
      </section>

      {featured.length > 0 && (
        <section>
          <div className="section-heading"><div><p className="eyebrow">Saved nearby</p><h2>Places worth the pin</h2></div><p>Google rating snapshots were checked 29 August 2026 and may change.</p></div>
          <div className="venue-grid">
            {featured.map((venue) => venue && (
              <article className="venue-card" key={venue.id}>
                <div><span className="badge">{venue.qualification === 'editor-exception' ? 'Editor exception' : '4.7+ verified'}</span><span className="rating">★ {venue.rating ?? '—'} · {venue.reviewCount?.toLocaleString() ?? 'not rated'} reviews</span></div>
                <h3>{venue.name}</h3><p>{venue.localAngle}</p>
                <div className="venue-tags">{venue.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <a className="button secondary" href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="fallback-panel">
        <div className="card-heading"><span className="icon-disc"><CloudRain /></span><div><p className="eyebrow">Plan B is still a good day</p><h2>Weather, energy and closure fallbacks</h2></div></div>
        <div className="fallback-grid">{day.fallbacks.map((fallback) => <article key={fallback.title}><strong>{fallback.trigger}</strong><h3>{fallback.title}</h3><p>{fallback.plan}</p><small>{fallback.costImpact}</small></article>)}</div>
      </section>

      <section className="state-panel private-note">
        <div><p className="eyebrow">Private · stored only on this device</p><h2>Your note for {day.weekday}</h2></div>
        <textarea aria-label={`Private note for ${day.weekday}`} value={state.privateNotes[day.id] ?? ''} onChange={(event) => patch({ privateNotes: { ...state.privateNotes, [day.id]: event.target.value } })} placeholder="Booking code, outfit note, surprise detail… This never syncs to the public repo." />
      </section>

      <section className="day-practical">
        <div><p className="eyebrow">Sleep</p><h2>{hotel?.name ?? 'Departure day'}</h2><p>{hotel?.notes.join(' ')}</p></div>
        <div><p className="eyebrow">Carry forward</p><ul>{day.practicalNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>
      </section>

      <nav className="day-pagination" aria-label="Adjacent days">
        {days[index - 1] ? <Link className="button secondary" to={`/day/${days[index - 1].date}`}><ArrowLeft /> Previous day</Link> : <span />}
        {days[index + 1] ? <Link className="button primary" to={`/day/${days[index + 1].date}`}>Next day <ArrowRight /></Link> : <Link className="button primary" to="/">Trip overview <ArrowRight /></Link>}
      </nav>
    </article>
  )
}
