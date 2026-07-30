import axios from "axios"
import { API_ENDPOINTS } from "./endpoints"
import { mockKnowledgeGraphResponse } from "../db/data/knowledge-graph.db"

// Simulated network delay
const MOCK_NETWORK_LATENCY_MS = 600
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // In a real app, inject Auth Tokens here
    // const token = useAuthStore.getState().token;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor (and Fake DB Adapter)
apiClient.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    // FAKE DB ADAPTER INTERCEPTOR
    // If the URL matches our mock endpoints and it fails (e.g. 404 because there's no actual API),
    // we intercept the error and return the mock data instead.

    const config = error.config
    if (!config || !config.url) return Promise.reject(error)

    // Simulate network latency for fake endpoints
    await delay(MOCK_NETWORK_LATENCY_MS)

    // KNOWLEDGE GRAPH
    if (config.url === API_ENDPOINTS.KNOWLEDGE.GRAPH) {
      return Promise.resolve({
        data: mockKnowledgeGraphResponse,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      })
    }

    // TODO: Add other mock endpoints here (Telemetry, Alerts, etc.)

    return Promise.reject(error)
  }
)
