import axios from "axios"
import { getAuthToken } from "./auth-token"

export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
apiClient.interceptors.response.use(
  async (response) => {
    return response
  },
  (error) => Promise.reject(error)
)
