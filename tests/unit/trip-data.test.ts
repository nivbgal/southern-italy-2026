import { describe, expect, it } from 'vitest'
import {
  bookings,
  budgetCategories,
  days,
  lodging,
  trip,
  venues,
} from '../../src/data/trip'
import { validateTripData } from '../../src/data/validation'

const expectedDates = Array.from(
  { length: 13 },
  (_, index) => `2026-09-${String(index + 14).padStart(2, '0')}`,
)

describe('trip content integrity', () => {
  it('passes the canonical data validator without errors', () => {
    const result = validateTripData()
    expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([])
    expect(result.valid).toBe(true)
  })

  it('covers every calendar date exactly once in chronological order', () => {
    expect(days.map((day) => day.date)).toEqual(expectedDates)
    expect(new Set(days.map((day) => day.date)).size).toBe(expectedDates.length)
    expect(days.map((day) => day.dayNumber)).toEqual(
      Array.from({ length: expectedDates.length }, (_, index) => index + 1),
    )
  })

  it('preserves the corrected flight facts and explicit time zones', () => {
    const outbound = days
      .flatMap((day) => day.timeline)
      .find((item) => item.bookingId === 'flight-tlv-nap' && item.time === '20:20')
    const returnFlight = days
      .flatMap((day) => day.timeline)
      .find((item) => item.bookingId === 'flight-nap-tlv')

    expect(outbound).toMatchObject({
      time: '20:20',
      timeZone: 'Asia/Jerusalem',
      kind: 'flight',
    })
    expect(returnFlight).toMatchObject({
      time: '07:00',
      timeZone: 'Europe/Rome',
      kind: 'flight',
    })
  })

  it('keeps the accepted route and 12 continuous lodging nights', () => {
    expect(trip.route).toEqual(['Naples Airport', 'Polignano a Mare', 'Lecce', 'Matera', 'Naples'])
    expect(trip.nights).toBe(12)
    expect(lodging.reduce((total, stay) => total + stay.nights, 0)).toBe(12)

    const ordered = [...lodging].sort((left, right) => left.checkIn.localeCompare(right.checkIn))
    expect(ordered.at(0)?.checkIn).toBe('2026-09-14')
    expect(ordered.at(-1)?.checkOut).toBe('2026-09-26')
    ordered.slice(1).forEach((stay, index) => {
      expect(stay.checkIn).toBe(ordered[index].checkOut)
    })
  })

  it('keeps every checked lodging quote below the nightly cap with visible terms', () => {
    for (const stay of lodging) {
      expect(stay.priceStatus, stay.name).toBe('live-quote')
      expect(stay.quoteCheckedOn, stay.name).toBe('2026-08-29')
      expect(stay.nightlyEquivalentEur, stay.name).toBeLessThan(200)
      expect(stay.totalEstimateEur / stay.nights, stay.name).toBeCloseTo(stay.nightlyEquivalentEur, 2)
      expect(stay.taxesAndFees, stay.name).not.toBe('')
      expect(stay.cancellationTerms, stay.name).not.toBe('')
      expect(stay.paymentTerms, stay.name).not.toBe('')
      expect(stay.checkInConstraints, stay.name).not.toBe('')
      expect(stay.parkingPlan, stay.name).not.toBe('')
      expect(stay.stairsAndLuggage, stay.name).not.toBe('')
    }
  })

  it('keeps strict Maps thresholds for recommended restaurants and attractions', () => {
    const governedVenues = venues.filter((venue) =>
      ['restaurant', 'attraction'].includes(venue.kind) && venue.qualification === 'threshold-qualified',
    )
    expect(governedVenues.length).toBeGreaterThan(0)

    for (const venue of governedVenues) {
      expect(venue.qualification, venue.name).toBe('threshold-qualified')
      expect(venue.rating, venue.name).not.toBeNull()
      expect(venue.rating ?? 0, venue.name).toBeGreaterThanOrEqual(4.7)
      expect(venue.reviewCount, venue.name).not.toBeNull()
      expect(venue.reviewCount ?? 0, venue.name).toBeGreaterThanOrEqual(150)
      expect(venue.mapsUrl, venue.name).toMatch(/^https:\/\/(?:www\.)?google\.[^/]+\/maps|^https:\/\/maps\.app\.goo\.gl\//)
      expect(venue.ratingVerifiedOn, venue.name).toMatch(/^2026-\d{2}-\d{2}$/)
    }

    for (const venue of venues.filter((item) => item.qualification === 'editor-exception')) {
      expect(['restaurant', 'attraction'], venue.name).not.toContain(venue.kind)
      expect(venue.editorExceptionReason, venue.name).toBeTruthy()
    }

    const personalPicks = venues.filter((venue) => venue.personalPickReason)
    expect(personalPicks).toHaveLength(5)
    expect(personalPicks.filter((venue) => (venue.rating ?? 0) < 4.7)).toHaveLength(4)
    for (const venue of personalPicks) {
      expect(venue.tags, venue.name).toContain('personal-pick')
      expect(venue.visitWindow, venue.name).toBeTruthy()
      expect(venue.ratingVerifiedOn, venue.name).toBe('2026-08-29')
      expect(venue.mapsUrl, venue.name).toMatch(/^https:\/\/maps\.app\.goo\.gl\//)
    }
  })

  it('reconciles the two-person trip budget without counting exclusions', () => {
    const included = budgetCategories
      .filter((category) => category.status !== 'excluded' && category.status !== 'reserve')
      .reduce((total, category) => total + category.amountEur, 0)

    expect(included).toBe(trip.budgetPlannedEur)
    expect(trip.budgetBufferEur).toBe(trip.budgetCapEur - trip.budgetPlannedEur)
    expect(trip.budgetPlannedEur).toBeLessThanOrEqual(trip.budgetCapEur)
    expect(trip.budgetCapEur).toBe(3000)
    expect(trip.travelerCount).toBe(2)
    expect(trip.budgetExcludes.length).toBeGreaterThan(0)
  })

  it('treats cash carry guidance as a payment method, not a budget category', () => {
    expect(budgetCategories.some((category) => /cash/i.test(category.id))).toBe(false)
    for (const day of days) {
      expect(day.cash.recommendedCarryEur).toBeGreaterThanOrEqual(0)
      expect(day.cash.note).toMatch(/not (?:an )?additional|within|part of|payment/i)
    }
  })

  it('shows uncertainty instead of marking unpurchased items as booked', () => {
    const booked = bookings.filter((booking) => booking.status === 'booked')
    expect(booked.every((booking) => booking.kind === 'flight')).toBe(true)

    for (const stay of lodging) {
      expect(stay.status).not.toBe('booked')
      expect(stay.priceStatus).not.toBe('confirmed')
    }
    expect(trip.car.priceStatus).toBe('shortlist-price-needs-checkout-verification')
    expect(trip.car.protectedBudgetEur).toBeLessThanOrEqual(370)
    expect(trip.car.deskProcess).toMatch(/not verified|confirm/i)
    expect(trip.car.liabilityCover).toMatch(/not verified|does not replace/i)
  })

  it('defines transport, weather, sun, cash and fallbacks for every day', () => {
    for (const day of days) {
      expect(day.timeline.length, day.date).toBeGreaterThan(0)
      expect(day.sun.sourceIds.length, day.date).toBeGreaterThan(0)
      expect(day.weather.sourceIds.length, day.date).toBeGreaterThan(0)
      expect(day.cash.cardStrategy, day.date).not.toBe('')
      expect(day.driving.note, day.date).not.toBe('')
      expect(day.fallbacks.length, day.date).toBeGreaterThan(0)
      if (day.driving.required) {
        expect(day.driving.plannedMinutes, day.date).toBeGreaterThan(0)
        expect(day.driving.traffic, day.date).toBeDefined()
        expect(day.driving.sourceIds?.length, day.date).toBeGreaterThan(0)
      }
    }
  })
})
