import { createContext, useContext, type PropsWithChildren } from 'react'
import { useLocalTripState } from '../lib/localState'

type TripStateValue = ReturnType<typeof useLocalTripState>

const TripStateContext = createContext<TripStateValue | null>(null)

export function TripStateProvider({ children }: PropsWithChildren) {
  const value = useLocalTripState()
  return <TripStateContext.Provider value={value}>{children}</TripStateContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- the hook and provider intentionally share one private context.
export function useTripState() {
  const value = useContext(TripStateContext)
  if (!value) throw new Error('useTripState must be used inside TripStateProvider')
  return value
}
