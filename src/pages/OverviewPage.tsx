import { Link } from 'react-router-dom'
import { budgetCategories, days, trip, venues } from '../data/trip'
import { tripPhotos } from '../data/images'
import { DestinationPhoto } from '../components/DestinationPhoto'
import { StatusBadge } from '../components/StatusBadge'

export function OverviewPage() {
  const birthday = days.find((day) => day.date === '2026-09-16')!
  const spent = budgetCategories.filter((item) => item.status !== 'excluded' && item.status !== 'reserve').reduce((sum, item) => sum + item.amountEur, 0)
  const personalPicks = ['clarks-shop-bari', 'pugliamare-cooking-class', 'lido-bambu', 'il-quadrifoglio-monopoli', 'marina-serra-natural-pool']
    .map((id) => venues.find((venue) => venue.id === id))
    .filter((venue): venue is NonNullable<typeof venue> => Boolean(venue?.personalPickReason))

  return (
    <>
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">A field guide for two · 14–26 September 2026</p>
          <h1>Thirteen days south of ordinary.</h1>
          <p className="hero-lede">A beach-first road trip through Puglia, a full day inside Matera’s stone city, and a final Naples shopping-and-pizza landing.</p>
          <div className="hero-actions">
            <Link className="button primary" to="/day/2026-09-14">Start with arrival</Link>
            <Link className="button secondary" to="/map">See the route</Link>
          </div>
        </div>
        <DestinationPhoto photo={tripPhotos.polignano} variant="hero" eager />
      </section>

      <section className="route-sketch" aria-label="Route from Naples to Puglia, Matera and back to Naples">
        <div className="route-line" aria-hidden="true" />
        {trip.route.map((stop, index) => {
          return <div className="route-stop" key={stop}><span>{String(index + 1).padStart(2, '0')}</span><strong>{stop}</strong><small>{index === 0 ? 'Land' : index === trip.route.length - 1 ? 'Fly home' : `${days.filter((day) => day.base.includes(stop.split(' ')[0])).length || 2} days`}</small></div>
        })}
      </section>

      <section className="trip-pulse" aria-label="Trip at a glance">
        <div><small>Stay</small><span><strong>12</strong> nights</span></div>
        <div><small>Drive</small><span><strong>9</strong> rental days</span></div>
        <div><small>Coast</small><span><strong>3</strong> beach chances</span></div>
        <div><small>Budget</small><span><strong>€{trip.budgetBufferEur}</strong> buffer</span></div>
      </section>

      <section className="section-heading">
        <div><p className="eyebrow">The whole route</p><h2>Day by day</h2></div>
        <p>Every time is local. Quotes are visibly separated from confirmed bookings.</p>
      </section>
      <div className="route-grid">
        {days.map((day) => (
          <Link className={`day-card ${day.date === birthday.date ? 'birthday-day' : ''}`} to={`/day/${day.date}`} key={day.date}>
            <div className="day-card-date"><small>{day.weekday}</small><strong>{Number(day.date.slice(-2))}</strong><span>SEP</span></div>
            <div>
              <StatusBadge status={day.timeline.some((item) => item.status === 'booked') ? 'booked' : 'planned'} />
              <h3>{day.title}</h3>
              <p>{day.subtitle}</p>
              <span className="day-card-meta">{day.base} · €{day.cash.recommendedCarryEur} cash ceiling</span>
            </div>
            <span className="day-card-action">Open day</span>
          </Link>
        ))}
      </div>

      <section className="personal-picks">
        <div className="section-heading"><div><p className="eyebrow">Saved by Rinat</p><h2>Five places fitted into the route</h2></div><p>Maps ratings were checked 29 August 2026. A low rating stays visible.</p></div>
        <div className="personal-pick-list">
          {personalPicks.map((venue, index) => (
            <article key={venue.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><small>{venue.visitWindow}</small><h3>{venue.name}</h3><p>{venue.localAngle}</p></div>
              <div><strong>{venue.rating?.toFixed(1)}</strong><small>{venue.reviewCount?.toLocaleString()} reviews</small></div>
              <a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">Open map</a>
            </article>
          ))}
        </div>
      </section>

      <section className="birthday-card">
        <div className="birthday-confetti" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div>
          <p className="eyebrow">Wednesday · 16 September</p>
          <h2>Rinat turns 27 by the Adriatic</h2>
          <p>Boat caves and a swim, a slow afternoon, sunset cake and prosecco, then a cooking class with dinner, local wine and limoncello.</p>
          <p className="truth-note"><strong>Current status:</strong> the evening time and party treatment still need confirmation.</p>
        </div>
        <div className="birthday-price"><small>planned for two</small><strong>€243–248</strong><Link className="button primary" to={`/day/${birthday.date}`}>Open birthday plan</Link></div>
      </section>

      <section className="budget-card overview-budget">
        <div><p className="eyebrow">Hard trip envelope</p><h2>€{spent.toLocaleString()} planned of €{trip.budgetCapEur.toLocaleString()}</h2><p>Flights and personal shopping are excluded. Deposits are liquidity, not spending.</p></div>
        <div className="budget-meter" role="progressbar" aria-label="Planned trip budget" aria-valuemin={0} aria-valuemax={trip.budgetCapEur} aria-valuenow={spent}><span style={{ width: `${Math.min(100, spent / trip.budgetCapEur * 100)}%` }} /></div>
        <Link className="button secondary" to="/budget">Inspect every euro</Link>
      </section>
    </>
  )
}
