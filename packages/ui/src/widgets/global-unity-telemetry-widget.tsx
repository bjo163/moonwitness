"use client"

import { useState, useEffect } from "react"
import { Signal } from "lucide-react"

const INITIAL_UNITY_INDEX = 99.8
const INITIAL_PRAYERS_COUNT = 142850
const BASE_UNITY_INDEX = 99.5
const UNITY_VARIATION_RANGE = 0.4
const MAX_NEW_PRAYERS_STEP = 5
const TELEMETRY_POLLING_INTERVAL_MS = 3000

export function GlobalUnityTelemetryWidget() {
  const [unityIndex, setUnityIndex] = useState(INITIAL_UNITY_INDEX)
  const [prayersCount, setPrayersCount] = useState(INITIAL_PRAYERS_COUNT)

  useEffect(() => {
    const timer = setInterval(() => {
      setUnityIndex(
        () =>
          +(BASE_UNITY_INDEX + Math.random() * UNITY_VARIATION_RANGE).toFixed(2)
      )
      setPrayersCount(
        (prev) => prev + Math.floor(Math.random() * MAX_NEW_PRAYERS_STEP) + 1
      )
    }, TELEMETRY_POLLING_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-1.5 font-mono">
      <div className="rounded-md text-success border-success/50 bg-success/10 flex items-center gap-1 border px-2 py-0.5 text-[8px] font-bold">
        <Signal className="text-success h-3 w-3 animate-pulse" />
        <span>[ UNITY SIGNAL: {unityIndex}% ]</span>
        <span className="text-primary">
          ({prayersCount.toLocaleString("en-US")} PRAYERS)
        </span>
      </div>
    </div>
  )
}
