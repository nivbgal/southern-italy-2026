import { useEffect, useState, type PropsWithChildren } from 'react'
import { CalendarDays, Car, CheckSquare, Map, PiggyBank, Plane, Route, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { days, trip } from '../data/trip'

const navItems = [
  { to: '/', label: 'All days', icon: CalendarDays },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/budget', label: 'Budget', icon: PiggyBank },
  { to: '/bookings', label: 'Bookings', icon: CheckSquare },
]

export function Layout({ children }: PropsWithChildren) {
  const [online, setOnline] = useState(navigator.onLine)
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine)
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  return (
    <div className="app-shell">
      {!online && <div className="offline-banner">Offline field-guide mode — itinerary and saved notes still work; maps and fresh weather need a connection.</div>}
      {needRefresh && (
        <div className="offline-banner update-banner">
          A fresher itinerary is ready.
          <button className="button secondary" onClick={() => updateServiceWorker(true)}>Refresh</button>
        </div>
      )}
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Southern Italy trip overview">
          <span className="brand-mark" aria-hidden="true"><Route /></span>
          <span>
            <strong>Niv & Rinat</strong>
            <small>Southern Italy · 2026</small>
          </span>
        </NavLink>
        <div className="trip-stamp" aria-label="Trip duration">
          <Plane aria-hidden="true" />
          <span>14–26 Sep</span>
          <i>12 nights</i>
        </div>
        <nav className="top-nav" aria-label="Primary navigation">
          {navItems.map(({ to, label }) => <NavLink key={to} to={to}>{label}</NavLink>)}
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>

      <nav className="date-strip" aria-label="Choose an itinerary day">
        {days.map((day) => (
          <NavLink key={day.date} to={`/day/${day.date}`} className="date-chip">
            <small>{day.weekday.slice(0, 3)}</small>
            <strong>{Number(day.date.slice(-2))}</strong>
            {day.date === '2026-09-16' && <Sparkles aria-label="Birthday" />}
          </NavLink>
        ))}
      </nav>

      <main className="page-shell" id="main-content">{children}</main>

      <footer className="site-footer">
        <span><Car aria-hidden="true" /> {trip.route.join(' → ')}</span>
        <span>Build {__BUILD_SHA__} · Public itinerary, private notes stay on this device</span>
      </footer>

      <nav className="bottom-nav" aria-label="Primary navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
