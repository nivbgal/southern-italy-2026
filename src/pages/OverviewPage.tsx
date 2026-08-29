import { ArrowRight, CakeSlice, Car, CircleEuro, Clock3, Palmtree, Plane, ShoppingBag, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { budgetCategories, days, trip } from '../data/trip'
import { StatusBadge } from '../components/StatusBadge'

const routeIcons = [Plane, Palmtree, Palmtree, Sparkles, ShoppingBag]

export function OverviewPage() {
  const birthday = days.find((day) => day.date === '2026-09-16')!
  const spent = budgetCategories.filter((item) => item.status !== 'excluded' && item.status !== 'reserve').reduce((sum, item) => sum + item.amountEur, 0)

  return (
    <>
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">A field guide for two · 14–26 September 2026</p>
          <h1>Thirteen days south of ordinary.</h1>
          <p className="hero-lede">A beach-first road trip through Puglia, a full day inside Matera’s stone city, and a final Naples shopping-and-pizza landing.</p>
          <div className="hero-actions">
            <Link className="button primary" to="/day/2026-09-14">Start with arrival <ArrowRight /></Link>
            <Link className="button secondary" to="/map">See the route</Link>
          </div>
        </div>
        <div className="route-sketch" aria-label="Route from Naples to Puglia, Matera and back to Naples">
          <div className="route-line" aria-hidden="true" />
          {trip.route.map((stop, index) => {
            const Icon = routeIcons[index] ?? Car
            return <div className="route-stop" key={stop}><span><Icon /></span><strong>{stop}</strong><small>{index === 0 ? 'Land' : index === trip.route.length - 1 ? 'Fly home' : `${days.filter((day) => day.base.includes(stop.split(' ')[0])).length || 2} days`}</small></div>
          })}
        </div>
      </section>

      <section className="trip-pulse" aria-label="Trip at a glance">
        <div><Clock3 /><span><strong>12</strong> nights</span></div>
        <div><Car /><span><strong>9</strong> rental days</span></div>
        <div><Palmtree /><span><strong>3</strong> beach chances</span></div>
        <div><CircleEuro /><span><strong>€{trip.budgetBufferEur}</strong> buffer</span></div>
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
            <ArrowRight aria-hidden="true" />
          </Link>
        ))}
      </div>

      <section className="birthday-card">
        <div className="birthday-confetti" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div>
          <p className="eyebrow">Wednesday · 16 September</p>
          <h2><CakeSlice /> Rinat turns 27 by the Adriatic</h2>
          <p>Boat caves and a swim, a slow afternoon, sunset cake and prosecco, then a cooking class with dinner, local wine and limoncello.</p>
          <p className="truth-note"><strong>Honest status:</strong> the evening time and party treatment are requested targets, not confirmed promises.</p>
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
