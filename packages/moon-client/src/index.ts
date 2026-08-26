export interface MoonClientConfig {
  baseUrl: string
  token?: string
  onUnauthorized?: () => void
}

export class ClientQueryBuilder<T = any> {
  private client: MoonClient
  private model: string
  private _domain: Record<string, any> = {}
  private _with: string[] = []
  private _page = 1
  private _limit = 50

  constructor(client: MoonClient, model: string) {
    this.client = client
    this.model = model
  }

  where(field: string, value: any): this {
    this._domain[field] = value
    return this
  }

  with(relation: string): this {
    this._with.push(relation)
    return this
  }

  limit(n: number): this {
    this._limit = n
    return this
  }

  page(p: number): this {
    this._page = p
    return this
  }

  async fetch(): Promise<T[]> {
    const res = await this.paginate()
    return res.data || []
  }

  async first(): Promise<T | null> {
    this._limit = 1
    const res = await this.paginate()
    return res.data.length > 0 ? (res.data[0] ?? null) : null
  }

  async paginate(): Promise<{ data: T[], meta: any }> {
    const query = new URLSearchParams()
    query.set('page', this._page.toString())
    query.set('limit', this._limit.toString())
    if (this._with.length > 0) query.set('with', this._with.join(','))
    
    for (const [k, v] of Object.entries(this._domain)) {
      query.set(k, String(v))
    }

    return await this.client.request('GET', `/api/${this.model}?${query.toString()}`)
  }

  async create(data: Record<string, any>): Promise<any> {
    const res = await this.client.request('POST', `/api/${this.model}`, data)
    return res.data
  }

  async update(id: number, data: Record<string, any>): Promise<any> {
    const res = await this.client.request('PUT', `/api/${this.model}/${id}`, data)
    return res.data
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.client.request('DELETE', `/api/${this.model}/${id}`)
    return res.success
  }
}

export class MoonClient {
  public config: MoonClientConfig
  private eventSource?: EventSource
  private listeners: Map<string, Set<Function>> = new Map()
  private reconnectAttempt = 0
  private maxReconnectAttempts = 7
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null

  constructor(config: MoonClientConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl.replace(/\/$/, '')
    }
  }

  setToken(token: string) {
    this.config.token = token
  }

  model<T = any>(name: string) {
    return new ClientQueryBuilder<T>(this, name)
  }

  async request(method: string, path: string, body?: any) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`
    }

    try {
      const res = await fetch(`${this.config.baseUrl}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
      })

      if (res.status === 401 && this.config.onUnauthorized) {
        this.config.onUnauthorized()
      }

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || data.message || `API Error: ${res.status}`)
      }
      return data
    } catch (e: any) {
      throw new Error(`[MoonClient] ${method} ${path} failed: ${e.message}`)
    }
  }

  async rpc(model: string, method: string, args: any[] = [], kwargs: any = {}) {
    const res = await this.request('POST', '/rpc', { model, method, args, kwargs })
    return res.result
  }

  async login(email: string, password: string) {
    const res = await this.request('POST', '/auth/login', { email, password })
    this.setToken(res.token)
    return res
  }

  async register(email: string, password: string, name?: string) {
    const res = await this.request('POST', '/auth/register', { email, password, name })
    this.setToken(res.token)
    return res
  }

  async forgotPassword(email: string) {
    return await this.request('POST', '/auth/forgot-password', { email })
  }

  async verifyOtp(email: string, code: string) {
    return await this.request('POST', '/auth/verify-otp', { email, code })
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    return await this.request('POST', '/auth/reset-password', { email, code, newPassword })
  }

  private connectEventSource() {
    if (this.eventSource) {
      this.eventSource.close()
    }
    
    this.eventSource = new EventSource(`${this.config.baseUrl}/live`)
    
    this.eventSource.onopen = () => {
      console.log('[MoonClient] Realtime connection established.')
      this.reconnectAttempt = 0 // Reset backoff on success
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout)
        this.reconnectTimeout = null
      }
    }
    
    this.eventSource.onerror = (err) => {
      console.warn('[MoonClient] Realtime connection interrupted.', err)
      this.eventSource?.close()
      
      if (this.reconnectAttempt < this.maxReconnectAttempts) {
        const timeout = Math.pow(2, this.reconnectAttempt) * 1000 // Exponential backoff: 1s, 2s, 4s, 8s...
        console.log(`[MoonClient] Reconnecting in ${timeout}ms (Attempt ${this.reconnectAttempt + 1})`)
        
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout)
        this.reconnectTimeout = setTimeout(() => {
          this.reconnectAttempt++
          this.connectEventSource()
        }, timeout)
      } else {
        console.error('[MoonClient] Max reconnect attempts reached. Please refresh.')
      }
    }
    
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.topic && this.listeners.has(data.topic)) {
          const topicListeners = this.listeners.get(data.topic)
          if (topicListeners) {
            for (const listener of topicListeners) {
              listener(data.payload)
            }
          }
        }
      } catch (e) {
        // ignore malformed events
      }
    }
  }

  // Pub/Sub Realtime
  subscribe<T = any>(topic: string, callback: (payload: T) => void) {
    if (typeof window === 'undefined') {
      // Return dummy unsubscribe function during SSR
      return () => {};
    }

    if (!this.eventSource && this.reconnectAttempt === 0) {
      this.connectEventSource()
    }

    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set())
    }
    this.listeners.get(topic)!.add(callback)

    return () => this.unsubscribe(topic, callback)
  }

  unsubscribe(topic: string, callback: (payload: any) => void) {
    if (this.listeners.has(topic)) {
      this.listeners.get(topic)!.delete(callback)
    }
  }
}
