import { describe, it, expect } from 'vitest'
import { getMoonData, getIslamicData, getDailyPrayerTimes, getSunPosition, getDuhaTime } from '@moon/compute'

describe('@moon/compute — Isomorphic Astronomical Engine', () => {
  it('calculates moon phase and illumination without database or network', () => {
    const date = new Date('2024-01-11T12:00:00Z')
    const moon = getMoonData(date)

    expect(moon).toBeDefined()
    expect(moon.phaseName).toBeDefined()
    expect(typeof moon.illumination).toBe('number')
    expect(moon.illumination).toBeGreaterThanOrEqual(0)
    expect(moon.illumination).toBeLessThanOrEqual(100)
    expect(moon.distance).toBeGreaterThan(300000)
  })

  it('calculates daily prayer times for given coordinates', () => {
    const date = new Date('2024-06-15T12:00:00Z')
    const lat = -6.2088
    const lng = 106.8456
    const prayers = getDailyPrayerTimes(lat, lng, date)

    expect(prayers.fajr).toBeInstanceOf(Date)
    expect(prayers.sunrise).toBeInstanceOf(Date)
    expect(prayers.dhuhr).toBeInstanceOf(Date)
    expect(prayers.asr).toBeInstanceOf(Date)
    expect(prayers.maghrib).toBeInstanceOf(Date)
    expect(prayers.isha).toBeInstanceOf(Date)
    expect(prayers.fajr.getTime()).toBeLessThan(prayers.sunrise.getTime())
    expect(prayers.sunrise.getTime()).toBeLessThan(prayers.dhuhr.getTime())
  })

  it('calculates sun position, altitude, and azimuth', () => {
    const date = new Date('2024-06-15T05:00:00Z')
    const sun = getSunPosition(-6.2088, 106.8456, date)

    expect(sun).toBeDefined()
    expect(typeof sun.altitude).toBe('number')
    expect(typeof sun.azimuth).toBe('number')
    expect(typeof sun.isAboveHorizon).toBe('boolean')
    expect(sun.positionLabel).toBeDefined()
  })

  it('calculates Duha prayer time window and optimal time', () => {
    const date = new Date('2024-06-15T03:00:00Z')
    const duha = getDuhaTime(-6.2088, 106.8456, date)

    expect(duha.isyraq).toBeInstanceOf(Date)
    expect(duha.zawal).toBeInstanceOf(Date)
    expect(duha.afdhal).toBeInstanceOf(Date)
    expect(duha.totalDurationMinutes).toBeGreaterThan(0)
    expect(duha.isyraq.getTime()).toBeLessThan(duha.afdhal.getTime())
    expect(duha.afdhal.getTime()).toBeLessThan(duha.zawal.getTime())
  })
})
