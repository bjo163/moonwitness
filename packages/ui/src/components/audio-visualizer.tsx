"use client"

import { useEffect, useRef } from "react"

type VisualizerProps = {
  isPlaying: boolean
}

const MAX_HEIGHT_RATIO = 0.8
const MIN_BAR_HEIGHT = 4
const SIN_TIME_SPEED = 0.003
const SIN_HEIGHT_AMPLITUDE = 3

export function AudioWaveformVisualizer({ isPlaying }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const numBars = 32

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = canvas.width / numBars

      for (let i = 0; i < numBars; i++) {
        const height = isPlaying
          ? Math.random() * (canvas.height * MAX_HEIGHT_RATIO) + MIN_BAR_HEIGHT
          : Math.sin(Date.now() * SIN_TIME_SPEED + i) * SIN_HEIGHT_AMPLITUDE +
            MIN_BAR_HEIGHT

        const x = i * barWidth
        const y = canvas.height - height

        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height)
        gradient.addColorStop(0, "#00F0FF")
        gradient.addColorStop(1, "#00FF66")

        ctx.fillStyle = isPlaying ? gradient : "rgba(0, 240, 255, 0.3)"
        ctx.fillRect(x, y, barWidth - 2, height)
      }

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [isPlaying])

  return (
    <div className="panel-box bg-space tag-clip flex items-center gap-3 border border-primary/30 p-2.5">
      <div className="shrink-0 text-[8px] font-bold tracking-widest text-primary uppercase">
        // AUDIO OSCILLOSCOPE
      </div>
      <canvas
        ref={canvasRef}
        width={160}
        height={24}
        className="block h-6 w-full"
      />
    </div>
  )
}
