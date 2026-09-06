"use client"

import { useEffect, useRef, useState } from "react"
import type { GraphEdge, GraphNode } from "./intelligence-graph-presentation"

type IntelligenceGraphCanvasProps = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export function IntelligenceGraphCanvas({
  nodes,
  edges,
}: IntelligenceGraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    nodes.forEach((node) => {
      node.x = Math.random() * canvas.width
      node.y = Math.random() * canvas.height
      node.vx = (Math.random() - 0.5) * 1
      node.vy = (Math.random() - 0.5) * 1
    })

    let mouseX = -1000
    let mouseY = -1000
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = event.clientX - rect.left
      mouseY = event.clientY - rect.top
    }
    canvas.addEventListener("mousemove", handleMouseMove)

    const getColor = (type: string) => {
      if (type === "person") return "#00f0ff"
      if (type === "place") return "#00ff66"
      if (type === "event") return "#ff3366"
      if (type === "book") return "#b829ff"
      return "#ffaa00"
    }

    const render = () => {
      ctx.fillStyle = "#030712"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      let currentlyHovered: GraphNode | null = null
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < node.radius || node.x > canvas.width - node.radius)
          node.vx *= -1
        if (node.y < node.radius || node.y > canvas.height - node.radius)
          node.vy *= -1

        if (Math.hypot(mouseX - node.x, mouseY - node.y) < node.radius + 5) {
          currentlyHovered = node
        }
      })

      setHoveredNode(currentlyHovered)

      edges.forEach((edge) => {
        const source = nodes.find((node) => node.id === edge.source)
        const target = nodes.find((node) => node.id === edge.target)
        if (!source || !target) return

        const isHighlighted =
          currentlyHovered &&
          (currentlyHovered.id === source.id ||
            currentlyHovered.id === target.id)

        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        if (isHighlighted) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
          ctx.lineWidth = 2
          ctx.shadowBlur = 10
          ctx.shadowColor = "white"
        } else {
          ctx.strokeStyle = "rgba(0, 240, 255, 0.15)"
          ctx.lineWidth = edge.strength
          ctx.shadowBlur = 0
        }
        ctx.stroke()
      })

      ctx.shadowBlur = 0
      nodes.forEach((node) => {
        const isHovered = currentlyHovered?.id === node.id
        const color = getColor(node.type)

        ctx.beginPath()
        ctx.arc(
          node.x,
          node.y,
          isHovered ? node.radius * 1.5 : node.radius,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = isHovered ? "white" : color
        ctx.shadowBlur = isHovered ? 20 : 10
        ctx.shadowColor = color
        ctx.fill()

        ctx.shadowBlur = 0
        ctx.fillStyle = isHovered ? "white" : "rgba(255, 255, 255, 0.6)"
        ctx.font = isHovered ? "bold 12px monospace" : "10px monospace"
        ctx.textAlign = "center"
        ctx.fillText(
          node.label,
          node.x,
          node.y + node.radius + (isHovered ? 20 : 15)
        )
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [nodes, edges])

  return (
    <>
      <canvas ref={canvasRef} className="z-0 h-full w-full cursor-crosshair" />
      {hoveredNode && (
        <div className="pointer-events-none absolute right-6 bottom-6 z-10 max-w-[300px] border border-primary bg-card p-4 shadow-sm backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2 border-b border-primary/20 pb-2">
            <span className="text-xs font-bold tracking-widest text-primary">
              TARGET ACQUIRED
            </span>
          </div>
          <h3 className="text-xl font-black text-foreground">
            {hoveredNode.label}
          </h3>
          <div className="mt-1 text-[10px] text-primary/70 uppercase">
            CLASS: {hoveredNode.type}
          </div>
          <p className="mt-3 text-xs text-primary/50">
            Analisis relasi intelektual terdeteksi. Sistem menampilkan jaringan
            keterikatan sejarah.
          </p>
        </div>
      )}
    </>
  )
}
