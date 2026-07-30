import { useState, useEffect } from "react";
import { apiClient } from "../api/client";
import { API_ENDPOINTS } from "../api/endpoints";

export type GraphNode = {
  id: string
  label: string
  type?: string
  name?: string
  description?: string
  connections?: number
  [key: string]: unknown
}

export type GraphEdge = {
  source: string
  target: string
  label?: string
  [key: string]: unknown
}

export type GraphData = {
  nodes?: Array<GraphNode>
  edges?: Array<GraphEdge>
  statistics?: {
    totalEntities: number | string;
    totalConnections: number | string;
    activeRelations: number | string;
    dataSources: number | string;
    lastUpdated: string;
  }
  selectedEntity?: Record<string, any>;
  [key: string]: unknown
}

export function useKnowledgeGraph() {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ success: boolean; data: GraphData }>(API_ENDPOINTS.KNOWLEDGE.GRAPH);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError("Failed to parse knowledge graph data");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred fetching the graph");
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  return { data, loading, error };
}
