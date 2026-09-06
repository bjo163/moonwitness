"use client"

import { useCosmicCanvas } from "./use-cosmic-canvas"

function Cosmic3DBackgroundCanvas() {
  const canvasRef = useCosmicCanvas()

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full opacity-90" aria-hidden="true" />
}

function CosmicGlowLayers() {
  return (
    <>
      <div
        className="absolute -top-[25%] -left-[15%] h-[75vw] w-[75vw] animate-[pulse_14s_ease-in-out_infinite] rounded-full blur-[160px] will-change-transform"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 15%, transparent), transparent 70%)" }}
      />
      <div
        className="absolute -right-[15%] -bottom-[25%] h-[80vw] w-[80vw] animate-[pulse_18s_ease-in-out_infinite_2s] rounded-full blur-[170px] will-change-transform"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent-foreground) 15%, transparent), transparent 70%)" }}
      />
      <div
        className="absolute top-[25%] left-[30%] h-[55vw] w-[55vw] animate-[pulse_22s_ease-in-out_infinite_5s] rounded-full blur-[180px] will-change-transform"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 5%, transparent), transparent 70%)" }}
      />
    </>
  )
}

function CosmicVignette() {
  return (
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--background) 30%, transparent), transparent 45%, color-mix(in srgb, var(--background) 85%, transparent))" }}
    />
  )
}

export function Cosmic3DBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-background">
      <CosmicGlowLayers />
      <Cosmic3DBackgroundCanvas />
      <CosmicVignette />
    </div>
  )
}
