"use client"

import React, { useEffect, useState } from "react"
import { CloudRain, Wind, Thermometer, CloudLightning } from "lucide-react"
import { apiGet } from "@moon/client"

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
  { name: "NEW YORK", lat: 40.7128, lng: -74.006 },
  { name: "TOKYO", lat: 35.6762, lng: 139.6503 },
  { name: "LONDON", lat: 51.5074, lng: -0.1278 },
  { name: "MAKKAH", lat: 21.3891, lng: 39.8579 },
]

export function GlobalClimateWidget() {
  const [weatherData, setWeatherData] = useState<CityWeather[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchWeather = async () => {
      try {
        const results = await Promise.all(
          CITIES.map(async (city) => {
            try {
              const data = await apiGet<any>(
                `/api/external/weather?latitude=${city.lat}&longitude=${city.lng}&current_weather=true`
              )
              return {
                name: city.name,
                lat: city.lat,
                lng: city.lng,
                temp: data?.current_weather?.temperature ?? 25,
                windSpeed: data?.current_weather?.windspeed ?? 10,
                weatherCode: data?.current_weather?.weathercode ?? 0,
              }
            } catch {
              return {
                name: city.name,
                lat: city.lat,
                lng: city.lng,
                temp: 25,
                windSpeed: 10,
                weatherCode: 0,
              }
            }
          })
        )
        if (isMounted) {
          setWeatherData(results)
          setIsLoading(false)
        }
      } catch (e) {
        console.error("Failed to fetch weather", e)
        if (isMounted) setIsLoading(false)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 600000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="bg-space flex h-full flex-col rounded-xl border border-sky-500/30 p-4 lg:col-span-12 xl:col-span-4">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-sky-400 uppercase">
          <CloudLightning className="h-4 w-4" />
          GLOBAL CLIMATE
          <span className="rounded-[2px] border border-sky-400/50 bg-sky-400/20 px-1.5 py-0.5 text-[8px] text-sky-400">
            LIVE
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="mb-2 grid grid-cols-12 gap-4 border-b border-white/5 pb-2 text-[8px] font-bold tracking-widest text-white/50">
          <div className="col-span-4">METROPOLIS</div>
          <div className="col-span-4 text-center">TEMP</div>
          <div className="col-span-4 text-right">WIND</div>
        </div>

        <div className="hide-scrollbar flex h-[250px] flex-col space-y-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center font-mono text-[10px] text-sky-400/50">
              <CloudRain className="h-6 w-6 animate-pulse" />
              Syncing with weather satellites...
            </div>
          ) : (
            weatherData.map((w, idx) => (
              <div
                key={idx}
                className="group grid grid-cols-12 items-center gap-4 rounded border border-transparent bg-white/5 px-2 py-2 text-[9px] transition-colors hover:border-sky-500/30 hover:bg-white/10"
              >
                <div className="col-span-4 font-bold text-white transition-colors group-hover:text-sky-400">
                  {w.name}
                </div>
                <div className="col-span-4 text-center font-mono">
                  <span
                    className={`rounded-sm px-2 py-0.5 font-black ${w.temp > 30 ? "text-red-400" : w.temp < 15 ? "text-blue-400" : "text-green-400"}`}
                  >
                    {w.temp}°C
                  </span>
                </div>
                <div className="col-span-4 flex items-center justify-end gap-1 text-right font-mono text-white/70">
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
