"use client"

import React, { useState, useEffect } from "react"

const FEED_REFRESH_INTERVAL_MS = 300000

export function HomeCelestialFeedWidget() {
  const [liveEarth, setLiveEarth] = useState(
    "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/GEOCOLOR/678x678.jpg"
  )
  const [liveSunRed, setLiveSunRed] = useState(
    "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0304.jpg"
  )
  const [deepSkyImg, setDeepSkyImg] = useState("/assets/cam_deepsky.png")

  useEffect(() => {
    // NASA APOD for Deep Sky Camera
    const fetchApod = async () => {
      try {
        const apodRes = await fetch(
          "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
        )
        const apodData = await apodRes.json()
        if (apodData.url && !apodData.url.includes("youtube")) {
          setDeepSkyImg(apodData.url)
        }
      } catch {
        /* Ignore offline fallback errors */
      }
    }
    fetchApod()

    // Auto-refresh Real-time space feeds every 5 minutes
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

  return (
    <div className="relative rounded-lg border border-primary/20 bg-black/10 p-4 shadow-[inset_0_0_20px_rgba(0,255,255,0.02)] backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 text-xs font-bold tracking-widest text-primary uppercase">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
          <span>LIVE CELESTIAL FEED</span>
        </div>
        <div className="flex gap-1.5 font-sans text-[9px] font-medium tracking-widest text-primary uppercase">
          <span>DEEP SPACE OPTICS ACTIVE</span>
        </div>
      </div>

      <div className="my-auto grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Cam 1: LUNAR OPTICS (Moon) */}
        <div className="group relative flex flex-col items-center justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] p-2.5 shadow-inner backdrop-blur-md transition-all hover:border-primary">
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
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22D3EE]" />
            <span className="text-[9px] font-bold tracking-wider text-primary uppercase">
              LUNAR OPTICS
            </span>
          </div>
        </div>

        {/* Cam 2: Live Earth View (NOAA GOES-19 Real-time) */}
        <div className="group relative flex flex-col items-center justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] p-2.5 shadow-inner backdrop-blur-md transition-all hover:border-primary">
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
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_#06b6d4]" />
            <span className="text-[9px] font-bold tracking-wider text-primary uppercase">
              GOES-19 EARTH
            </span>
          </div>
        </div>

        {/* Cam 3: DEEP SKY (Galaxy) */}
        <div className="group relative flex flex-col items-center justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] p-2.5 shadow-inner backdrop-blur-md transition-all hover:border-fuchsia-400">
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
              alt="Deep Sky"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="mt-1.5 flex w-full items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_5px_#c026d3]" />
            <span className="text-[9px] font-bold tracking-wider text-fuchsia-400 uppercase">
              NASA APOD
            </span>
          </div>
        </div>

        {/* Cam 4: SDO AIA-304 (Sun Red) */}
        <div className="group relative flex flex-col items-center justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] p-2.5 shadow-inner backdrop-blur-md transition-all hover:border-orange-500">
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
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_#F97316]" />
            <span className="text-[9px] font-bold tracking-wider text-orange-400 uppercase">
              SDO AIA-304
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
