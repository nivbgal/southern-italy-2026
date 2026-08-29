import { useCallback, useEffect, useState } from 'react'

export interface LocalTripState {
  version: 1
  completed: Record<string, boolean>
  favorites: Record<string, boolean>
  actualSpending: Record<string, number>
  bookingStates: Record<string, 'todo' | 'reserved' | 'skipped'>
  privateNotes: Record<string, string>
}

const STORAGE_KEY = 'southern-italy-2026:state'

export const emptyLocalState: LocalTripState = {
  version: 1,
  completed: {},
  favorites: {},
  actualSpending: {},
  bookingStates: {},
  privateNotes: {},
}

export function readLocalState(): LocalTripState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyLocalState
    const parsed = JSON.parse(raw) as Partial<LocalTripState>
    if (parsed.version !== 1) return emptyLocalState
    return {
      ...emptyLocalState,
      ...parsed,
      completed: parsed.completed ?? {},
      favorites: parsed.favorites ?? {},
      actualSpending: parsed.actualSpending ?? {},
      bookingStates: parsed.bookingStates ?? {},
      privateNotes: parsed.privateNotes ?? {},
    }
  } catch {
    return emptyLocalState
  }
}

export function useLocalTripState() {
  const [state, setState] = useState<LocalTripState>(readLocalState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const patch = useCallback((next: Partial<LocalTripState>) => {
    setState((current) => ({ ...current, ...next }))
  }, [])

  const exportState = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'southern-italy-private-state.json'
    link.click()
    URL.revokeObjectURL(link.href)
  }, [state])

  const importState = useCallback((text: string) => {
    const parsed = JSON.parse(text) as LocalTripState
    if (parsed.version !== 1) throw new Error('This backup uses an unsupported version.')
    setState({ ...emptyLocalState, ...parsed })
  }, [])

  const reset = useCallback(() => setState(emptyLocalState), [])

  return { state, setState, patch, exportState, importState, reset }
}
