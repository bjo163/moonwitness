import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"

export const AUTH_INVALIDATED_EVENT = "mw_auth_session_invalidated"

export const apiClient: AxiosInstance = axios.create({
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Browser JavaScript never reads or injects the upstream bearer. Authentication
// is carried only by the server-owned HttpOnly session cookie to same-origin BFFs.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_INVALIDATED_EVENT))
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
