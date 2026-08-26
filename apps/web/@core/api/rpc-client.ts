import axios, { AxiosInstance } from "axios"
import { getAuthToken } from "./auth-token"

// Default to Fastify backend port 4000
const BASE_URL =
  typeof window === "undefined"
    ? process.env.MOON_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000"
    : "/api/backend"

export class OdooRpcClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 15000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.client.interceptors.request.use((config) => {
      const token = getAuthToken()
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })
  }

  /**
   * Universal RPC Call to the backend.
   * @param model - The model name (e.g. 'res.user')
   * @param method - The method to call (e.g. 'searchRead', 'create')
   * @param args - Positional arguments
   * @param kwargs - Keyword arguments / options (e.g., limit, offset)
   */
  async call<T = any>(
    model: string,
    method: string,
    args: any[] = [],
    kwargs: Record<string, any> = {}
  ): Promise<T> {
    const payload = {
      model,
      method,
      args,
      kwargs,
    }

    try {
      const response = await this.client.post("/rpc", payload)
      return response.data.result as T
    } catch (error: any) {
      console.error(
        `RPC Error [${model}.${method}]:`,
        error?.response?.data || error.message
      )
      throw new Error(error?.response?.data?.error || "Unknown RPC Error")
    }
  }
}

export const rpc = new OdooRpcClient()
