export type OdooClientOptions = {
  baseUrl: string
  database: string
  username?: string
  password?: string
  apiKey?: string
  fetch?: typeof globalThis.fetch
}

export type OdooRequest = {
  model: string
  method: string
  args?: unknown[]
  kwargs?: Record<string, unknown>
}

export type OdooIdentity = { uid: number; login: string; name?: string; email?: string }
export type OdooSession = OdooIdentity & { sessionId: string }

export type OdooRecord = Record<string, unknown>

export class OdooError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = "OdooError"
  }
}

function upstreamStatus(status: number, message: string): number {
  if (/session expired|authentication|unauthorized/i.test(message)) return 401
  if (/not enough rights|access rights|forbidden|permission/i.test(message)) return 403
  if (/not found/i.test(message)) return 404
  if (/validation|constraint|invalid/i.test(message)) return 400
  return status
}

export class OdooClient {
  private readonly baseUrl: string
  private readonly fetcher: typeof globalThis.fetch

  constructor(private readonly options: OdooClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "")
    this.fetcher = options.fetch ?? globalThis.fetch
    if (!this.fetcher) throw new Error("A fetch implementation is required")
  }

  async call<T>(request: OdooRequest): Promise<T> {
    if (!this.options.apiKey) return this.callJsonRpc<T>(request)
    const response = await this.fetcher(`${this.baseUrl}/json/2/${request.model}/${request.method}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(this.options.apiKey ? { Authorization: `bearer ${this.options.apiKey}` } : {}),
        ...(this.options.database ? { "X-Odoo-Database": this.options.database } : {}),
      },
      body: JSON.stringify({ args: request.args ?? [], kwargs: request.kwargs ?? {} }),
    })
    const body = await response.json().catch(() => undefined)
    if (!response.ok) {
      const message = typeof body?.message === "string" ? body.message : `Odoo request failed (${response.status})`
      throw new OdooError(response.status, message)
    }
    return body as T
  }

  private async callJsonRpc<T>(request: OdooRequest): Promise<T> {
    if (!this.options.username || !this.options.password) {
      throw new OdooError(401, "Odoo credentials are required when ODOO_API_KEY is not configured")
    }
    const auth = await this.fetcher(`${this.baseUrl}/jsonrpc`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: {
        service: "common", method: "authenticate",
        args: [this.options.database, this.options.username, this.options.password, {}],
      }, id: Date.now() }),
    })
    const authBody = await auth.json().catch(() => undefined)
    const uid = authBody?.result
    if (!auth.ok || typeof uid !== "number") throw new OdooError(401, "Odoo authentication failed")
    const response = await this.fetcher(`${this.baseUrl}/jsonrpc`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: {
        service: "object", method: "execute_kw",
        args: [this.options.database, uid, this.options.password, request.model, request.method, request.args ?? [], request.kwargs ?? {}],
      }, id: Date.now() }),
    })
    const body = await response.json().catch(() => undefined)
    if (!response.ok || body?.error) {
      const message = body?.error?.data?.message || body?.error?.message || "Odoo JSON-RPC request failed"
      throw new OdooError(upstreamStatus(response.status || 502, message), message)
    }
    return body?.result as T
  }

  async health(): Promise<{ ok: true }> {
    await this.call({ model: "res.users", method: "search_count", args: [[]] })
    return { ok: true }
  }

  async authenticate(username: string, password: string): Promise<OdooIdentity> {
    const response = await this.fetcher(`${this.baseUrl}/jsonrpc`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: {
        service: "common", method: "authenticate",
        args: [this.options.database, username, password, {}],
      }, id: Date.now() }),
    })
    const body = await response.json().catch(() => undefined)
    if (!response.ok || typeof body?.result !== "number") throw new OdooError(401, "Odoo authentication failed")
    return { uid: body.result, login: username }
  }

  async authenticateSession(username: string, password: string): Promise<OdooSession> {
    const response = await this.fetcher(`${this.baseUrl}/web/session/authenticate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: {
        db: this.options.database, login: username, password,
      }, id: Date.now() }),
    })
    const body = await response.json().catch(() => undefined)
    const sessionIdFromBody = body?.result?.session_id
    const setCookie = response.headers.get("set-cookie") ?? ""
    const sessionCookieMatches = [...setCookie.matchAll(/(?:^|,\s*)session_id=([^;,\s]+)/g)]
    const sessionIdFromCookie = sessionCookieMatches.at(-1)?.[1]
    const sessionId = typeof sessionIdFromBody === "string" ? sessionIdFromBody : sessionIdFromCookie
    const uid = body?.result?.uid
    if (!response.ok || typeof uid !== "number" || typeof sessionId !== "string") {
      throw new OdooError(401, "Odoo session authentication failed")
    }
    return { uid, sessionId, login: String(body.result.username ?? username), name: body.result.name, email: body.result.user_context?.lang ? undefined : undefined }
  }

  async callWithSession<T>(sessionId: string, request: OdooRequest): Promise<T> {
    const response = await this.fetcher(`${this.baseUrl}/web/dataset/call_kw/${request.model}/${request.method}`, {
      method: "POST",
      headers: { "content-type": "application/json", Cookie: `session_id=${sessionId}` },
      body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: {
        model: request.model, method: request.method, args: request.args ?? [], kwargs: request.kwargs ?? {},
      }, id: Date.now() }),
    })
    const body = await response.json().catch(() => undefined)
    if (!response.ok || body?.error) {
      const message = body?.error?.data?.message || body?.error?.message || "Odoo session request failed"
      throw new OdooError(upstreamStatus(response.status || 502, message), message)
    }
    return body.result as T
  }

  async logoutSession(sessionId: string): Promise<void> {
    await this.fetcher(`${this.baseUrl}/web/session/destroy`, { method: "POST", headers: { "content-type": "application/json", Cookie: `session_id=${sessionId}` }, body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: {}, id: Date.now() }) })
  }

  async list(model: string, domain: unknown[] = [], fields: string[] = [], limit?: number, offset?: number): Promise<OdooRecord[]> {
    return this.call<OdooRecord[]>({ model, method: "search_read", args: [domain], kwargs: {
      ...(fields.length ? { fields } : {}), ...(limit === undefined ? {} : { limit }), ...(offset === undefined ? {} : { offset }),
    }})
  }

  async create(model: string, values: OdooRecord): Promise<number> {
    return this.call<number>({ model, method: "create", args: [values] })
  }

  async update(model: string, ids: number[], values: OdooRecord): Promise<boolean> {
    return this.call<boolean>({ model, method: "write", args: [ids, values] })
  }

  async delete(model: string, ids: number[]): Promise<boolean> {
    return this.call<boolean>({ model, method: "unlink", args: [ids] })
  }

  async count(model: string, domain: unknown[] = []): Promise<number> {
    return this.call<number>({ model, method: "search_count", args: [domain] })
  }

  readonly users = {
    list: (domain: unknown[] = [], fields: string[] = ["id", "name", "login", "company_id"]) =>
      this.call<Array<Record<string, unknown>>>({ model: "res.users", method: "search_read", args: [domain], kwargs: { fields } }),
  }

  readonly companies = {
    list: (domain: unknown[] = [], fields: string[] = ["id", "name"]) =>
      this.call<Array<Record<string, unknown>>>({ model: "res.company", method: "search_read", args: [domain], kwargs: { fields } }),
  }

  readonly projects = {
    list: (domain: unknown[] = [], fields: string[] = ["id", "name", "active", "company_id"]) =>
      this.call<Array<Record<string, unknown>>>({ model: "project.project", method: "search_read", args: [domain], kwargs: { fields } }),
  }

  readonly tasks = {
    list: (domain: unknown[] = [], fields: string[] = ["id", "name", "project_id", "stage_id", "user_ids", "date_deadline"]) =>
      this.call<Array<Record<string, unknown>>>({ model: "project.task", method: "search_read", args: [domain], kwargs: { fields } }),
  }
}
