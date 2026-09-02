import { locations, lodging, timelinePlaceRefs, venues } from '../data/trip'
import type { TimelineItem, TimelinePlaceRef, TripLocationLink } from '../data/types'

export interface TimelinePlaceDisplay {
  label: string
  name: string
  address: string
  checkedOn: string
  note?: string
  links: TripLocationLink[]
}

export function placeRefForTimelineItem(item: TimelineItem): TimelinePlaceRef | undefined {
  const explicit = timelinePlaceRefs[item.id]
  if (explicit) return explicit
  if (item.venueId) return `venue:${item.venueId}`

  const stay = lodging.find((candidate) => item.bookingId === `booking-${candidate.id}`)
  if (stay) return `lodging:${stay.id}`
  return undefined
}

export function placeForTimelineItem(item: TimelineItem): TimelinePlaceDisplay | undefined {
  const ref = placeRefForTimelineItem(item)
  if (!ref) return undefined
  const separator = ref.indexOf(':')
  const kind = ref.slice(0, separator)
  const id = ref.slice(separator + 1)

  if (kind === 'location') {
    const location = locations.find((candidate) => candidate.id === id)
    if (!location) return undefined
    return {
      label: location.label,
      name: location.name,
      address: location.address,
      checkedOn: location.checkedOn,
      note: location.note,
      links: [
        { label: location.label === 'Route' ? 'Open route' : 'Open in Google Maps', url: location.mapsUrl },
        ...(location.links ?? []),
      ],
    }
  }

  if (kind === 'lodging') {
    const stay = lodging.find((candidate) => candidate.id === id)
    if (!stay) return undefined
    return {
      label: 'Stay address',
      name: stay.name,
      address: stay.address,
      checkedOn: stay.addressVerifiedOn,
      note: 'This stay is not reserved. Use the booking link to check the same property and exact dates.',
      links: [
        { label: 'Open in Google Maps', url: stay.mapsUrl },
        { label: 'Open Booking.com', url: stay.bookingUrl },
      ],
    }
  }

  const venue = venues.find((candidate) => candidate.id === id)
  if (!venue) return undefined
  return {
    label: venue.addressLabel ?? 'Area',
    name: venue.name,
    address: venue.address ?? `${venue.city}, Italy`,
    checkedOn: venue.addressVerifiedOn ?? venue.ratingVerifiedOn,
    note: venue.tags.includes('closed-needs-replacement') ? venue.priceNote : undefined,
    links: [{ label: 'Open in Google Maps', url: venue.mapsUrl }],
  }
}
