"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia(query)
    const initTimer = setTimeout(() => {
      setMatches(mediaQuery.matches)
    }, 0)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler)
      return () => {
        clearTimeout(initTimer)
        mediaQuery.removeEventListener("change", handler)
      }
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler)
      return () => {
        clearTimeout(initTimer)
        mediaQuery.removeListener(handler)
      }
    }

    return () => clearTimeout(initTimer)
  }, [query])

  return matches
}
