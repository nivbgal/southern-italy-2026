import type { Venue } from '../data/types'

export function venueBadge(venue: Venue) {
  if (venue.personalPickReason) return 'Rinat’s pick'
  if (venue.qualification === 'editor-exception') return 'Editor exception'
  return '4.7+ verified'
}
