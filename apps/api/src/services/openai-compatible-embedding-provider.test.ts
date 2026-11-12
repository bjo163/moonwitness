import { describe, expect, it, vi } from "vitest"
import {
  createEmbeddingProviderFromEnvironment,
  createOpenAICompatibleEmbeddingProvider,
} from "./openai-compatible-embedding-provider.js"

function createMockRequest(response: { ok: boolean; status: number; json: () => Promise<unknown> }) {
  return vi.fn(async () => response as Response)
}

const config = {
  endpoint: "https://embeddings.example/v1/embeddings",
  apiKey: "test-key",
  provider: "test-provider",
  model: "test-model",
  modelVersion: "test-model-v1",
  dimensions: 2,
  textNormalizationVersion: "arabic-normalization.v1",
}

describe("OpenAI-compatible embedding provider", () => {
  it("sends the versioned model request and returns vectors by input index", async () => {
    const request = createMockRequest({
      ok: true,
      status: 200,
      json: async () => ({
        model: "test-model",
        data: [
          { index: 1, embedding: [0, 1] },
          { index: 0, embedding: [1, 0] },
        ],
      }),
    })
    const provider = createOpenAICompatibleEmbeddingProvider(config, request)

    await expect(provider.embed(["first", "second"])).resolves.toEqual([
      [1, 0],
      [0, 1],
    ])
    expect(provider.contract).toMatchObject({
      provider: "test-provider",
      model: "test-model",
      modelVersion: "test-model-v1",
      dimensions: 2,
    })
    expect(request).toHaveBeenCalledWith(
      config.endpoint,
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-key",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "test-model",
          input: ["first", "second"],
          dimensions: 2,
        }),
      })
    )
  })

  it("rejects unsuccessful provider responses", async () => {
    const request = createMockRequest({
      ok: false,
      status: 429,
      json: async () => ({}),
    })
    const provider = createOpenAICompatibleEmbeddingProvider(config, request)

    await expect(provider.embed(["query"])).rejects.toThrow(
      "HTTP 429"
    )
  })

  it("rejects vectors with invalid dimensions", async () => {
    const request = createMockRequest({
      ok: true,
      status: 200,
      json: async () => ({
        model: "test-model",
        data: [{ index: 0, embedding: [1] }],
      }),
    })
    const provider = createOpenAICompatibleEmbeddingProvider(config, request)

    await expect(provider.embed(["query"])).rejects.toThrow("invalid vector")
  })

  it("does not configure a provider when environment values are absent", () => {
    expect(createEmbeddingProviderFromEnvironment({})).toBeUndefined()
  })
})
