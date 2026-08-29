import type { PlanningStatus } from '../data/types'

const labels: Record<PlanningStatus, string> = {
  booked: 'Confirmed',
  confirmed: 'Confirmed',
  planned: 'Planned',
  shortlisted: 'Live quote',
  'inquiry-sent': 'Requested',
  'needs-booking': 'Needs booking',
  'needs-verification': 'Verify live',
  'weather-dependent': 'Weather dependent',
  'time-unknown': 'Time pending',
  optional: 'Optional',
}

export function StatusBadge({ status }: { status: PlanningStatus }) {
  return <span className={`badge badge-${status}`}>{labels[status]}</span>
}
