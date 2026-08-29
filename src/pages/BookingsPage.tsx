import { CalendarCheck, Car, ExternalLink, Hotel, PartyPopper, Plane, ShieldCheck } from 'lucide-react'
import { bookings, lodging, trip } from '../data/trip'
import { useTripState } from '../state/TripStateContext'
import { StatusBadge } from '../components/StatusBadge'

const bookingIcons = { flight: Plane, lodging: Hotel, car: Car, activity: PartyPopper, restaurant: CalendarCheck, transfer: Car }

export function BookingsPage() {
  const { state, patch } = useTripState()
  return (
    <>
      <header className="page-intro"><p className="eyebrow">Booking status</p><h1>Bookings</h1><p>Only the flights are confirmed. You must reserve each hotel, car and activity.</p></header>

      <section className="booking-list">
        {bookings.map((booking) => {
          const Icon = bookingIcons[booking.kind]
          return (
            <article className="booking-card" key={booking.id}>
              <span className="booking-icon"><Icon /></span>
              <div className="booking-copy"><StatusBadge status={booking.status} /><h2>{booking.title}</h2><p>{booking.action}</p><small><strong>Deadline:</strong> {booking.deadline}</small>{booking.notes.length > 0 && <ul>{booking.notes.map((note) => <li key={note}>{note}</li>)}</ul>}</div>
              <div className="booking-action">
                {typeof booking.priceEurForTwo === 'number' && <span><small>{booking.priceStatus} · for two</small><strong>€{booking.priceEurForTwo}</strong></span>}
                {booking.sourceUrl && <a className="button secondary" href={booking.sourceUrl} target="_blank" rel="noopener noreferrer">Open source <ExternalLink /></a>}
                {booking.status !== 'booked' && booking.status !== 'confirmed' && <label>Private status<select value={state.bookingStates[booking.id] ?? 'todo'} onChange={(event) => patch({ bookingStates: { ...state.bookingStates, [booking.id]: event.target.value as 'todo' | 'reserved' | 'skipped' } })}><option value="todo">To do</option><option value="reserved">I reserved it</option><option value="skipped">Skip</option></select></label>}
              </div>
            </article>
          )
        })}
      </section>

      <section className="lodging-section">
        <div className="section-heading"><div><p className="eyebrow">12 continuous nights</p><h2>Where you’ll sleep</h2></div><p>Booking.com search cards were checked for the exact dates and two adults. No room is reserved. Unknown terms are shown below.</p></div>
        <div className="lodging-grid">{lodging.map((hotel) => <article className="booking-card lodging-card" key={hotel.id}><span className="booking-icon"><Hotel /></span><div><StatusBadge status={hotel.status} /><h3>{hotel.name}</h3><p>{hotel.city} · {hotel.nights} {hotel.nights === 1 ? 'night' : 'nights'} · {hotel.roomStyle}</p><p className="quote-note"><strong>Live quote · checked {hotel.quoteCheckedOn}</strong>{hotel.quoteDisplay}</p><dl className="lodging-facts"><div><dt>Taxes and fees</dt><dd>{hotel.taxesAndFees}</dd></div><div><dt>Cancellation</dt><dd>{hotel.cancellationTerms}</dd></div><div><dt>Payment</dt><dd>{hotel.paymentTerms}</dd></div><div><dt>Check-in</dt><dd>{hotel.checkInConstraints}</dd></div><div><dt>Parking</dt><dd>{hotel.parkingPlan}</dd></div><div><dt>Stairs and bags</dt><dd>{hotel.stairsAndLuggage}</dd></div></dl><ul>{hotel.notes.map((note) => <li key={note}>{note}</li>)}</ul></div><div className="booking-action"><span><small>live quote · for two</small><strong>€{hotel.totalEstimateEur}</strong><small>€{hotel.nightlyEquivalentEur.toFixed(2)} per night</small></span><a className="button secondary" href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">Refresh quote</a></div></article>)}</div>
      </section>

      <section className="car-rental-card">
        <div><p className="eyebrow">Automatic · 15–24 September</p><h2>{trip.car.class}</h2><p>{trip.car.supplier} shortlist · {trip.car.luggageFit}</p></div>
        <dl><div><dt>Base shortlist</dt><dd>€{trip.car.basePriceEur}</dd></div><div><dt>Hard allocation</dt><dd>€{trip.car.protectedBudgetEur}</dd></div><div><dt>Refundable hold</dt><dd>{trip.car.depositEur === null ? 'Not confirmed' : `€${trip.car.depositEur}`}</dd></div><div><dt>Excess</dt><dd>{trip.car.excessEur === null ? 'Not confirmed' : `€${trip.car.excessEur}`}</dd></div><div><dt>Fuel</dt><dd>{trip.car.fuelPolicy}</dd></div><div><dt>Mileage</dt><dd>{trip.car.mileage}</dd></div><div><dt>Desk or shuttle</dt><dd>{trip.car.deskProcess}</dd></div><div><dt>Liability</dt><dd>{trip.car.liabilityCover}</dd></div></dl>
        <div className="truth-note"><ShieldCheck /><p><strong>Prime Visa plan:</strong> request Chase’s proof-of-coverage letter, confirm the supplier permits declining optional CDW/LDW, and remember that card cover does not replace third-party liability or the rental hold.</p></div>
        <ul>{trip.car.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>
        <div className="car-alternatives"><h3>Fallback quotes</h3>{trip.car.alternatives.map((option) => <p key={`${option.supplier}-${option.model}`}><strong>{option.model} · {option.supplier} · €{option.basePriceEur}</strong><span>{option.note}</span></p>)}</div>
      </section>
    </>
  )
}
