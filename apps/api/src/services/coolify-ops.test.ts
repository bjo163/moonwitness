import { afterEach, describe, expect, it, vi } from "vitest"
import { RiotHttpError, RiotTimeoutError } from "@moon/riot"
import type { CoolifyProvider } from "@moon/riot-coolify"
import {
  getCoolifyApplicationLogs,
  getCoolifyDeployment,
  getCoolifyProvider,
  listCoolifyResources,
  triggerCoolifyDeploy,
} from "./coolify-ops.js"

function fakeProvider(overrides: Partial<CoolifyProvider>): CoolifyProvider {
  return { id: "coolify", kind: "deployment", ...overrides } as CoolifyProvider
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("getCoolifyProvider", () => {
  it("returns 503 COOLIFY_NOT_CONFIGURED when env is missing", () => {
    vi.stubEnv("COOLIFY_BASE_URL", "")
    vi.stubEnv("COOLIFY_TOKEN", "")
    try {
      getCoolifyProvider()
      expect.unreachable("should have thrown")
    } catch (error) {
      expect((error as { statusCode: number }).statusCode).toBe(503)
      expect((error as { code: string }).code).toBe("COOLIFY_NOT_CONFIGURED")
    }
  })
})

describe("listCoolifyResources", () => {
  it("normalizes and sanitizes all three resource collections", async () => {
    const provider = fakeProvider({
      listResources: async (type) => {
        if (type === "application") {
          return [{ uuid: "app-1", name: "api", status: "running:healthy", fqdn: "https://x.test", sentinel_token: "leak" }]
        }
        if (type === "service") return [{ uuid: "svc-1", name: "stack", secret_key: "leak" }]
        return [{ uuid: "db-1", name: "pg", postgres_password: "leak" }]
      },
    })

    const data = await listCoolifyResources(provider)

    expect(data.applications).toEqual([
      { uuid: "app-1", name: "api", type: "application", status: "running:healthy", fqdn: "https://x.test" },
    ])
    expect(data.services).toEqual([{ uuid: "svc-1", name: "stack", type: "service", status: undefined, fqdn: null }])
    expect(data.databases).toEqual([{ uuid: "db-1", name: "pg", type: "database", status: undefined, fqdn: null }])
    expect(JSON.stringify(data)).not.toContain("leak")
  })

  it("maps upstream HTTP failures to 502 COOLIFY_UPSTREAM_ERROR without leaking the body", async () => {
    const provider = fakeProvider({
      listResources: async () => {
        throw new RiotHttpError(401, "https://coolify.test/api/v1/applications", { message: "Unauthenticated." })
      },
    })

    try {
      await listCoolifyResources(provider)
      expect.unreachable("should have thrown")
    } catch (error) {
      expect((error as { statusCode: number }).statusCode).toBe(502)
      expect((error as { code: string }).code).toBe("COOLIFY_UPSTREAM_ERROR")
      expect((error as Error).message).not.toContain("Unauthenticated")
    }
  })

  it("maps upstream timeouts to 504 COOLIFY_TIMEOUT", async () => {
    const provider = fakeProvider({
      listResources: async () => {
        throw new RiotTimeoutError("https://coolify.test/api/v1/applications", 30_000)
      },
    })

    await expect(listCoolifyResources(provider)).rejects.toMatchObject({ statusCode: 504, code: "COOLIFY_TIMEOUT" })
  })
})

describe("deployment and deploy operations", () => {
  it("passes through the parsed deployment record", async () => {
    const deployment = { uuid: "dep-1", status: "finished", logs: [{ output: "ok" }] }
    const provider = fakeProvider({ getDeployment: async () => deployment as never })

    await expect(getCoolifyDeployment("dep-1", provider)).resolves.toEqual(deployment)
  })

  it("forwards the force flag and returns the deployment handle", async () => {
    const deploy = vi.fn(async () => ({ deploymentUuid: "dep-2" }))
    const provider = fakeProvider({ deploy })

    const result = await triggerCoolifyDeploy("app-1", false, provider)

    expect(result).toEqual({ deploymentUuid: "dep-2" })
    expect(deploy).toHaveBeenCalledWith("app-1", { force: false })
  })
})

describe("getCoolifyApplicationLogs", () => {
  it("wraps runtime logs in the data shape and forwards lines", async () => {
    const getApplicationLogs = vi.fn(async () => "line1\nline2")
    const provider = fakeProvider({ getApplicationLogs })

    const result = await getCoolifyApplicationLogs("app-1", 50, provider)

    expect(result).toEqual({ logs: "line1\nline2" })
    expect(getApplicationLogs).toHaveBeenCalledWith("app-1", 50)
  })
})