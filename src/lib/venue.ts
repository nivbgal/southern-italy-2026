import type { Venue } from '../data/types'

export function venueCheckDate(venue: Venue) {
  const [year, month, day] = venue.ratingVerifiedOn.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`
}

export function venueRatingLabel(venue: Venue) {
  const checked = `Checked ${venueCheckDate(venue)}`
  if (venue.rating === null || venue.reviewCount === null) return `No place rating listed · ${checked}`
  return `Rating ${venue.rating} / 5 · ${venue.reviewCount.toLocaleString()} reviews · ${checked}`
}

export function venueBadge(venue: Venue) {
  if (venue.personalPickReason) return 'Rinat’s pick'
  if (venue.qualification === 'editor-exception') return 'Editor exception'
  return '4.7+ verified'
}
