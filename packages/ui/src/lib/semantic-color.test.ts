import { describe, expect, it } from "vitest"
import { isSemanticColorToken, resolveSemanticColor } from "./semantic-color"

describe("semantic color resolver", () => {
  it("resolves UI and registered domain tokens", () => {
    expect(resolveSemanticColor("primary")).toBe("var(--primary)")
    expect(resolveSemanticColor("tajweed.ghunnah")).toBe("var(--tajweed-ghunnah)")
  })
  it("rejects raw colors and unknown names", () => {
    expect(isSemanticColorToken("#22c55e")).toBe(false)
    expect(isSemanticColorToken("unknown")).toBe(false)
  })
})
