import { NextRequest, NextResponse } from "next/server"
import { getSunPosition, getDuhaTime } from "@moon/witness/dist/astronomy/sun-position.js"
import { getDailyPrayerTimes } from "@moon/witness/dist/astronomy/prayer-times.js"

/**
 * GET /api/sun-position?lat=...&lng=...
 * 
 * Returns real-time sun position data and Duha prayer window timing.
 * Uses device geolocation coordinates for accurate calculation.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = parseFloat(searchParams.get("lat") || "-6.2088")
  const lng = parseFloat(searchParams.get("lng") || "106.8456")

  try {
    const now = new Date()

    // 1. Sun Position (altitude, azimuth, declination)
    const sunPosition = getSunPosition(lat, lng, now)

    // 2. Duha Time Window
    const duhaTime = getDuhaTime(lat, lng, now)

    // 3. Prayer context (sunrise & dhuhr for reference)
    const dailyTimes = getDailyPrayerTimes(lat, lng, now)

    const formatTime = (d: Date) =>
      d.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

    const formatTimeShort = (d: Date) =>
      d.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })

    return NextResponse.json({
      timestamp: now.toISOString(),
      coordinates: { lat, lng },
      sunPosition: {
        altitude: sunPosition.altitude,
        azimuth: sunPosition.azimuth,
        declination: sunPosition.declination,
        isAboveHorizon: sunPosition.isAboveHorizon,
        positionLabel: sunPosition.positionLabel,
      },
      duhaTime: {
        isyraq: duhaTime.isyraq.toISOString(),
        isyraqFormatted: formatTimeShort(duhaTime.isyraq),
        zawal: duhaTime.zawal.toISOString(),
        zawalFormatted: formatTimeShort(duhaTime.zawal),
        afdhal: duhaTime.afdhal.toISOString(),
        afdhalFormatted: formatTimeShort(duhaTime.afdhal),
        currentProgress: duhaTime.currentProgress,
        isInDuhaWindow: duhaTime.isInDuhaWindow,
        status: duhaTime.status,
        totalDurationMinutes: duhaTime.totalDurationMinutes,
        remainingMinutes: duhaTime.remainingMinutes,
      },
      prayerContext: {
        sunrise: formatTime(dailyTimes.sunrise),
        dhuhr: formatTime(dailyTimes.dhuhr),
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
