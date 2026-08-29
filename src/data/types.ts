export type ISODate = `${number}-${number}-${number}`
export type ClockTime = `${number}:${number}`
export type TimelineTime = ClockTime | 'TBD'
export type Currency = 'EUR'

export type PlanningStatus =
  | 'booked'
  | 'confirmed'
  | 'planned'
  | 'shortlisted'
  | 'inquiry-sent'
  | 'needs-booking'
  | 'needs-verification'
  | 'weather-dependent'
  | 'time-unknown'
  | 'optional'

export type Confidence = 'high' | 'medium' | 'low'

export interface Source {
  id: string
  title: string
  publisher: string
  url: string
  kind:
    | 'official'
    | 'astronomy'
    | 'climate-normal'
    | 'routing-baseline'
    | 'local-guidance'
    | 'rating-evidence'
    | 'booking-search'
  accessedOn: ISODate
  confidence: Confidence
  note?: string
}

export interface SunWindow {
  sunrise: ClockTime
  sunset: ClockTime
  sourceIds: string[]
  note: string
}

export interface WeatherExpectation {
  kind: 'seasonal-expectation'
  highC: number
  lowC: number
  seaC?: number
  rainRisk: string
  summary: string
  packing: string[]
  sourceIds: string[]
  confidence: Confidence
  liveForecastAvailableFrom: ISODate
}

export interface CashGuidance {
  recommendedCarryEur: number
  intendedFor: string[]
  cardStrategy: string
  note: string
}

export interface TrafficExpectation {
  level: 'low' | 'moderate' | 'high' | 'variable'
  likelyDelayMinutes: [number, number]
  explanation: string
  liveCheckRequired: boolean
}

export interface DrivingPlan {
  required: boolean
  mode: 'none' | 'rental-car' | 'taxi-or-transfer' | 'walk-and-transit'
  route?: string
  distanceKm?: number
  baselineMinutes?: number
  plannedMinutes?: number
  departAt?: ClockTime
  arriveBy?: ClockTime
  traffic?: TrafficExpectation
  parking?: string
  tolls?: string
  sourceIds?: string[]
  note: string
}

export interface FallbackPlan {
  trigger: string
  title: string
  plan: string
  costImpact: string
  venueIds?: string[]
}

export type TimelineKind =
  | 'flight'
  | 'transfer'
  | 'meal'
  | 'check-in'
  | 'check-out'
  | 'activity'
  | 'beach'
  | 'shopping'
  | 'sunset'
  | 'rest'
  | 'decision'

export interface TimelineItem {
  id: string
  time: TimelineTime
  endTime?: ClockTime
  title: string
  detail: string
  kind: TimelineKind
  status: PlanningStatus
  timeZone?: 'Asia/Jerusalem' | 'Europe/Rome'
  dayOffset?: 0 | 1
  allowsOverlap?: boolean
  venueId?: string
  costEurForTwo?: number
  priceStatus?: 'confirmed' | 'estimate' | 'from' | 'included'
  bookingId?: string
}

export interface ItineraryDay {
  id: string
  dayNumber: number
  date: ISODate
  weekday: string
  base: string
  title: string
  subtitle: string
  overnightLodgingId: string
  timeline: TimelineItem[]
  sun: SunWindow
  weather: WeatherExpectation
  cash: CashGuidance
  driving: DrivingPlan
  fallbacks: FallbackPlan[]
  featuredVenueIds: string[]
  practicalNotes: string[]
}

export type VenueKind =
  | 'attraction'
  | 'restaurant'
  | 'cafe'
  | 'beach'
  | 'viewpoint'
  | 'museum'
  | 'shopping'

export interface Venue {
  id: string
  name: string
  city: string
  kind: VenueKind
  rating: number | null
  reviewCount: number | null
  reviewCountApproximate?: boolean
  ratingVerifiedOn: ISODate
  qualification: 'threshold-qualified' | 'editor-exception'
  editorExceptionReason?: string
  mapsUrl: string
  evidenceUrl: string
  sourceIds: string[]
  priceBand?: 'free' | '€' | '€€' | '€€€'
  priceNote?: string
  localAngle: string
  tags: string[]
}

export interface LodgingOption {
  id: string
  name: string
  city: string
  checkIn: ISODate
  checkOut: ISODate
  nights: number
  status: PlanningStatus
  totalEstimateEur: number
  priceStatus: 'live-price-required' | 'estimate' | 'confirmed'
  bookingUrl: string
  bookingSourceId: string
  roomStyle: string
  parkingPlan: string
  notes: string[]
}

export type BookingKind =
  | 'flight'
  | 'lodging'
  | 'car'
  | 'activity'
  | 'restaurant'
  | 'transfer'

export interface BookingItem {
  id: string
  kind: BookingKind
  title: string
  date: ISODate
  endDate?: ISODate
  status: PlanningStatus
  priceEurForTwo?: number
  priceStatus?: 'confirmed' | 'estimate' | 'from' | 'target' | 'excluded'
  sourceUrl?: string
  sourceIds?: string[]
  action: string
  deadline: string
  cancellation?: string
  notes: string[]
}

export interface CarPlan {
  bookingId: string
  pickupLocation: string
  pickupAt: `${ISODate}T${ClockTime}`
  returnLocation: string
  returnAt: `${ISODate}T${ClockTime}`
  class: string
  transmission: 'automatic'
  luggageFit: string
  supplier: string
  basePriceEur: number
  protectedBudgetEur: number
  priceStatus: 'shortlist-price-needs-checkout-verification'
  depositEur: number | null
  excessEur: number | null
  fuelPolicy: string
  mileage: string
  requirements: string[]
  alternatives: Array<{
    model: string
    supplier: string
    basePriceEur: number
    note: string
  }>
}

export interface BudgetCategory {
  id: string
  label: string
  amountEur: number
  status: 'planned' | 'estimate' | 'reserve' | 'excluded'
  note: string
}

export interface Trip {
  id: string
  title: string
  subtitle: string
  startDate: ISODate
  endDate: ISODate
  nights: number
  travelerCount: 2
  travelers: Array<{
    displayName: string
    ageDuringTrip: number
    birthday?: ISODate
  }>
  timeZone: 'Europe/Rome'
  dataAsOf: ISODate
  route: string[]
  budgetCapEur: number
  budgetPlannedEur: number
  budgetBufferEur: number
  budgetExcludes: string[]
  budgetNote: string
  car: CarPlan
  sources: Source[]
  globalNotes: string[]
}

export interface ValidationIssue {
  severity: 'error' | 'warning'
  code: string
  message: string
  path?: string
}

export interface ValidationResult {
  valid: boolean
  issues: ValidationIssue[]
}
