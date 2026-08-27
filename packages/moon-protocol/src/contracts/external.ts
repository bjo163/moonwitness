/**
 * ◈ MOONWITNESS PROTOCOL — EXTERNAL PROXY CONTRACTS
 *
 * Zod schemas for third-party API proxy endpoints.
 * These document what shapes we expect from NASA, USGS, etc.
 */
import { z } from 'zod'

// ═══════════════════════════════════════════
// 🚀 NASA ENDPOINTS
// ═══════════════════════════════════════════

export const NasaNeoQuerySchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

export const NasaApodResponseSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  url: z.string(),
  hdurl: z.string().optional(),
  date: z.string(),
  media_type: z.string(),
})

export const NasaCmeItemSchema = z.object({
  activityID: z.string().optional(),
  startTime: z.string().optional(),
  sourceLocation: z.string().optional(),
  note: z.string().optional(),
})

// ═══════════════════════════════════════════
// 🌍 GEOPHYSICS
// ═══════════════════════════════════════════

export const UsgsEarthquakeFeatureSchema = z.object({
  type: z.literal('Feature'),
  properties: z.object({
    mag: z.number().nullable(),
    place: z.string().nullable(),
    time: z.number().nullable(),
    type: z.string().nullable(),
    title: z.string().nullable(),
  }),
  geometry: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number(), z.number()]),
  }),
})

export const UsgsEarthquakeResponseSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(UsgsEarthquakeFeatureSchema),
  metadata: z.object({
    generated: z.number(),
    count: z.number(),
    title: z.string(),
  }).optional(),
})

// ═══════════════════════════════════════════
// 🌤️ WEATHER
// ═══════════════════════════════════════════

export const WeatherQuerySchema = z.object({
  latitude: z.string().or(z.number()),
  longitude: z.string().or(z.number()),
})

export const WeatherResponseSchema = z.object({
  current_weather: z.object({
    temperature: z.number(),
    windspeed: z.number(),
    winddirection: z.number(),
    weathercode: z.number(),
    time: z.string(),
  }).optional(),
})

// ═══════════════════════════════════════════
// 🛰️ SPACE / ISS
// ═══════════════════════════════════════════

export const IssPositionResponseSchema = z.object({
  name: z.string().optional(),
  id: z.number().optional(),
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number().optional(),
  velocity: z.number().optional(),
  visibility: z.string().optional(),
})

// ═══════════════════════════════════════════
// 📈 MARKETS
// ═══════════════════════════════════════════

export const BinanceTickerSchema = z.object({
  symbol: z.string(),
  priceChange: z.string().optional(),
  priceChangePercent: z.string().optional(),
  lastPrice: z.string().optional(),
  volume: z.string().optional(),
  highPrice: z.string().optional(),
  lowPrice: z.string().optional(),
})

// ═══════════════════════════════════════════
// 📰 TRENDS
// ═══════════════════════════════════════════

export const TrendItemSchema = z.object({
  title: z.string(),
  traffic: z.string().optional(),
  pubDate: z.string().optional(),
})

// ═══════════════════════════════════════════
// INFERRED TYPES
// ═══════════════════════════════════════════

export type NasaApodResponse = z.infer<typeof NasaApodResponseSchema>
export type NasaCmeItem = z.infer<typeof NasaCmeItemSchema>
export type UsgsEarthquakeFeature = z.infer<typeof UsgsEarthquakeFeatureSchema>
export type UsgsEarthquakeResponse = z.infer<typeof UsgsEarthquakeResponseSchema>
export type WeatherResponse = z.infer<typeof WeatherResponseSchema>
export type IssPositionResponse = z.infer<typeof IssPositionResponseSchema>
export type BinanceTicker = z.infer<typeof BinanceTickerSchema>
export type TrendItem = z.infer<typeof TrendItemSchema>
