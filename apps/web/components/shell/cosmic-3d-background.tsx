"use client"
/* eslint-disable @typescript-eslint/no-magic-numbers -- Three.js procedural spatial and geometric animations rely on numerical coordinates and timing constants */

import React, { useEffect, useRef } from "react"

type Star = {
  x: number
  y: number
  size: number
  baseAlpha: number
  alpha: number
  speed: number
  angle: number
  twinkleSpeed: number
  layer: 1 | 2 | 3
}

type Meteor = {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
  color: string
}

export function Cosmic3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef<{
    x: number
    y: number
    targetX: number
    targetY: number
  }>({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    canvas.width = window.innerWidth * window.devicePixelRatio
    canvas.height = window.innerHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const stars: Star[] = []
    const meteors: Meteor[] = []
    const starCount = Math.min(
      Math.floor((window.innerWidth * window.innerHeight) / 2500),
      1200
    )

    // Initialize multi-layered parallax starfield
    for (let i = 0; i < starCount; i++) {
      const layer = (Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3) as
        | 1
        | 2
        | 3
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size:
          layer === 1
            ? Math.random() * 1 + 0.3
            : layer === 2
              ? Math.random() * 1.5 + 0.8
              : Math.random() * 2.2 + 1.2,
        baseAlpha: Math.random() * 0.7 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        speed: layer === 1 ? 0.05 : layer === 2 ? 0.15 : 0.3,
        angle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        layer,
      })
    }

    // Handle Responsive Resize
    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    window.addEventListener("resize", handleResize)

    // Handle Mouse Move for Gravitational Reaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX
      mouseRef.current.targetY = e.clientY
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Spawn Kinetic Meteors periodically
    const spawnMeteor = () => {
      if (meteors.length < 3 && Math.random() < 0.35) {
        meteors.push({
          x: Math.random() * window.innerWidth * 1.5 - window.innerWidth * 0.2,
          y: -50,
          length: Math.random() * 180 + 100,
          speed: Math.random() * 8 + 12,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.1, // around 45 degrees diagonal downward
          opacity: 1,
          color: Math.random() > 0.4 ? "0, 240, 255" : "139, 92, 246", // Neon Cyan (#00F0FF) or Violet (#8B5CF6)
        })
      }
    }
    const meteorInterval = setInterval(spawnMeteor, 2200)

    // High-Precision Render Loop
    let time = 0
    const render = () => {
      time += 0.016

      // Smooth cursor lerping
      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * 0.08
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * 0.08

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Draw Cursor Gravitational Radiant Field
      if (mouseRef.current.x > -500) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          260
        )
        gradient.addColorStop(0, "rgba(0, 240, 255, 0.07)")
        gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.02)")
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      }

      // Draw & animate stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        if (!star) continue

        // Twinkle sinusoidal animation
        star.alpha =
          star.baseAlpha + Math.sin(time * (star.twinkleSpeed * 50)) * 0.25
        star.alpha = Math.max(0.15, Math.min(1, star.alpha))

        // Parallax drift upward/rightward
        star.y -= star.speed * 0.5
        star.x += star.speed * 0.2
        if (star.y < 0) star.y = window.innerHeight
        if (star.x > window.innerWidth) star.x = 0

        // Gravitational distortion around cursor
        let drawX = star.x
        let drawY = star.y
        if (mouseRef.current.x > -500) {
          const dx = mouseRef.current.x - star.x
          const dy = mouseRef.current.y - star.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 180) {
            const force = (1 - dist / 180) * (star.layer * 6)
            drawX -= (dx / dist) * force
            drawY -= (dy / dist) * force
          }
        }

        ctx.beginPath()
        ctx.arc(drawX, drawY, star.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha.toFixed(2)})`
        ctx.fill()

        // Celestial Bloom Glow for Layer 3 (Foreground) Stars
        if (star.layer === 3 && star.alpha > 0.6) {
          ctx.beginPath()
          ctx.arc(drawX, drawY, star.size * 2.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0, 240, 255, ${(star.alpha * 0.18).toFixed(2)})`
          ctx.fill()
        }
      }

      // Draw & animate shooting meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i]
        if (!meteor) continue
        meteor.x += Math.cos(meteor.angle) * meteor.speed
        meteor.y += Math.sin(meteor.angle) * meteor.speed
        meteor.opacity -= 0.012

        if (
          meteor.opacity <= 0 ||
          meteor.x > window.innerWidth + 200 ||
          meteor.y > window.innerHeight + 200
        ) {
          meteors.splice(i, 1)
          continue
        }

        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length

        const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY)
        grad.addColorStop(0, `rgba(${meteor.color}, ${meteor.opacity})`)
        grad.addColorStop(
          0.35,
          `rgba(${meteor.color}, ${meteor.opacity * 0.5})`
        )
        grad.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.moveTo(meteor.x, meteor.y)
        ctx.lineTo(tailX, tailY)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.8
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearInterval(meteorInterval)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-slate-950">
      {/* Deep Celestial Aurora Mesh (GPU Hardware Accelerated) */}
      <div className="absolute -top-[25%] -left-[15%] h-[75vw] w-[75vw] animate-[pulse_14s_ease-in-out_infinite] rounded-full bg-gradient-to-tr from-cyan-400/15 via-cyan-600/10 to-transparent blur-[160px] will-change-transform" />
      <div className="absolute -right-[15%] -bottom-[25%] h-[80vw] w-[80vw] animate-[pulse_18s_ease-in-out_infinite_2s] rounded-full bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-transparent blur-[170px] will-change-transform" />
      <div className="absolute top-[25%] left-[30%] h-[55vw] w-[55vw] animate-[pulse_22s_ease-in-out_infinite_5s] rounded-full bg-gradient-to-r from-cyan-400/5 via-blue-500/10 to-purple-500/5 blur-[180px] will-change-transform" />

      {/* Zero-Dependency Quantum Starfield & Kinetic Comets Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full opacity-90"
        aria-hidden="true"
      />

      {/* Deep Abyss Vignette Gradient for High Contrast Typography */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-transparent to-background/85" />
    </div>
  )
}
