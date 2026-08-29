import { CloudSun, Droplets, ThermometerSun, Wind } from 'lucide-react'
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

  useEffect(() => {
    const [latitude, longitude] = coordinates[day.base] ?? coordinates.Naples
    void getForecast(day.date, latitude, longitude, day.weather).then(setResult)
  }, [day])

  const forecast = result.forecast
  const label = result.status === 'live'
    ? 'Live forecast'
    : result.status === 'cached'
      ? 'Cached forecast'
      : 'Typical September · not a forecast'

  return (
    <section className="weather-card" aria-labelledby={`weather-${day.id}`}>
      <div className="card-heading">
        <span className="icon-disc"><CloudSun aria-hidden="true" /></span>
        <div><p className="eyebrow">Weather window</p><h2 id={`weather-${day.id}`}>{label}</h2></div>
      </div>
      <div className="weather-readout">
        <strong>{Math.round(forecast?.highC ?? day.weather.highC)}°</strong>
        <span>/ {Math.round(forecast?.lowC ?? day.weather.lowC)}°C</span>
      </div>
      <p>{forecast ? `Rain up to ${forecast.rainProbability}% · winds up to ${Math.round(forecast.windKph)} km/h.` : day.weather.summary}</p>
      <ul className="mini-stats">
        <li><ThermometerSun /> High / low</li>
        <li><Droplets /> {day.weather.seaC ? `Sea ~${day.weather.seaC}°C` : day.weather.rainRisk}</li>
        <li><Wind /> Check wind before beaches</li>
      </ul>
      <small>{result.fetchedAt ? `Updated ${new Date(result.fetchedAt).toLocaleString()}. ` : ''}Forecast data: Open-Meteo. Seasonal fallback remains available offline.</small>
    </section>
  )
}
