"use client"

import { useEffect, useRef, useState } from "react"
import { Network, Search, Scan, Activity } from "lucide-react"
import { ContextBlock } from "@workspace/ui"

type Node = {
  id: string
  label: string
  type: "person" | "place" | "event" | "concept" | "book"
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

type Edge = {
  source: string
  target: string
  strength: number
}

const KNOWLEDGE_NODES: Node[] = [
  {
    id: "n1",
    label: "Imam Al-Ghazali",
    type: "person",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 20,
  },
  {
    id: "n2",
    label: "Ihya Ulumuddin",
    type: "concept",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 15,
  },
  {
    id: "n3",
    label: "Baghdad",
    type: "place",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 25,
  },
  {
    id: "n4",
    label: "Baitul Hikmah",
    type: "place",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 22,
  },
  {
    id: "n5",
    label: "Imam Syafi'i",
    type: "person",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 20,
  },
  {
    id: "n6",
    label: "Ushul Fiqh",
    type: "concept",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 18,
  },
  {
    id: "n7",
    label: "Kairo (Mesir)",
    type: "place",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 25,
  },
  {
    id: "n8",
    label: "Al-Azhar",
    type: "place",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 22,
  },
  {
    id: "n9",
    label: "Salahuddin Al-Ayyubi",
    type: "person",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 24,
  },
  {
    id: "n10",
    label: "Yerusalem",
    type: "place",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 25,
  },
  {
    id: "n11",
    label: "Perang Hittin",
    type: "event",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 18,
  },
  {
    id: "n12",
    label: "Makkah",
    type: "place",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 30,
  },
  {
    id: "n13",
    label: "Madinah",
    type: "place",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 30,
  },
  {
    id: "n14",
    label: "Hijrah",
    type: "event",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 25,
  },
  {
    id: "n15",
    label: "Cordoba (Andalusia)",
    type: "place",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 26,
  },
  {
    id: "n16",
    label: "Ibnu Rusyd",
    type: "person",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 20,
  },
  {
    id: "n17",
    label: "Ibnu Sina",
    type: "person",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 20,
  },
]

const KNOWLEDGE_EDGES: Edge[] = [
  { source: "n1", target: "n2", strength: 1 },
  { source: "n1", target: "n3", strength: 0.8 },
  { source: "n3", target: "n4", strength: 1 },
  { source: "n5", target: "n6", strength: 1 },
  { source: "n5", target: "n7", strength: 0.8 },
  { source: "n7", target: "n8", strength: 1 },
  { source: "n9", target: "n7", strength: 0.7 },
  { source: "n9", target: "n10", strength: 1 },
  { source: "n9", target: "n11", strength: 1 },
  { source: "n10", target: "n11", strength: 0.9 },
  { source: "n12", target: "n13", strength: 1 },
  { source: "n12", target: "n14", strength: 0.9 },
  { source: "n13", target: "n14", strength: 0.9 },
  { source: "n5", target: "n12", strength: 0.5 },
  { source: "n1", target: "n12", strength: 0.5 },
  { source: "n15", target: "n16", strength: 1 },
  { source: "n16", target: "n1", strength: 0.4 }, // Debates
  { source: "n17", target: "n1", strength: 0.4 }, // Debates
  { source: "n17", target: "n3", strength: 0.6 },
]

import { moonClientInstance } from "@moon/client"

export function IntelligenceGraphView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const client = moonClientInstance

  const [nodes, setNodes] = useState<Node[]>(KNOWLEDGE_NODES)
  const [edges, setEdges] = useState<Edge[]>(KNOWLEDGE_EDGES)

  useEffect(() => {
    Promise.allSettled([
      client.model("wx.scripture.book").fetch(),
      client.model("wx.figure").fetch(),
    ]).then(([booksRes, figuresRes]) => {
      const books = booksRes.status === "fulfilled" && Array.isArray(booksRes.value) ? booksRes.value : []
      const figures = figuresRes.status === "fulfilled" && Array.isArray(figuresRes.value) ? figuresRes.value : []

      const dynamicBookNodes: Node[] = books.map((b) => ({
        id: `book_${b.id}`,
        label: b.name || "Canonical Book",
        type: "book" as const,
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        radius: 28,
      }))

      const dynamicFigureNodes: Node[] = figures.slice(0, 10).map((f) => ({
        id: `fig_${f.id}`,
        label: f.name || "Scholar",
        type: "person" as const,
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        radius: 24,
      }))

      const bookEdges: Edge[] = books.map((b) => ({
        source: "n12",
        target: `book_${b.id}`,
        strength: 0.6,
      }))

      const figureEdges: Edge[] = figures.slice(0, 10).map((f) => ({
        source: "n1",
        target: `fig_${f.id}`,
        strength: 0.5,
      }))

      setNodes([...KNOWLEDGE_NODES, ...dynamicBookNodes, ...dynamicFigureNodes])
      setEdges([...KNOWLEDGE_EDGES, ...bookEdges, ...figureEdges])
    }).catch(() => {})
  }, [client])

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

    // Initialize random positions for all active nodes
    nodes.forEach((n) => {
      n.x = Math.random() * canvas.width
      n.y = Math.random() * canvas.height
      n.vx = (Math.random() - 0.5) * 1
      n.vy = (Math.random() - 0.5) * 1
    })

    let mouseX = -1000
    let mouseY = -1000

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    canvas.addEventListener("mousemove", handleMouseMove)

    const getColor = (type: string) => {
      if (type === "person") return "#00f0ff" // cyan
      if (type === "place") return "#00ff66" // green
      if (type === "event") return "#ff3366" // red
      if (type === "book") return "#b829ff" // purple
      return "#ffaa00" // warning (concept)
    }

    const render = () => {
      ctx.fillStyle = "#030712"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      let currentlyHovered: Node | null = null

      // Physics and movement
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy

        // Bounce off walls
        if (n.x < n.radius || n.x > canvas.width - n.radius) n.vx *= -1
        if (n.y < n.radius || n.y > canvas.height - n.radius) n.vy *= -1

        // Check hover
        const dist = Math.hypot(mouseX - n.x, mouseY - n.y)
        if (dist < n.radius + 5) {
          currentlyHovered = n
        }
      })

      setHoveredNode(currentlyHovered)

      // Draw Edges
      edges.forEach((edge) => {
        const source = nodes.find((n) => n.id === edge.source)
        const target = nodes.find((n) => n.id === edge.target)
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

      // Draw Nodes
      ctx.shadowBlur = 0
      nodes.forEach((n) => {
        const isHovered = currentlyHovered?.id === n.id
        const color = getColor(n.type)

        ctx.beginPath()
        ctx.arc(n.x, n.y, isHovered ? n.radius * 1.5 : n.radius, 0, Math.PI * 2)
        ctx.fillStyle = isHovered ? "white" : color

        if (isHovered) {
          ctx.shadowBlur = 20
          ctx.shadowColor = color
        } else {
          ctx.shadowBlur = 10
          ctx.shadowColor = color
        }
        ctx.fill()

        // Draw Label
        ctx.shadowBlur = 0
        ctx.fillStyle = isHovered ? "white" : "rgba(255, 255, 255, 0.6)"
        ctx.font = isHovered ? "bold 12px monospace" : "10px monospace"
        ctx.textAlign = "center"
        ctx.fillText(n.label, n.x, n.y + n.radius + (isHovered ? 20 : 15))
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
      <ContextBlock
        title="INTELLIGENCE GRAPH (KNOWLEDGE WEB)"
        subtitle="Sistem pemetaan jaringan visual untuk melacak relasi intelektual, peristiwa sejarah, dan pusat peradaban umat. Hanya untuk observasi dan analisis (Read-Only)."
        operation="NEURAL-MAPPING"
        status="ONLINE"
        accentColor="primary"
      />

      <div className="panel-box bg-space relative flex h-[700px] flex-col overflow-hidden border-2 border-primary/50 shadow-[0_0_50px_rgba(0,240,255,0.15)]">
        {/* Top Bar HUD */}
        <div className="pointer-events-none absolute top-0 left-0 z-10 flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Network className="h-5 w-5 animate-pulse text-primary" />
            <div>
              <div className="text-[10px] font-bold tracking-widest text-primary/50">
                GRAPH DATABASE
              </div>
              <div className="font-mono text-xs font-bold text-primary">
                NODES: {KNOWLEDGE_NODES.length} | EDGES:{" "}
                {KNOWLEDGE_EDGES.length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border border-primary/30 bg-black/50 p-2 text-[10px] font-bold backdrop-blur-sm">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#00f0ff]" /> TOKOH
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#00ff66]" /> LOKASI
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#ff3366]" /> PERISTIWA
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#ffaa00]" /> KONSEP
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#b829ff]" />{" "}
              KITAB/SUMBER
            </span>
          </div>
        </div>

        {/* Canvas Engine */}
        <canvas
          ref={canvasRef}
          className="z-0 h-full w-full cursor-crosshair"
        />

        {/* Selected Node HUD */}
        {hoveredNode && (
          <div className="pointer-events-none absolute right-6 bottom-6 z-10 max-w-[300px] border border-primary bg-black/80 p-4 shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2 border-b border-primary/20 pb-2">
              <Scan className="animate-spin-slow h-4 w-4 text-accent" />
              <span className="text-xs font-bold tracking-widest text-primary">
                TARGET ACQUIRED
              </span>
            </div>
            <h3 className="text-xl font-black text-white">
              {hoveredNode.label}
            </h3>
            <div className="mt-1 text-[10px] text-primary/70 uppercase">
              CLASS: {hoveredNode.type}
            </div>
            <p className="mt-3 text-xs text-primary/50">
              Analisis relasi intelektual terdeteksi. Sistem menampilkan
              jaringan keterikatan sejarah.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
