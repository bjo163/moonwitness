import { useState, useEffect } from "react"

interface GeolocationState {
  lat: number | null
  lng: number | null
  loading: boolean
  error: string | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setState({ lat: null, lng: null, loading: false, error: "Geolocation not supported" })
      return
    }

    // Attempt to read from cache first for fast load
    const cachedLoc = localStorage.getItem("mw_last_location")
    if (cachedLoc) {
      try {
        const { lat, lng, timestamp } = JSON.parse(cachedLoc)
        // Use cache if less than 24h old
        if (Date.now() - timestamp < 1000 * 60 * 60 * 24) {
          setState({ lat, lng, loading: false, error: null })
        }
      } catch (e) {}
    }

    const JAKARTA_LAT = -6.2088
    const JAKARTA_LNG = 106.8456

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        localStorage.setItem("mw_last_location", JSON.stringify({ lat, lng, timestamp: Date.now() }))
        setState({ lat, lng, loading: false, error: null })
      },
      (error) => {
        // Fallback to Jakarta if denied or timeout
        setState({ lat: JAKARTA_LAT, lng: JAKARTA_LNG, loading: false, error: error.message })
      },
      { timeout: 5000, enableHighAccuracy: false, maximumAge: 1000 * 60 * 60 }
    )
  }, [])

  return state
}
