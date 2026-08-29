"use client"

import { useState, useEffect, useRef } from "react"
import { Moon } from "lucide-react"
import { Modal } from "@workspace/ui"
import { ModalTrigger } from "@workspace/ui"

export function Interactive3DMoonOrreryModal() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
  }, [])

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let angle = 0

    function render() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      // Draw Orbit Ring
      ctx.strokeStyle = "rgba(0, 240, 255, 0.2)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(cx, cy, 100, 0, Math.PI * 2)
      ctx.stroke()

      // Earth Center
      ctx.fillStyle = "#00F0FF"
      ctx.beginPath()
      ctx.arc(cx, cy, 25, 0, Math.PI * 2)
      ctx.fill()

      // Moon Orbital Position
      const mx = cx + 100 * Math.cos(angle)
      const my = cy + 100 * Math.sin(angle)

      ctx.fillStyle = "#FFE600"
      ctx.beginPath()
      ctx.arc(mx, my, 12, 0, Math.PI * 2)
      ctx.fill()

      angle += 0.02
      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [isOpen])

  return (
    <>
      <ModalTrigger
        icon={Moon}
        label="[ 3D LUNAR ORRERY ]"
        onClick={() => setIsOpen(true)}
        title="Buka Visualizer 3D Orbit Moon V5.0"
        color="yellow"
      />

      <Modal
        isOpen={isOpen && mounted}
        onClose={() => setIsOpen(false)}
        title="// 3D LUNAR ORBIT & HIJRI PHASE VISUALIZER V5.0"
        icon={Moon}
        maxWidth="max-w-lg"
        borderColor="border-accent/60"
        glowColor="rgba(255,230,0,0.3)"
      >
        <div className="flex flex-col items-center space-y-4 p-6 text-center">
          <canvas
            ref={canvasRef}
            width={300}
            height={250}
            className="tag-clip bg-background border border-accent/30"
          />

          <div className="grid w-full grid-cols-2 gap-3 text-xs">
            <div className="bg-panel border border-accent/20 p-3 text-left">
              <span className="block text-[8px] text-muted uppercase">
                {/* ILLUMINATION % */}
              </span>
              <span className="font-bold text-accent">
                32.4% WAXING CRESCENT
              </span>
            </div>

            <div className="bg-panel border border-accent/20 p-3 text-left">
              <span className="block text-[8px] text-muted">
                {/* HIJRI AGE */}
              </span>
              <span className="text-success font-bold">4.2 DAYS OLD MOON</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
