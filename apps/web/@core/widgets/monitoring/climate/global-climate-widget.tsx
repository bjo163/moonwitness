"use client"

import React, { useEffect, useState } from "react"
import { CloudRain, Wind, Thermometer, CloudLightning } from "lucide-react"

type CityWeather = {
  name: string
  lat: number
  lng: number
  temp: number
  windSpeed: number
  weatherCode: number
}

const CITIES = [
  { name: "JAKARTA", lat: -6.2088, lng: 106.8456 },
  { name: "NEW YORK", lat: 40.7128, lng: -74.0060 },
  { name: "TOKYO", lat: 35.6762, lng: 139.6503 },
  { name: "LONDON", lat: 51.5074, lng: -0.1278 },
  { name: "MAKKAH", lat: 21.3891, lng: 39.8579 }
]

export function GlobalClimateWidget() {
  const [weatherData, setWeatherData] = useState<CityWeather[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchWeather = async () => {
      try {
        const promises = CITIES.map(async (city) => {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true`)
          if (!res.ok) throw new Error("Failed to fetch")
          const data = await res.json()
          return {
            name: city.name,
            lat: city.lat,
            lng: city.lng,
            temp: data.current_weather.temperature,
            windSpeed: data.current_weather.windspeed,
            weatherCode: data.current_weather.weathercode
          }
        })

        const results = await Promise.all(promises)
        if (isMounted) {
          setWeatherData(results)
          setIsLoading(false)
        }
      } catch (e) {
        console.error("Failed to fetch weather", e)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 600000) // update every 10 min

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="bg-space border-sky-500/30 flex flex-col rounded-xl border p-4 lg:col-span-12 xl:col-span-4 h-full">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="text-[10px] font-black tracking-widest text-sky-400 uppercase flex items-center gap-2">
          <CloudLightning className="h-4 w-4" />
          GLOBAL CLIMATE
          <span className="bg-sky-400/20 text-sky-400 px-1.5 py-0.5 rounded-[2px] text-[8px] border border-sky-400/50">LIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 text-[8px] font-bold text-white/50 tracking-widest mb-2 border-b border-white/5 pb-2">
          <div className="col-span-4">METROPOLIS</div>
          <div className="col-span-4 text-center">TEMP</div>
          <div className="col-span-4 text-right">WIND</div>
        </div>

        <div className="hide-scrollbar flex flex-col space-y-1 h-[250px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-sky-400/50 text-[10px] py-10 font-mono flex flex-col items-center gap-2">
              <CloudRain className="h-6 w-6 animate-pulse" />
              Syncing with weather satellites...
            </div>
          ) : (
            weatherData.map((w, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-4 text-[9px] items-center py-2 px-2 bg-white/5 hover:bg-white/10 border border-transparent hover:border-sky-500/30 rounded transition-colors group"
              >
                <div className="col-span-4 font-bold text-white group-hover:text-sky-400 transition-colors">
                  {w.name}
                </div>
                <div className="col-span-4 text-center font-mono">
                  <span className={`px-2 py-0.5 font-black rounded-sm ${w.temp > 30 ? 'text-red-400' : w.temp < 15 ? 'text-blue-400' : 'text-green-400'}`}>
                    {w.temp}°C
                  </span>
                </div>
                <div className="col-span-4 text-right font-mono text-white/70 flex items-center justify-end gap-1">
                  <Wind className="h-3 w-3" />
                  {w.windSpeed} km/h
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
