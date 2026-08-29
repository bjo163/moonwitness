"use client"

import React, { useRef, useEffect } from "react"

interface AudioSpectrogramProps {
  analyser?: AnalyserNode | null
  isActive?: boolean
  width?: number
  height?: number
  barCount?: number
  accentColor?: "cyan" | "green" | "yellow" | "purple"
}

export function AudioSpectrogram({
  analyser,
  isActive = true,
  width = 240,
  height = 40,
  barCount = 32,
  accentColor = "cyan",
}: AudioSpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const bufferLength = analyser ? analyser.frequencyBinCount : barCount
    const dataArray = new Uint8Array(bufferLength)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      if (analyser && isActive) {
        analyser.getByteFrequencyData(dataArray)
      } else if (isActive) {
        // Procedural organic harmonic waveform simulation
        const time = Date.now() * 0.003
        for (let i = 0; i < barCount; i++) {
          const wave = Math.sin(time + i * 0.25) * Math.cos(time * 0.5 + i * 0.1)
          dataArray[i] = Math.max(10, Math.floor(((wave + 1) / 2) * 200) + Math.floor(Math.random() * 20))
        }
      } else {
        // Standby baseline
        for (let i = 0; i < barCount; i++) {
          dataArray[i] = 4
        }
      }

      const barWidth = (width / barCount) - 1.5
      let x = 0

      for (let i = 0; i < barCount; i++) {
        const val = dataArray[i] || 0
        const barHeight = Math.max(2, (val / 255) * height)

        const gradient = ctx.createLinearGradient(0, height, 0, 0)
        if (accentColor === "green") {
          gradient.addColorStop(0, "rgba(0, 255, 102, 0.2)")
          gradient.addColorStop(1, "rgba(0, 255, 102, 0.9)")
        } else if (accentColor === "yellow") {
          gradient.addColorStop(0, "rgba(255, 230, 0, 0.2)")
          gradient.addColorStop(1, "rgba(255, 230, 0, 0.9)")
        } else if (accentColor === "purple") {
          gradient.addColorStop(0, "rgba(161, 0, 255, 0.2)")
          gradient.addColorStop(1, "rgba(212, 119, 255, 0.9)")
        } else {
          gradient.addColorStop(0, "rgba(0, 240, 255, 0.2)")
          gradient.addColorStop(1, "rgba(0, 240, 255, 0.9)")
        }

        ctx.fillStyle = gradient
        ctx.fillRect(x, height - barHeight, barWidth, barHeight)

        x += barWidth + 1.5
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [analyser, isActive, width, height, barCount, accentColor])

  return (
    <div className="flex items-center gap-2 rounded border border-border bg-black/60 p-1 backdrop-blur-md">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block"
      />
    </div>
  )
}
