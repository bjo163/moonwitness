import { describe, expect, it, vi } from "vitest"
import { OdooClient } from "../src/client.js"

describe("OdooClient session bridge", () => {
  it("authenticates, calls a model with the session cookie, and logs out", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ result: { uid: 7, session_id: "session-7", username: "user@example.com", name: "User" } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ result: [{ id: 7, login: "user@example.com" }] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ result: true }), { status: 200 }))
    const client = new OdooClient({ baseUrl: "http://odoo.test", database: "moon", fetch: fetcher })

    const session = await client.authenticateSession("user@example.com", "secret")
    expect(session.uid).toBe(7)
    expect(session.sessionId).toBe("session-7")
    await client.callWithSession(session.sessionId, { model: "res.users", method: "read", args: [[7]] })
    await client.logoutSession(session.sessionId)

    expect(fetcher.mock.calls[1]?.[1]).toMatchObject({ headers: { Cookie: "session_id=session-7" } })
    expect(fetcher.mock.calls[1]?.[0]).toContain("/web/dataset/call_kw/res.users/read")
    expect(fetcher.mock.calls[2]?.[0]).toContain("/web/session/destroy")
  })

  it("rejects invalid Odoo authentication", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: false }), { status: 200 }))
    const client = new OdooClient({ baseUrl: "http://odoo.test", database: "moon", fetch: fetcher })
    await expect(client.authenticateSession("user@example.com", "bad")).rejects.toMatchObject({ status: 401 })
  })
})
