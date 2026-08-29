import { useEffect, useState } from 'react'
import type { ItineraryDay } from '../data/types'
import { getForecast, type ForecastResult } from '../lib/weather'

const coordinates: Record<string, [number, number]> = {
  Naples: [40.8518, 14.2681],
  'Naples Airport': [40.886, 14.2908],
  'Polignano a Mare': [40.9952, 17.2207],
  Lecce: [40.3515, 18.175],
  Matera: [40.6664, 16.6043],
}

export function WeatherPanel({ day }: { day: ItineraryDay }) {
  const [result, setResult] = useState<ForecastResult>({ status: 'seasonal', seasonal: day.weather })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const [latitude, longitude] = coordinates[day.base] ?? coordinates.Naples
    void getForecast(day.date, latitude, longitude, day.weather).then((next) => {
      if (active) setResult(next)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [day])

  const forecast = result.forecast
  const label = result.status === 'live'
    ? 'Live forecast'
    : result.status === 'cached'
      ? 'Cached forecast'
      : 'Seasonal September estimate'

  return (
    <section className="weather-card" aria-labelledby={`weather-${day.id}`}>
      <div className="card-heading">
        <span className="section-number" aria-hidden="true">W</span>
        <div><p className="eyebrow">Weather window</p><h2 id={`weather-${day.id}`}>{label}</h2></div>
      </div>
      {loading && <div className="weather-loading" role="status"><span className="skeleton skeleton-line" /><span>Checking live weather</span></div>}
      <div className="weather-readout">
        <strong>{Math.round(forecast?.highC ?? day.weather.highC)}°</strong>
        <span>/ {Math.round(forecast?.lowC ?? day.weather.lowC)}°C</span>
      </div>
      <p>{forecast ? `Rain up to ${forecast.rainProbability}% · winds up to ${Math.round(forecast.windKph)} km/h.` : day.weather.summary}</p>
      <ul className="mini-stats">
        <li><strong>Range</strong><span>High and low</span></li>
        <li><strong>Water</strong><span>{day.weather.seaC ? `Sea about ${day.weather.seaC}°C` : day.weather.rainRisk}</span></li>
        <li><strong>Beach</strong><span>Check wind before leaving</span></li>
      </ul>
      <small>{result.fetchedAt ? `Updated ${new Date(result.fetchedAt).toLocaleString()}. ` : ''}Forecast data: Open-Meteo. Seasonal fallback remains available offline.</small>
    </section>
  )
}
