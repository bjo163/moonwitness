import { useEffect, useRef } from "react"

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

function getToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function useCosmicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef({
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

    const foregroundColor = getToken("--foreground")
    const accentColor = getToken("--primary") || foregroundColor
    const secondaryColor = getToken("--accent-foreground") || accentColor
    let animationFrameId: number
    const pixelRatio = window.devicePixelRatio

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * pixelRatio
      canvas.height = window.innerHeight * pixelRatio
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }
    resizeCanvas()

    const stars: Star[] = []
    const meteors: Meteor[] = []
    const starCount = Math.min(
      Math.floor((window.innerWidth * window.innerHeight) / 2500),
      1200
    )

    for (let i = 0; i < starCount; i++) {
      const layer = (Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3) as 1 | 2 | 3
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

    const handleResize = () => resizeCanvas()
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.targetX = event.clientX
      mouseRef.current.targetY = event.clientY
    }
    const spawnMeteor = () => {
      if (meteors.length >= 3 || Math.random() >= 0.35) return
      meteors.push({
        x: Math.random() * window.innerWidth * 1.5 - window.innerWidth * 0.2,
        y: -50,
        length: Math.random() * 180 + 100,
        speed: Math.random() * 8 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.1,
        opacity: 1,
        color: Math.random() > 0.4 ? accentColor : secondaryColor,
      })
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    const meteorInterval = setInterval(spawnMeteor, 2200)

    let time = 0
    const render = () => {
      time += 0.016
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      if (mouseRef.current.x > -500) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          260
        )
        gradient.addColorStop(0, accentColor)
        gradient.addColorStop(0.5, secondaryColor)
        gradient.addColorStop(1, "transparent")
        ctx.globalAlpha = 0.07
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
        ctx.globalAlpha = 1
      }

      for (const star of stars) {
        star.alpha = Math.max(
          0.15,
          Math.min(1, star.baseAlpha + Math.sin(time * (star.twinkleSpeed * 50)) * 0.25)
        )
        star.y -= star.speed * 0.5
        star.x += star.speed * 0.2
        if (star.y < 0) star.y = window.innerHeight
        if (star.x > window.innerWidth) star.x = 0

        let drawX = star.x
        let drawY = star.y
        if (mouseRef.current.x > -500) {
          const dx = mouseRef.current.x - star.x
          const dy = mouseRef.current.y - star.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance > 0 && distance < 180) {
            const force = (1 - distance / 180) * (star.layer * 6)
            drawX -= (dx / distance) * force
            drawY -= (dy / distance) * force
          }
        }

        ctx.beginPath()
        ctx.arc(drawX, drawY, star.size / 2, 0, Math.PI * 2)
        ctx.globalAlpha = star.alpha
        ctx.fillStyle = foregroundColor
        ctx.fill()
        ctx.globalAlpha = 1

        if (star.layer === 3 && star.alpha > 0.6) {
          ctx.beginPath()
          ctx.arc(drawX, drawY, star.size * 2.2, 0, Math.PI * 2)
          ctx.globalAlpha = star.alpha * 0.18
          ctx.fillStyle = accentColor
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      for (let index = meteors.length - 1; index >= 0; index--) {
        const meteor = meteors[index]
        if (!meteor) continue
        meteor.x += Math.cos(meteor.angle) * meteor.speed
        meteor.y += Math.sin(meteor.angle) * meteor.speed
        meteor.opacity -= 0.012
        const shouldRemove =
          meteor.opacity <= 0 ||
          meteor.x > window.innerWidth + 200 ||
          meteor.y > window.innerHeight + 200
        if (shouldRemove) {
          meteors.splice(index, 1)
          continue
        }
        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length
        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY)
        gradient.addColorStop(0, meteor.color)
        gradient.addColorStop(0.35, meteor.color)
        gradient.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.moveTo(meteor.x, meteor.y)
        ctx.lineTo(tailX, tailY)
        ctx.globalAlpha = meteor.opacity
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.8
        ctx.stroke()
        ctx.globalAlpha = 1
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

  return canvasRef
}
