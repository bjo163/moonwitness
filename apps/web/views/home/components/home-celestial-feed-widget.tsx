"use client"

import React, { useState, useEffect } from "react"
import { useNasaFeeds } from "@moon/client"

const FEED_REFRESH_INTERVAL_MS = 300000

export function HomeCelestialFeedWidget() {
  const { apod } = useNasaFeeds()

  const [liveEarth, setLiveEarth] = useState(
    "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/GEOCOLOR/678x678.jpg"
  )
  const [liveSunRed, setLiveSunRed] = useState(
    "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0304.jpg"
  )

  // Auto-refresh real-time image feeds every 5 minutes via cache-busting param
  useEffect(() => {
    const feedInterval = setInterval(() => {
      const t = new Date().getTime()
      setLiveEarth(
        `https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/GEOCOLOR/678x678.jpg?t=${t}`
      )
      setLiveSunRed(
        `https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0304.jpg?t=${t}`
      )
    }, FEED_REFRESH_INTERVAL_MS)

    return () => clearInterval(feedInterval)
  }, [])

  const deepSkyImg = apod?.url ?? "/assets/cam_deepsky.png"

  return (
    <div className="relative rounded-lg border border-primary/20 bg-black/10 p-4 shadow-sm backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 text-xs font-bold tracking-widest text-primary uppercase">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-sm" />
          <span>LIVE CELESTIAL FEED</span>
        </div>
        <div className="flex gap-1.5 font-sans text-[9px] font-medium tracking-widest text-primary uppercase">
          <span>DEEP SPACE OPTICS ACTIVE</span>
        </div>
      </div>

      <div className="hide-scrollbar my-auto flex snap-x gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-x-visible sm:pb-0">
        {/* Cam 1: LUNAR OPTICS */}
        <div className="group relative flex w-[160px] shrink-0 snap-center flex-col items-center justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] p-2.5 shadow-inner backdrop-blur-md transition-all hover:border-primary sm:w-auto">
          <div className="absolute top-1 right-1 z-10 flex items-center gap-1 rounded bg-black/60 px-1 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-[6px] text-emerald-400">
              TRACKING
            </span>
          </div>
          <div className="relative my-1 flex h-24 w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black">
            <img
              src="/assets/cam_moon.png"
              alt="Lunar Optics"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="mt-1.5 flex w-full items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-sm" />
            <span className="text-[9px] font-bold tracking-wider text-primary uppercase">
              LUNAR OPTICS
            </span>
          </div>
        </div>

        {/* Cam 2: Live Earth View (NOAA GOES-19) */}
        <div className="group relative flex w-[160px] shrink-0 snap-center flex-col items-center justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] p-2.5 shadow-inner backdrop-blur-md transition-all hover:border-primary sm:w-auto">
          <div className="absolute top-1 right-1 z-10 flex items-center gap-1 rounded bg-black/60 px-1 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            <span className="text-danger font-mono text-[6px]">LIVE</span>
          </div>
          <div className="relative my-1 flex h-24 w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black">
            <img
              src={liveEarth}
              onError={(e) => {
                e.currentTarget.src = "/assets/cam_earth.png"
              }}
              alt="Live Earth NOAA"
              className="h-[120%] w-[120%] object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="mt-1.5 flex w-full items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-sm" />
            <span className="text-[9px] font-bold tracking-wider text-primary uppercase">
              GOES-19 EARTH
            </span>
          </div>
        </div>

        {/* Cam 3: NASA APOD / Deep Sky */}
        <div className="group relative flex w-[160px] shrink-0 snap-center flex-col items-center justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] p-2.5 shadow-inner backdrop-blur-md transition-all hover:border-fuchsia-400 sm:w-auto">
          <div className="absolute top-1 right-1 z-10 flex items-center gap-1 rounded bg-black/60 px-1 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-[6px] text-emerald-400">
              TRACKING
            </span>
          </div>
          <div className="relative my-1 flex h-24 w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black">
            <img
              src={deepSkyImg}
              onError={(e) => {
                e.currentTarget.src = "/assets/galaxy_milkyway_bg.png"
              }}
              alt={apod?.title ?? "Deep Sky"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="mt-1.5 flex w-full items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-sm" />
            <span className="text-[9px] font-bold tracking-wider text-fuchsia-400 uppercase">
              NASA APOD
            </span>
          </div>
        </div>

        {/* Cam 4: SDO AIA-304 (Sun) */}
        <div className="group relative flex w-[160px] shrink-0 snap-center flex-col items-center justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] p-2.5 shadow-inner backdrop-blur-md transition-all hover:border-orange-500 sm:w-auto">
          <div className="absolute top-1 right-1 z-10 flex items-center gap-1 rounded bg-black/60 px-1 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            <span className="text-danger font-mono text-[6px]">LIVE</span>
          </div>
          <div className="relative my-1 flex h-24 w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black">
            <img
              src={liveSunRed}
              onError={(e) => {
                e.currentTarget.src = "/assets/cam_sun.png"
              }}
              alt="NASA SDO AIA-304"
              className="h-[110%] w-[110%] object-cover object-center mix-blend-screen transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="mt-1.5 flex w-full items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-sm" />
            <span className="text-[9px] font-bold tracking-wider text-orange-400 uppercase">
              SDO AIA-304
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
