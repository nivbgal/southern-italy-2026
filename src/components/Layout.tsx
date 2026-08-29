import { useEffect, useState, type PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { days, trip } from '../data/trip'

const navItems = [
  { to: '/', label: 'All days', index: '01' },
  { to: '/map', label: 'Map', index: '02' },
  { to: '/budget', label: 'Budget', index: '03' },
  { to: '/bookings', label: 'Bookings', index: '04' },
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
      {!online && <div className="offline-banner">Offline field-guide mode. The itinerary and saved notes still work. Maps and fresh weather need a connection.</div>}
      {needRefresh && (
        <div className="offline-banner update-banner">
          A fresher itinerary is ready.
          <button className="button secondary" onClick={() => updateServiceWorker(true)}>Refresh</button>
        </div>
      )}
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Southern Italy trip overview">
          <span className="brand-mark" aria-hidden="true">NR</span>
          <span>
            <strong>Niv & Rinat</strong>
            <small>Southern Italy / 2026</small>
          </span>
        </NavLink>
        <div className="trip-stamp" aria-label="Trip duration">
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
            {day.date === '2026-09-16' && <span className="birthday-marker" aria-label="Rinat's birthday">27</span>}
          </NavLink>
        ))}
      </nav>

      <main className="page-shell" id="main-content">{children}</main>

      <footer className="site-footer">
        <span>{trip.route.join(' / ')}</span>
        <nav className="footer-links" aria-label="Policy links">
          <NavLink to="/privacy">Privacy</NavLink>
          <NavLink to="/terms">Terms</NavLink>
        </nav>
        <span>Build {__BUILD_SHA__}. Private notes stay on this device.</span>
      </footer>

      <nav className="bottom-nav" aria-label="Primary navigation">
        {navItems.map(({ to, label, index }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            <small aria-hidden="true">{index}</small>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
