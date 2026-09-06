"use client"

import { useEffect, useState } from "react"
import { Network, Scan } from "lucide-react"
import { ContextBlock } from "@workspace/ui"
import {
  IntelligenceGraphPresentation,
  type GraphEdge,
  type GraphNode,
} from "./intelligence-graph-presentation"
import { moonClientInstance } from "@moon/client"

const KNOWLEDGE_NODES: GraphNode[] = [
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

const KNOWLEDGE_EDGES: GraphEdge[] = [
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

export function IntelligenceGraphView() {
  const client = moonClientInstance

  const [nodes, setNodes] = useState<GraphNode[]>(KNOWLEDGE_NODES)
  const [edges, setEdges] = useState<GraphEdge[]>(KNOWLEDGE_EDGES)

  useEffect(() => {
    Promise.allSettled([
      client.model("wx.scripture.book").fetch(),
      client.model("wx.figure").fetch(),
    ])
      .then(([booksRes, figuresRes]) => {
        const books =
          booksRes.status === "fulfilled" && Array.isArray(booksRes.value)
            ? booksRes.value
            : []
        const figures =
          figuresRes.status === "fulfilled" && Array.isArray(figuresRes.value)
            ? figuresRes.value
            : []

        const dynamicBookNodes: GraphNode[] = books.map((b) => ({
          id: `book_${b.id}`,
          label: b.name || "Canonical Book",
          type: "book" as const,
          x: Math.random() * 800,
          y: Math.random() * 600,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          radius: 28,
        }))

        const dynamicFigureNodes: GraphNode[] = figures
          .slice(0, 10)
          .map((f) => ({
            id: `fig_${f.id}`,
            label: f.name || "Scholar",
            type: "person" as const,
            x: Math.random() * 800,
            y: Math.random() * 600,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            radius: 24,
          }))

        const bookEdges: GraphEdge[] = books.map((b) => ({
          source: "n12",
          target: `book_${b.id}`,
          strength: 0.6,
        }))

        const figureEdges: GraphEdge[] = figures.slice(0, 10).map((f) => ({
          source: "n1",
          target: `fig_${f.id}`,
          strength: 0.5,
        }))

        setNodes([
          ...KNOWLEDGE_NODES,
          ...dynamicBookNodes,
          ...dynamicFigureNodes,
        ])
        setEdges([...KNOWLEDGE_EDGES, ...bookEdges, ...figureEdges])
      })
      .catch(() => {})
  }, [client])

  return (
    <IntelligenceGraphPresentation
      nodes={nodes}
      edges={edges}
      nodeCount={nodes.length}
      edgeCount={edges.length}
    />
  )
}
