import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MoonClient } from '@moon/client'

// Instantiate globally to prevent reconnection loops during React re-renders
export const moonClientInstance = new MoonClient({ 
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://api:4000' || 'http://localhost:4000', 
  onUnauthorized: () => {
    // This will be called by MoonClient if API returns 401
    useMoonStore.getState().logout()
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  }
})

interface MoonState {
  client: MoonClient;
  isConnected: boolean;
  user: any | null;
  activeConnections: number;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  verifyOtp: (email: string, code: string) => Promise<any>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<any>;
  logout: () => void;
  request: (method: string, path: string, data?: any) => Promise<any>;
  subscribe: (topic: string, callback: (data: any) => void) => () => void;
}

export const useMoonStore = create<MoonState>()(
  persist(
    (set, get) => {
      
      // Example of global listening for system health/connections
      moonClientInstance.subscribe('system_connections', (data) => {
        if (data && typeof data.activeCount === 'number') {
          set({ activeConnections: data.activeCount })
        }
      })

      return {
        client: moonClientInstance,
        isConnected: true,
        user: null,
        activeConnections: 0,

    login: async (email, pass) => {
      try {
        const res = await moonClientInstance.login(email, pass)
        // Store user details in state
        set({ user: { ...res.user, token: res.token } })
      } catch (err) {
        console.error("MoonStore Login Failed:", err)
        throw err
      }
    },

    register: async (email, pass, name) => {
      try {
        const res = await moonClientInstance.register(email, pass, name)
        // Store user details in state
        set({ user: { ...res.user, token: res.token } })
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
        return await moonClientInstance.resetPassword(email, code, newPassword)
      } catch (err) {
        console.error("MoonStore ResetPassword Failed:", err)
        throw err
      }
    },

    logout: () => {
      moonClientInstance.setToken('')
      set({ user: null })
      if (typeof window !== 'undefined') {
        localStorage.removeItem('moon_token')
      }
    },

    request: async (method, path, data) => {
      // Hydrate token to client if persisted
      const currentToken = get().user?.token;
      if (currentToken && !moonClientInstance.config.token) {
        moonClientInstance.setToken(currentToken)
      }
      return await moonClientInstance.request(method, path, data)
    },

    subscribe: (topic, callback) => {
      return moonClientInstance.subscribe(topic, callback)
    }
  }
},
{
  name: 'moon_store', // name of item in storage
  storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  })),
  partialize: (state) => ({ user: state.user }), // only persist the user (which includes token)
}
))

// Automatically hydrate client token on boot if it exists in local storage
if (typeof window !== 'undefined') {
  const storedData = localStorage.getItem('moon_store')
  if (storedData) {
    try {
      const parsed = JSON.parse(storedData)
      if (parsed.state?.user?.token) {
        moonClientInstance.setToken(parsed.state.user.token)
      }
    } catch (e) {}
  }
}
