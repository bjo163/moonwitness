"use client"

import { useCallback, useEffect, useState } from "react"
import {
  AEQ4_EPOCH_UTC_MS,
  getAEQ4Timestamp,
  getCountdownProgress,
  getLunarPosition,
  utcToHijri,
  type AEQ4Timestamp,
  type HijriDate,
  type LunarPosition,
} from "@moon/time"
import { resolveSemanticColor } from "@workspace/ui"
import { HomeAEQ4ActivePanels } from "../components/home-aeq4-active-panels"
import { HomeAEQ4Clocks } from "../components/home-aeq4-clocks"
import { HomeAEQ4Countdown } from "../components/home-aeq4-countdown"
import { HomeAEQ4Header } from "../components/home-aeq4-header"
import { HomeAEQ4Manifesto } from "../components/home-aeq4-manifesto"

interface TemporalState {
  aeq: AEQ4Timestamp
  hijri: HijriDate
  lunar: LunarPosition
  progress: number
  now: number
}

export function HomeAEQ4Section() {
  const [state, setState] = useState<TemporalState | null>(null)
  const tick = useCallback(() => {
    const now = Date.now()
    setState({
      aeq: getAEQ4Timestamp(now),
      hijri: utcToHijri(now),
      lunar: getLunarPosition(now),
      progress: getCountdownProgress(now),
      now,
    })
  }, [])

  useEffect(() => {
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tick])

  if (!state) return null
  const { aeq, hijri, lunar, progress } = state
  const isPreEra = aeq.mode === "PRE_ERA"

  return (
    <section className="relative w-full overflow-hidden py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 50%, color-mix(in srgb, ${resolveSemanticColor("warning")} 4%, transparent) 0%, transparent 70%)`,
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6">
        <HomeAEQ4Header isPreEra={isPreEra} />
        <HomeAEQ4Clocks
          utcNow={new Date(state.now)}
          hijri={hijri}
          lunar={lunar}
          aeq={aeq}
          isPreEra={isPreEra}
        />
        <HomeAEQ4Countdown
          aeq={aeq}
          progress={progress}
          epochDate={new Date(AEQ4_EPOCH_UTC_MS)}
        />
        <HomeAEQ4ActivePanels aeq={aeq} lunar={lunar} isPreEra={isPreEra} />
        <HomeAEQ4Manifesto />
      </div>
    </section>
  )
}
