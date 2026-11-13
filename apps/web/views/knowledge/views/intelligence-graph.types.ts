export type GraphNode = {
  id: string
  label: string
  type: 'person' | 'place' | 'event' | 'concept' | 'book'
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export type GraphEdge = { source: string; target: string; strength: number }
