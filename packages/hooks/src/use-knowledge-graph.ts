"use client"

import { useState, useMemo } from "react"
import type { KnowledgeGraphData, KnowledgeNode, KnowledgeEdge } from "@workspace/types"

export interface KnowledgeGraphFilter {
  selectedGroups: string[]
  searchQuery: string
  minWeight: number
}

export interface GraphStatistics {
  totalEntities: number
  totalConnections: number
  activeRelations: number
  dataSources: number
  lastUpdated: string
}

export interface GraphEntityTypeItem {
  id: string
  n: string
  c: number | string
  col: string
  i: string
}

export interface TopEntityItem {
  id?: string
  n: string
  col: string
  i: string
  c: number | string
  group?: string
  connections?: number
}

export interface SelectedEntity {
  id: string
  name: string
  type: string
  group: string
  connections?: { total: number; [key: string]: any } | any
  description?: string
  confidence?: number
  degree?: number
  cluster?: string
  centrality?: number
  relatedEntities?: Array<{ id: string; name: string; relation: string; strength: number }>
  sources?: Array<{ title: string; ref: string; verified: boolean }>
  timeline?: Array<{ date: string; event: string }>
}

export interface KnowledgeGraphFullData extends KnowledgeGraphData {
  statistics?: GraphStatistics
  topEntities?: TopEntityItem[]
  selectedEntity?: SelectedEntity | null
  entityTypes?: GraphEntityTypeItem[]
}

const DEFAULT_GRAPH_DATA: KnowledgeGraphFullData = {
  nodes: [
    { id: "1", label: "Rasulullah ﷺ", group: "History", weight: 100 },
    { id: "2", label: "Abu Bakr Ash-Shiddiq", group: "History", weight: 90 },
    { id: "3", label: "Umar bin Khattab", group: "History", weight: 90 },
    { id: "4", label: "Utsman bin Affan", group: "History", weight: 85 },
    { id: "5", label: "Ali bin Abi Thalib", group: "History", weight: 85 },
    { id: "6", label: "Madinah Al-Munawwarah", group: "History", weight: 95 },
    { id: "7", label: "Makkah Al-Mukarramah", group: "History", weight: 95 },
  ],
  edges: [
    { source: "1", target: "2", relation: "authenticates" },
    { source: "1", target: "3", relation: "authenticates" },
    { source: "1", target: "4", relation: "authenticates" },
    { source: "1", target: "5", relation: "authenticates" },
    { source: "1", target: "6", relation: "references" },
  ],
  statistics: {
    totalEntities: 114,
    totalConnections: 6236,
    activeRelations: 77449,
    dataSources: 9,
    lastUpdated: "REALTIME LIVE",
  },
  topEntities: [
    { n: "Rasulullah ﷺ", col: "text-emerald-400", i: "Users", c: 6236 },
    { n: "Makkah", col: "text-amber-400", i: "Map", c: 489 },
    { n: "Madinah", col: "text-cyan-400", i: "Map", c: 512 },
    { n: "Bukhari", col: "text-fuchsia-400", i: "BookOpen", c: 7563 },
  ],
  entityTypes: [
    { id: "prophets", n: "Prophets & Messengers", c: 25, col: "text-emerald-400", i: "Users" },
    { id: "companions", n: "Companions (Sahabah)", c: 313, col: "text-cyan-400", i: "Users" },
    { id: "places", n: "Sacred Sites & Cities", c: 48, col: "text-amber-400", i: "Map" },
    { id: "scriptures", n: "Scriptures & Books", c: 9, col: "text-fuchsia-400", i: "BookOpen" },
  ],
  selectedEntity: {
    id: "1",
    name: "Rasulullah Muhammad ﷺ",
    type: "Prophet & Messenger",
    group: "prophets",
    description: "The Seal of the Prophets, mercy to all worlds (Rahmatan lil 'Alamin).",
    confidence: 100,
    degree: 6236,
    cluster: "Core Divine Prophecy",
    centrality: 0.999,
    relatedEntities: [
      { id: "2", name: "Abu Bakr Ash-Shiddiq", relation: "Closest Companion", strength: 98 },
      { id: "3", name: "Umar bin Khattab", relation: "Companion & Advisor", strength: 95 },
      { id: "6", name: "Madinah Al-Munawwarah", relation: "City of the Prophet", strength: 100 },
    ],
    sources: [
      { title: "Sahih Al-Bukhari", ref: "Kitab Bad'il Wahyi", verified: true },
      { title: "Sahih Muslim", ref: "Kitab Al-Iman", verified: true },
      { title: "Al-Qur'an Al-Karim", ref: "Surah Al-Ahzab: 40", verified: true },
    ],
    timeline: [
      { date: "571 CE", event: "Birth in Makkah (Year of the Elephant)" },
      { date: "610 CE", event: "First Revelation in Cave Hira (Surah Al-Alaq)" },
      { date: "622 CE", event: "Hijrah to Madinah (Year 1 Hijri)" },
      { date: "632 CE", event: "Hajjat al-Wada & Wafat in Madinah" },
    ],
  },
}

export function useKnowledgeGraph(initialData?: KnowledgeGraphFullData) {
  const [rawData, setRawData] = useState<KnowledgeGraphFullData>(
    initialData || DEFAULT_GRAPH_DATA
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<KnowledgeGraphFilter>({
    selectedGroups: [],
    searchQuery: "",
    minWeight: 0,
  })
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)

  const filteredNodes = useMemo(() => {
    return (rawData.nodes || []).filter((node) => {
      if (
        filters.selectedGroups.length > 0 &&
        !filters.selectedGroups.includes(node.group)
      ) {
        return false
      }
      if (
        filters.searchQuery &&
        !node.label.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false
      }
      if (node.weight < filters.minWeight) {
        return false
      }
      return true
    })
  }, [rawData.nodes, filters])

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map((n) => n.id))
    return (rawData.edges || []).filter(
      (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
    )
  }, [rawData.edges, filteredNodes])

  const data: KnowledgeGraphFullData = useMemo(
    () => ({
      ...rawData,
      nodes: filteredNodes,
      edges: filteredEdges,
    }),
    [rawData, filteredNodes, filteredEdges]
  )

  return {
    data,
    loading,
    error,
    nodes: filteredNodes,
    edges: filteredEdges,
    totalNodes: rawData.nodes.length,
    totalEdges: rawData.edges.length,
    selectedNode,
    setSelectedNode,
    filters,
    setFilters,
    setData: setRawData,
  }
}
