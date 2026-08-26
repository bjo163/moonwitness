import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { STORAGE_KEYS } from "@workspace/types"

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    // 1. Check localStorage
    const localToken = localStorage.getItem(STORAGE_KEYS.SESSION)
    if (localToken) return localToken

    // 2. Check Cookie (mw_session)
    const match = document.cookie.match(/(?:^|; )mw_session=([^;]*)/)
    if (match && match[1]) return decodeURIComponent(match[1])
  } catch {
    // ignore
  }
  return null
}

export const apiClient: AxiosInstance = axios.create({
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor (Inject Auth Token)
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Optional: Handle redirect or broadcast session expiry
      console.warn("[MoonClient] Session expired or unauthorized.")
    }
    return Promise.reject(error)
  }
)

export async function apiGet<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.get<T>(url, config)
  return res.data
}

export async function apiPost<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.post<T>(url, data, config)
  return res.data
}

export async function apiPut<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.put<T>(url, data, config)
  return res.data
}

export async function apiDelete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.delete<T>(url, config)
  return res.data
}