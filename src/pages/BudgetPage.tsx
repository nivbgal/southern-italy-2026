import { Banknote, CircleEuro, Download, Info, RotateCcw, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { budgetCategories, trip } from '../data/trip'
import { useTripState } from '../state/TripStateContext'

export function BudgetPage() {
  const { state, patch, exportState, importState, reset } = useTripState()
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const planned = budgetCategories.filter((item) => item.status !== 'excluded' && item.status !== 'reserve').reduce((sum, item) => sum + item.amountEur, 0)
  const actual = Object.values(state.actualSpending).reduce((sum, value) => sum + (Number(value) || 0), 0)

  const handleImport = async (file?: File) => {
    if (!file) return
    try {
      importState(await file.text())
      setMessage('Private trip state restored on this device.')
    } catch {
      setMessage('That backup could not be read. Nothing was changed.')
    }
  }

  return (
    <>
      <header className="page-intro"><p className="eyebrow">The non-negotiable ceiling</p><h1>Budget €3,000 for two, with the truth visible.</h1><p>Quotes are not bookings, deposits are not spending, and shopping is Rinat’s separate universe.</p></header>
      <section className="budget-hero">
        <div><CircleEuro /><span>Planned<strong>€{planned.toLocaleString()}</strong></span></div>
        <div><Banknote /><span>Entered actuals<strong>€{actual.toLocaleString()}</strong></span></div>
        <div><Info /><span>Unallocated buffer<strong>€{(trip.budgetCapEur - planned).toLocaleString()}</strong></span></div>
        <div className="budget-meter" role="progressbar" aria-label="Planned trip budget" aria-valuemin={0} aria-valuemax={trip.budgetCapEur} aria-valuenow={planned}><span style={{ width: `${planned / trip.budgetCapEur * 100}%` }} /></div>
      </section>

      <section className="budget-list" aria-label="Budget categories">
        {budgetCategories.map((item) => (
          <article className="budget-card" key={item.id}>
            <div><span className={`badge badge-${item.status}`}>{item.status}</span><h2>{item.label}</h2><p>{item.note}</p></div>
            <div className="budget-value"><strong>{item.status === 'excluded' ? 'Excluded' : `€${item.amountEur.toLocaleString()}`}</strong>
              {item.status !== 'excluded' && item.status !== 'reserve' && <label>Actual so far<input type="number" min="0" inputMode="decimal" value={state.actualSpending[item.id] ?? ''} onChange={(event) => patch({ actualSpending: { ...state.actualSpending, [item.id]: Number(event.target.value) } })} placeholder="€0" /></label>}
            </div>
          </article>
        ))}
      </section>

      <section className="cash-plan">
        <p className="eyebrow">Cash is a wallet limit, not extra spend</p>
        <h2>Withdraw €300–350 first. Top up €150–200 only if needed.</h2>
        <p>Split it between you, keep cards primary, usually carry no more than €120–150 collectively, and always reject dynamic currency conversion.</p>
      </section>

      <section className="state-panel">
        <div><p className="eyebrow">Private device state</p><h2>Back up your checkmarks, notes and actual spend</h2><p>The export is created locally. It is never uploaded by this site.</p>{message && <p role="status">{message}</p>}</div>
        <div className="state-actions">
          <button className="button secondary" onClick={exportState}><Download /> Export</button>
          <button className="button secondary" onClick={() => inputRef.current?.click()}><Upload /> Import</button>
          <input className="sr-only" ref={inputRef} type="file" accept="application/json" aria-label="Import private trip state backup" onChange={(event) => void handleImport(event.target.files?.[0])} />
          <button className="button ghost" onClick={() => { if (window.confirm('Reset every local checkmark, note and spending entry?')) reset() }}><RotateCcw /> Reset</button>
        </div>
      </section>
    </>
  )
}
