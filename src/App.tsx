import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { TripStateProvider } from './state/TripStateContext'
import { AboutPage } from './pages/AboutPage'
import { BookingsPage } from './pages/BookingsPage'
import { BudgetPage } from './pages/BudgetPage'
import { DayPage } from './pages/DayPage'
import { MapPage } from './pages/MapPage'
import { OverviewPage } from './pages/OverviewPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'

function App() {
  return (
    <HashRouter>
      <TripStateProvider>
        <a className="skip-link" href="#main-content">Skip to itinerary</a>
        <Layout>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/day/:date" element={<DayPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<OverviewPage />} />
          </Routes>
        </Layout>
      </TripStateProvider>
    </HashRouter>
  )
}

export default App
