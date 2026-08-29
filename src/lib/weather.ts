import type { ISODate, WeatherExpectation } from '../data/types'

export interface ForecastDay {
  date: ISODate
  highC: number
  lowC: number
  rainProbability: number
  windKph: number
  weatherCode: number
}

export interface ForecastResult {
  status: 'live' | 'cached' | 'seasonal'
  fetchedAt?: string
  forecast?: ForecastDay
  seasonal: WeatherExpectation
}

interface CacheEntry {
  fetchedAt: string
  days: ForecastDay[]
}

const THREE_HOURS = 3 * 60 * 60 * 1000

function cacheKey(latitude: number, longitude: number) {
  return `southern-italy-2026:forecast:${latitude.toFixed(2)}:${longitude.toFixed(2)}`
}

function isWithinForecastWindow(date: ISODate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${date}T12:00:00Z`)
  const days = Math.floor((target.getTime() - today.getTime()) / 86_400_000)
  return days >= 0 && days <= 16
}

export async function getForecast(
  date: ISODate,
  latitude: number,
  longitude: number,
  seasonal: WeatherExpectation,
): Promise<ForecastResult> {
  if (!isWithinForecastWindow(date)) return { status: 'seasonal', seasonal }

  const key = cacheKey(latitude, longitude)
  const cached = localStorage.getItem(key)
  let cache: CacheEntry | undefined
  try {
    cache = cached ? (JSON.parse(cached) as CacheEntry) : undefined
  } catch {
    localStorage.removeItem(key)
  }

  if (cache && Date.now() - new Date(cache.fetchedAt).getTime() < THREE_HOURS) {
    return {
      status: 'cached',
      fetchedAt: cache.fetchedAt,
      forecast: cache.days.find((day) => day.date === date),
      seasonal,
    }
  }

  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
      timezone: 'Europe/Rome',
      forecast_days: '16',
    })
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
    if (!response.ok) throw new Error(`Forecast request failed: ${response.status}`)
    const json = await response.json() as {
      daily: {
        time: ISODate[]
        weather_code: number[]
        temperature_2m_max: number[]
        temperature_2m_min: number[]
        precipitation_probability_max: number[]
        wind_speed_10m_max: number[]
      }
    }
    const days = json.daily.time.map((day, index) => ({
      date: day,
      highC: json.daily.temperature_2m_max[index],
      lowC: json.daily.temperature_2m_min[index],
      rainProbability: json.daily.precipitation_probability_max[index],
      windKph: json.daily.wind_speed_10m_max[index],
      weatherCode: json.daily.weather_code[index],
    }))
    const fetchedAt = new Date().toISOString()
    localStorage.setItem(key, JSON.stringify({ fetchedAt, days } satisfies CacheEntry))
    return { status: 'live', fetchedAt, forecast: days.find((day) => day.date === date), seasonal }
  } catch {
    if (cache) {
      return {
        status: 'cached',
        fetchedAt: cache.fetchedAt,
        forecast: cache.days.find((day) => day.date === date),
        seasonal,
      }
    }
    return { status: 'seasonal', seasonal }
  }
}
