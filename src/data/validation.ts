import { bookings, budgetCategories, days, lodging, trip, venues } from './trip'
import type { TimelineItem, ValidationIssue, ValidationResult } from './types'

const DAY_MS = 86_400_000
const clockPattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/

const addIssue = (
  issues: ValidationIssue[],
  severity: ValidationIssue['severity'],
  code: string,
  message: string,
  path?: string,
) => issues.push({ severity, code, message, path })

const utcDay = (date: string): number => {
  const parsed = Date.parse(`${date}T00:00:00Z`)
  return Number.isNaN(parsed) ? Number.NaN : Math.floor(parsed / DAY_MS)
}

const timelineMinute = (item: TimelineItem): number | null => {
  if (item.time === 'TBD') return null
  const [hours = 0, minutes = 0] = item.time.split(':').map(Number)
  return hours * 60 + minutes + (item.dayOffset ?? 0) * 24 * 60
}

const timelineEndMinute = (item: TimelineItem): number | null => {
  if (!item.endTime) return null
  const [hours = 0, minutes = 0] = item.endTime.split(':').map(Number)
  return hours * 60 + minutes + (item.dayOffset ?? 0) * 24 * 60
}

const daysSince = (date: string): number =>
  Math.floor((Date.now() - Date.parse(`${date}T23:59:59Z`)) / DAY_MS)

const findDuplicates = (values: string[]): string[] =>
  values.filter((value, index) => values.indexOf(value) !== index)

export const validateTripData = (): ValidationResult => {
  const issues: ValidationIssue[] = []
  const sourceIds = new Set(trip.sources.map((source) => source.id))
  const venueIds = new Set(venues.map((venue) => venue.id))
  const lodgingIds = new Set(lodging.map((stay) => stay.id))
  const bookingIds = new Set(bookings.map((booking) => booking.id))

  const duplicateSources = findDuplicates(trip.sources.map((source) => source.id))
  const duplicateVenues = findDuplicates(venues.map((venue) => venue.id))
  const duplicateLodging = findDuplicates(lodging.map((stay) => stay.id))
  const duplicateBookings = findDuplicates(bookings.map((booking) => booking.id))
  const duplicateDays = findDuplicates(days.map((day) => day.id))
  const duplicateTimeline = findDuplicates(days.flatMap((day) => day.timeline.map((item) => item.id)))

  for (const [label, duplicates] of [
    ['source', duplicateSources],
    ['venue', duplicateVenues],
    ['lodging', duplicateLodging],
    ['booking', duplicateBookings],
    ['day', duplicateDays],
    ['timeline', duplicateTimeline],
  ] as const) {
    if (duplicates.length > 0) {
      addIssue(issues, 'error', 'duplicate-id', `Duplicate ${label} IDs: ${[...new Set(duplicates)].join(', ')}`)
    }
  }

  if (days.length !== 13) {
    addIssue(issues, 'error', 'day-count', `Expected 13 itinerary days; found ${days.length}.`, 'days')
  }

  days.forEach((day, index) => {
    const expectedDay = utcDay(trip.startDate) + index
    if (utcDay(day.date) !== expectedDay) {
      addIssue(issues, 'error', 'date-continuity', `Day ${index + 1} is not contiguous from ${trip.startDate}.`, `days[${index}].date`)
    }
    if (day.dayNumber !== index + 1) {
      addIssue(issues, 'error', 'day-number', `Expected dayNumber ${index + 1}; found ${day.dayNumber}.`, `days[${index}].dayNumber`)
    }
    if (!lodgingIds.has(day.overnightLodgingId)) {
      addIssue(issues, 'error', 'missing-lodging-reference', `Unknown lodging ${day.overnightLodgingId}.`, `days[${index}].overnightLodgingId`)
    }
    if (!clockPattern.test(day.sun.sunrise) || !clockPattern.test(day.sun.sunset)) {
      addIssue(issues, 'error', 'invalid-sun-time', 'Sunrise and sunset must use 24-hour HH:MM.', `days[${index}].sun`)
    }
    if (day.weather.kind !== 'seasonal-expectation') {
      addIssue(issues, 'error', 'weather-mislabel', 'Pre-trip weather must remain labeled as a seasonal expectation.', `days[${index}].weather.kind`)
    }
    if (!day.cash.note.toLowerCase().includes('within the trip budget') || !day.cash.note.toLowerCase().includes('not an additional')) {
      addIssue(issues, 'error', 'cash-budget-label', 'Daily cash must explicitly say it is within, not additional to, the trip budget.', `days[${index}].cash.note`)
    }
    if (!day.driving.note.trim()) {
      addIssue(issues, 'error', 'missing-driving-decision', 'Every day needs an explicit driving note.', `days[${index}].driving.note`)
    }
    if (day.fallbacks.length === 0) {
      addIssue(issues, 'error', 'missing-fallback', 'Every day needs at least one fallback plan.', `days[${index}].fallbacks`)
    }

    const lastMinute = day.timeline.reduce<number>((previous, item, timelineIndex) => {
      if (item.time === 'TBD') {
        if (item.status !== 'time-unknown') {
          addIssue(issues, 'error', 'untyped-tbd', 'TBD timeline items must use status time-unknown.', `days[${index}].timeline[${timelineIndex}]`)
        }
        return previous
      }
      if (!clockPattern.test(item.time)) {
        addIssue(issues, 'error', 'invalid-timeline-time', `Invalid time ${item.time}.`, `days[${index}].timeline[${timelineIndex}].time`)
      }
      if (item.endTime && !clockPattern.test(item.endTime)) {
        addIssue(issues, 'error', 'invalid-timeline-end', `Invalid end time ${item.endTime}.`, `days[${index}].timeline[${timelineIndex}].endTime`)
      }
      const minute = timelineMinute(item) ?? previous
      if (minute < previous) {
        addIssue(issues, 'error', 'timeline-order', `${item.id} appears before the previous timed item.`, `days[${index}].timeline[${timelineIndex}]`)
      }
      const precedingItem = day.timeline[timelineIndex - 1]
      const precedingEnd = precedingItem ? timelineEndMinute(precedingItem) : null
      if (precedingEnd !== null && minute < precedingEnd && !precedingItem?.allowsOverlap) {
        addIssue(issues, 'error', 'timeline-overlap', `${item.id} starts before ${precedingItem.id} ends.`, `days[${index}].timeline[${timelineIndex}]`)
      }
      if (item.venueId && !venueIds.has(item.venueId)) {
        addIssue(issues, 'error', 'missing-venue-reference', `Unknown venue ${item.venueId}.`, `days[${index}].timeline[${timelineIndex}].venueId`)
      }
      if (item.bookingId && !bookingIds.has(item.bookingId)) {
        addIssue(issues, 'error', 'missing-booking-reference', `Unknown booking ${item.bookingId}.`, `days[${index}].timeline[${timelineIndex}].bookingId`)
      }
      return Math.max(previous, minute)
    }, -1)
    void lastMinute

    for (const venueId of day.featuredVenueIds) {
      if (!venueIds.has(venueId)) {
        addIssue(issues, 'error', 'missing-featured-venue', `Unknown featured venue ${venueId}.`, `days[${index}].featuredVenueIds`)
      }
    }
    for (const sourceId of [...day.sun.sourceIds, ...day.weather.sourceIds, ...(day.driving.sourceIds ?? [])]) {
      if (!sourceIds.has(sourceId)) {
        addIssue(issues, 'error', 'missing-source-reference', `Unknown source ${sourceId}.`, `days[${index}]`)
      }
    }
  })

  if (days[0]?.date !== trip.startDate || days.at(-1)?.date !== trip.endDate) {
    addIssue(issues, 'error', 'trip-boundaries', 'First and last itinerary dates must match trip boundaries.', 'trip')
  }

  lodging.forEach((stay, index) => {
    const calculatedNights = utcDay(stay.checkOut) - utcDay(stay.checkIn)
    if (calculatedNights !== stay.nights) {
      addIssue(issues, 'error', 'lodging-night-count', `${stay.name} has ${stay.nights} nights but dates span ${calculatedNights}.`, `lodging[${index}]`)
    }
    if (!sourceIds.has(stay.bookingSourceId)) {
      addIssue(issues, 'error', 'missing-lodging-source', `Unknown booking source ${stay.bookingSourceId}.`, `lodging[${index}].bookingSourceId`)
    }
    if (!stay.bookingUrl.startsWith('https://')) {
      addIssue(issues, 'error', 'unsafe-booking-url', `${stay.name} booking URL must use HTTPS.`, `lodging[${index}].bookingUrl`)
    }
    if (stay.nightlyEquivalentEur >= 200) {
      addIssue(issues, 'error', 'lodging-nightly-cap', `${stay.name} is not below the €200 nightly cap.`, `lodging[${index}].nightlyEquivalentEur`)
    }
    if (Math.abs(stay.totalEstimateEur / stay.nights - stay.nightlyEquivalentEur) > 0.01) {
      addIssue(issues, 'error', 'lodging-nightly-math', `${stay.name} has an inconsistent nightly equivalent.`, `lodging[${index}].nightlyEquivalentEur`)
    }
    if (stay.priceStatus === 'live-quote' && !stay.quoteCheckedOn) {
      addIssue(issues, 'error', 'missing-quote-date', `${stay.name} needs a checked date for its live quote.`, `lodging[${index}].quoteCheckedOn`)
    }
    for (const [field, value] of Object.entries({
      quoteDisplay: stay.quoteDisplay,
      taxesAndFees: stay.taxesAndFees,
      cancellationTerms: stay.cancellationTerms,
      paymentTerms: stay.paymentTerms,
      checkInConstraints: stay.checkInConstraints,
      parkingPlan: stay.parkingPlan,
      stairsAndLuggage: stay.stairsAndLuggage,
    })) {
      if (!value.trim()) {
        addIssue(issues, 'error', 'missing-lodging-term', `${stay.name} is missing ${field}.`, `lodging[${index}].${field}`)
      }
    }
  })

  venues.forEach((venue, index) => {
    if (venue.qualification === 'threshold-qualified') {
      if (venue.rating === null || venue.rating < 4.7 || venue.reviewCount === null || venue.reviewCount < 150) {
        addIssue(issues, 'error', 'venue-threshold', `${venue.name} does not meet the 4.7 rating / 150 review threshold.`, `venues[${index}]`)
      }
    } else if (venue.qualification === 'editor-exception') {
      if ((venue.kind === 'restaurant' || venue.kind === 'attraction') || !venue.editorExceptionReason?.trim()) {
        addIssue(issues, 'error', 'invalid-editor-exception', `${venue.name} cannot bypass the strict restaurant/attraction rule or lacks a reason.`, `venues[${index}]`)
      }
      if (!venue.tags.includes('editor-exception')) {
        addIssue(issues, 'error', 'unlabeled-editor-exception', `${venue.name} must carry an editor-exception tag.`, `venues[${index}].tags`)
      }
    } else {
      if (!venue.personalPickReason?.trim() || !venue.visitWindow?.trim()) {
        addIssue(issues, 'error', 'invalid-personal-pick', `${venue.name} needs a personal-pick reason and visit window.`, `venues[${index}]`)
      }
      if (!venue.tags.includes('personal-pick')) {
        addIssue(issues, 'error', 'unlabeled-personal-pick', `${venue.name} must carry a personal-pick tag.`, `venues[${index}].tags`)
      }
      if (venue.rating === null || venue.reviewCount === null) {
        addIssue(issues, 'error', 'unverified-personal-pick', `${venue.name} needs a checked rating and review count.`, `venues[${index}]`)
      }
    }
    if (venue.personalPickReason && (!venue.visitWindow?.trim() || !venue.tags.includes('personal-pick'))) {
      addIssue(issues, 'error', 'incomplete-personal-pick', `${venue.name} needs a visit window and personal-pick tag.`, `venues[${index}]`)
    }
    if (!venue.mapsUrl.startsWith('https://') || !venue.evidenceUrl.startsWith('https://')) {
      addIssue(issues, 'error', 'unsafe-venue-url', `${venue.name} must have HTTPS Maps and evidence URLs.`, `venues[${index}]`)
    }
    for (const sourceId of venue.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        addIssue(issues, 'error', 'missing-venue-source', `Unknown source ${sourceId}.`, `venues[${index}].sourceIds`)
      }
    }
    if (daysSince(venue.ratingVerifiedOn) > 14) {
      addIssue(issues, 'warning', 'stale-rating-check', `${venue.name}'s rating evidence is older than 14 days and should be refreshed.`, `venues[${index}].ratingVerifiedOn`)
    }
  })

  for (const source of trip.sources) {
    if (!source.url.startsWith('https://')) {
      addIssue(issues, 'error', 'unsafe-source-url', `${source.title} must use an HTTPS URL.`, `trip.sources.${source.id}`)
    }
    if (['booking-search', 'rating-evidence'].includes(source.kind) && daysSince(source.accessedOn) > 14) {
      addIssue(issues, 'warning', 'stale-source-check', `${source.title} is time-sensitive and older than 14 days.`, `trip.sources.${source.id}.accessedOn`)
    }
  }

  const spendingTotal = budgetCategories
    .filter((category) => category.status !== 'excluded' && category.status !== 'reserve')
    .reduce((total, category) => total + category.amountEur, 0)
  if (spendingTotal !== trip.budgetPlannedEur) {
    addIssue(issues, 'error', 'budget-sum', `Budget categories total €${spendingTotal}, not trip total €${trip.budgetPlannedEur}.`, 'trip.budgetPlannedEur')
  }
  if (trip.budgetPlannedEur >= trip.budgetCapEur) {
    addIssue(issues, 'error', 'budget-cap', `Planned total €${trip.budgetPlannedEur} is not below the €${trip.budgetCapEur} cap.`, 'trip.budgetPlannedEur')
  }
  if (trip.budgetBufferEur !== trip.budgetCapEur - trip.budgetPlannedEur) {
    addIssue(issues, 'error', 'budget-buffer', 'Stored budget buffer does not equal cap minus planned spend.', 'trip.budgetBufferEur')
  }

  for (const booking of bookings) {
    if (booking.status === 'booked' && booking.kind !== 'flight') {
      addIssue(issues, 'error', 'false-booked-status', `Only confirmed flights may be labeled booked; found ${booking.title}.`, `bookings.${booking.id}`)
    }
    for (const sourceId of booking.sourceIds ?? []) {
      if (!sourceIds.has(sourceId)) {
        addIssue(issues, 'error', 'missing-booking-source', `Unknown source ${sourceId}.`, `bookings.${booking.id}.sourceIds`)
      }
    }
  }

  if (bookings.find((booking) => booking.id === 'flight-tlv-nap')?.status !== 'booked') {
    addIssue(issues, 'error', 'outbound-flight-status', 'Outbound flight must be present and booked.', 'bookings.flight-tlv-nap')
  }
  if (bookings.find((booking) => booking.id === 'flight-nap-tlv')?.status !== 'booked') {
    addIssue(issues, 'error', 'return-flight-status', 'Return flight must be present and booked.', 'bookings.flight-nap-tlv')
  }

  if (!trip.car.deskProcess.trim() || !trip.car.liabilityCover.trim()) {
    addIssue(issues, 'error', 'missing-car-terms', 'The car plan must disclose desk or shuttle and liability status.', 'trip.car')
  }
  if (trip.car.protectedBudgetEur > 370) {
    addIssue(issues, 'error', 'car-budget-cap', 'The protected car budget exceeds €370.', 'trip.car.protectedBudgetEur')
  }

  const serialized = JSON.stringify({ trip, days, venues, lodging, bookings, budgetCategories })
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(serialized)) {
    addIssue(issues, 'error', 'privacy-email', 'Public trip data contains an email address.')
  }
  if (/\b(?:\d[ -]*?){13,19}\b/.test(serialized)) {
    addIssue(issues, 'warning', 'privacy-number-pattern', 'Public trip data contains a long digit sequence that should be reviewed for payment data.')
  }

  return { valid: !issues.some((issue) => issue.severity === 'error'), issues }
}

export const validationResult = validateTripData()

export const assertValidTripData = (): void => {
  const result = validateTripData()
  if (!result.valid) {
    throw new Error(result.issues.map((issue) => `[${issue.code}] ${issue.message}`).join('\n'))
  }
}
