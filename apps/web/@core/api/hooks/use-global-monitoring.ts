import { useState, useEffect } from "react"
import { useMoonStore } from "@core/store/moon-store"

export type EarthquakeFeature = {
  id: string
  properties: {
    mag: number
    place: string
    time: number
    url: string
    sig: number
  }
  geometry: {
    coordinates: [number, number, number] // [longitude, latitude, depth]
  }
}

export type GlobalCityPrayer = {
  city: string
  country: string
  prayerTimes: {
    Fajr: string
    Dhuhr: string
    Asr: string
    Maghrib: string
    Isha: string
  }
  currentPrayer: string
  nextPrayer: string
}

export type ISSPosition = {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: number
}

export type SpaceWeatherEvent = {
  activityID: string
  startTime: string
  note: string
  link: string
}

export type FlightInfo = {
  icao24: string
  callsign: string
  origin_country: string
  longitude: number
  latitude: number
  velocity: number
  true_track: number
  altitude: number
}

export type TrendingTopic = {
  title: string
  traffic: string
  pubDate: string
}

export type CyberAttack = {
  id: string
  source: [number, number] // [lat, lng]
  target: [number, number]
  type: "DDoS" | "Malware" | "Phishing" | "Exploit"
  timestamp: number
}

export type MaritimeShip = {
  id: string
  name: string
  type: "Cargo" | "Tanker" | "Passenger"
  lat: number
  lng: number
  heading: number
  speed: number
  destination: string
}

export function useGlobalMonitoring() {
  const { request } = useMoonStore()
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([])
  const [globalPrayers, setGlobalPrayers] = useState<GlobalCityPrayer[]>([])
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null)
  const [spaceWeather, setSpaceWeather] = useState<SpaceWeatherEvent[]>([])
  const [flights, setFlights] = useState<FlightInfo[]>([])
  const [trends, setTrends] = useState<TrendingTopic[]>([])
  const [cyberAttacks, setCyberAttacks] = useState<CyberAttack[]>([])
  const [ships, setShips] = useState<MaritimeShip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchAllData = async () => {
      try {
        setIsLoading(true)

        // 1. Fetch USGS Earthquakes — via moon api server (cached 5m)
        const usgsPromise = request('GET', '/api/external/usgs/earthquakes')
          .then((data: any) => data.features || [])
          .catch(() => [])

        // 2. Fetch Aladhan
        const cities = [
          { city: "Makkah", country: "Saudi Arabia" },
          { city: "Jakarta", country: "Indonesia" },
          { city: "London", country: "United Kingdom" },
          { city: "New York", country: "United States" },
          { city: "Tokyo", country: "Japan" },
        ]
        const prayerPromises = Promise.all(
          cities.map(async (c) => {
            try {
              const res = await fetch(
                `/api/prayer-times?city=${encodeURIComponent(c.city)}&country=${encodeURIComponent(c.country)}`
              )
              const json = await res.json()
              if (!json.data || !json.data.timings) return null
              return {
                city: c.city,
                country: c.country,
                prayerTimes: json.data.timings,
                currentPrayer: "Checking...",
                nextPrayer: "Checking...",
              }
            } catch (e) {
              return null
            }
          })
        ).then((res) => res.filter(Boolean) as GlobalCityPrayer[])

        // 3. Fetch ISS Tracker — via moon api server (cached 10s)
        const issPromise = request('GET', '/api/external/iss')
          .catch(() => null)

        // 4. Fetch NASA Space Weather DONKI CME — via moon api server (cached 30m)
        const date = new Date()
        date.setDate(date.getDate() - 30)
        const startDate = date.toISOString().split("T")[0]
        const nasaPromise = request('GET', `/api/external/nasa/donki/cme?startDate=${startDate}`)
          .catch(() => [])

        // 5. Fetch OpenSky Flights — via moon api server (cached 1m, fixed EU bbox)
        const openskyPromise = request('GET', '/api/external/opensky')
          .then((data: any) => {
            if (!data.states) return []
            return data.states
              .slice(0, 150)
              .map((s: any) => ({
                icao24: s[0],
                callsign: s[1]?.trim() || "UNKNOWN",
                origin_country: s[2],
                longitude: s[5],
                latitude: s[6],
                altitude: s[7],
                velocity: s[9],
                true_track: s[10],
              }))
              .filter((f: FlightInfo) => f.longitude && f.latitude)
          })
          .catch(() => [])

        // 6. Fetch Humanity Trends (Google Trends via moon api server)
        const trendsPromise = request('GET', '/api/external/trends')
          .then((xmlText: string) => {
            // Lightweight Regex XML parsing since it's a simple, predictable RSS feed
            const items = []
            const itemRegex = /<item>([\s\S]*?)<\/item>/g
            let match

            while ((match = itemRegex.exec(xmlText)) !== null) {
              const itemContent = match[1]
              if (!itemContent) continue

              const titleMatch = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/.exec(
                itemContent
              )
              const trafficMatch =
                /<ht:approx_traffic>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/ht:approx_traffic>/.exec(
                  itemContent
                )
              const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/.exec(itemContent)

              if (titleMatch) {
                items.push({
                  title: titleMatch[1] || "Unknown",
                  traffic: (trafficMatch && trafficMatch[1]) ? trafficMatch[1] : "Unknown",
                  pubDate: (pubDateMatch && pubDateMatch[1]) ? pubDateMatch[1] : "",
                })
              }
            }

            return items.slice(0, 10)
          })
          .catch(() => [])

        const [
          usgsData,
          prayerData,
          issData,
          nasaData,
          openskyData,
          trendsData,
        ] = await Promise.all([
          usgsPromise,
          prayerPromises,
          issPromise,
          nasaPromise,
          openskyPromise,
          trendsPromise,
        ])

        if (isMounted) {
          setEarthquakes(usgsData)
          setGlobalPrayers(prayerData)
          if (issData && !issData.error) setIssPosition(issData)
          setSpaceWeather(Array.isArray(nasaData) ? nasaData.slice(0, 5) : [])
          setFlights(openskyData)
          setTrends(trendsData)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Global Monitoring API Error:", error)
        if (isMounted) setIsLoading(false)
      }
    }

    fetchAllData()
    // Poll every 5 minutes
    const intervalId = setInterval(fetchAllData, 5 * 60 * 1000)

    const issInterval = setInterval(async () => {
      try {
        const issData = await request('GET', '/api/external/iss')
        if (isMounted && issData && !issData.error) setIssPosition(issData)
      } catch (e) {}
    }, 10000)

    // Simulated Cyber Attacks Generator
    const generateCyberAttack = () => {
      const types: CyberAttack["type"][] = [
        "DDoS",
        "Malware",
        "Phishing",
        "Exploit",
      ]
      const randomLat = () => Math.random() * 140 - 70
      const randomLng = () => Math.random() * 360 - 180

      const newAttack: CyberAttack = {
        id: Math.random().toString(36).substr(2, 9),
        source: [randomLat(), randomLng()],
        target: [randomLat(), randomLng()],
        type: types[Math.floor(Math.random() * types.length)] || "DDoS",
        timestamp: Date.now(),
      }

      if (isMounted) {
        setCyberAttacks((prev) => {
          const updated = [newAttack, ...prev]
          // Keep only last 20 attacks to prevent memory leak
          return updated.slice(0, 20)
        })
      }
    }

    // Generate an attack every 1.5 to 4 seconds
    let attackTimer: NodeJS.Timeout
    const scheduleNextAttack = () => {
      attackTimer = setTimeout(
        () => {
          generateCyberAttack()
          scheduleNextAttack()
        },
        Math.random() * 2500 + 1500
      )
    }
    scheduleNextAttack()

    // --- MARITIME SHIP SIMULATION ---
    const MOCK_SHIPS: MaritimeShip[] = Array.from({ length: 40 }).map(
      (_, i) => ({
        id: `ship-${i}`,
        name: `VESSEL-${Math.floor(Math.random() * 9000) + 1000}`,
        type: ["Cargo", "Tanker", "Passenger"][
          Math.floor(Math.random() * 3)
        ] as any,
        // Major shipping lanes: Atlantic, Pacific, Indian Ocean
        lat: Math.random() * 100 - 50, // -50 to 50
        lng: Math.random() * 360 - 180, // -180 to 180
        heading: Math.random() * 360,
        speed: Math.random() * 20 + 10, // 10 to 30 knots
        destination:
          ["Rotterdam", "Singapore", "Shanghai", "Los Angeles", "Dubai"][
            Math.floor(Math.random() * 5)
          ] || "Unknown",
      })
    )

    setShips(MOCK_SHIPS)

    const moveShips = () => {
      setShips((prev) =>
        prev.map((ship) => {
          // Move ship slightly based on heading and speed
          const headingRad = (ship.heading * Math.PI) / 180
          // Speed in knots -> rough lat/lng delta
          const delta = (ship.speed / 3600) * 0.1
          let newLat = ship.lat + Math.cos(headingRad) * delta
          let newLng = ship.lng + Math.sin(headingRad) * delta

          // Wrap around
          if (newLng > 180) newLng -= 360
          if (newLng < -180) newLng += 360
          if (newLat > 90 || newLat < -90) {
            return { ...ship, heading: (ship.heading + 180) % 360 }
          }

          return {
            ...ship,
            lat: newLat,
            lng: newLng,
          }
        })
      )
    }
    const shipInterval = setInterval(moveShips, 2000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
      clearInterval(issInterval)
      clearTimeout(attackTimer)
      clearInterval(shipInterval)
    }
  }, [])

  return {
    earthquakes,
    globalPrayers,
    issPosition,
    spaceWeather,
    flights,
    trends,
    cyberAttacks,
    ships,
    isLoading,
  }
}
