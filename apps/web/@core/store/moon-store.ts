import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { MoonClient } from "@moon/client"

// Instantiate globally to prevent reconnection loops during React re-renders
export const moonClientInstance = new MoonClient({
  baseUrl:
    typeof window === "undefined"
      ? process.env.MOON_API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://127.0.0.1:4000"
      : "/api/backend",
  onUnauthorized: () => {
    // This will be called by MoonClient if API returns 401
    void useMoonStore.getState().logout()
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login"
    }
  },
})

interface MoonState {
  client: MoonClient
  isConnected: boolean
  user: any | null
  activeConnections: number
  hasCompletedOnboarding: boolean
  login: (email: string, pass: string) => Promise<void>
  register: (email: string, pass: string, name?: string) => Promise<void>
  forgotPassword: (email: string) => Promise<any>
  verifyOtp: (email: string, code: string) => Promise<any>
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<any>
  logout: () => Promise<void>
  completeOnboarding: () => void
  request: (method: string, path: string, data?: any) => Promise<any>
  subscribe: (topic: string, callback: (data: any) => void) => () => void
}

export const useMoonStore = create<MoonState>()(
  persist(
    (set, get) => {
      // Example of global listening for system health/connections
      moonClientInstance.subscribe("system_connections", (data) => {
        if (data && typeof data.activeCount === "number") {
          set({ activeConnections: data.activeCount })
        }
      })

      return {
        client: moonClientInstance,
        isConnected: true,
        user: null,
        activeConnections: 0,
        hasCompletedOnboarding: false,

        completeOnboarding: () => {
          set({ hasCompletedOnboarding: true })
        },

        login: async (email, pass) => {
          try {
            const response = await fetch("/api/auth/session/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password: pass }),
            })
            const result = await response.json()
            if (!response.ok) {
              throw new Error(result.error || "Login failed")
            }
            set({ user: result.user })
          } catch (err) {
            console.error("MoonStore Login Failed:", err)
            throw err
          }
        },

        register: async (email, pass, name) => {
          try {
            const response = await fetch("/api/auth/session/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password: pass, name }),
            })
            const result = await response.json()
            if (!response.ok) {
              throw new Error(result.error || "Registration failed")
            }
            set({ user: result.user })
          } catch (err) {
            console.error("MoonStore Register Failed:", err)
            throw err
          }
        },

        forgotPassword: async (email) => {
          try {
            return await moonClientInstance.forgotPassword(email)
          } catch (err) {
            console.error("MoonStore ForgotPassword Failed:", err)
            throw err
          }
        },

        verifyOtp: async (email, code) => {
          try {
            return await moonClientInstance.verifyOtp(email, code)
          } catch (err) {
            console.error("MoonStore VerifyOtp Failed:", err)
            throw err
          }
        },

        resetPassword: async (email, code, newPassword) => {
          try {
            return await moonClientInstance.resetPassword(
              email,
              code,
              newPassword
            )
          } catch (err) {
            console.error("MoonStore ResetPassword Failed:", err)
            throw err
          }
        },

        logout: async () => {
          try {
            await fetch("/api/auth/session/logout", { method: "POST" })
          } finally {
            moonClientInstance.setToken("")
            set({ user: null })
          }
        },

        request: async (method, path, data) => {
          return await moonClientInstance.request(method, path, data)
        },

        subscribe: (topic, callback) => {
          return moonClientInstance.subscribe(topic, callback)
        },
      }
    },
    {
      name: "moon_store", // name of item in storage
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
)

// Remove browser-readable credentials persisted by pre-HttpOnly session builds.
if (typeof window !== "undefined") {
  localStorage.removeItem("moon_store")
}
