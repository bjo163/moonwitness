import { describe, expect, it } from "vitest"
import { getEndpointRegistry } from "./registry"

describe("protocol endpoint registry", () => {
  it("contains unique named endpoints with absolute paths", () => {
    const endpoints = getEndpointRegistry()
    const keys = endpoints.map(
      (endpoint) => `${endpoint.method}:${endpoint.path}`
    )
    expect(new Set(keys).size).toBe(keys.length)
    expect(endpoints.every((endpoint) => endpoint.path.startsWith("/"))).toBe(
      true
    )
  })
})
