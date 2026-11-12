import {
  EMBEDDING_CONTRACT_VERSION,
  EmbeddingProviderUnavailableError,
  type EmbeddingContract,
  type EmbeddingProvider,
} from "./semantic-search.js"

export type OpenAICompatibleEmbeddingConfig = {
  endpoint: string
  apiKey: string
  provider: string
  model: string
  modelVersion: string
  dimensions: number
  textNormalizationVersion: string
}

type EmbeddingResponse = {
  model?: unknown
  data?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function validateConfig(config: OpenAICompatibleEmbeddingConfig): void {
  const endpoint = new URL(config.endpoint)
  if (
    (endpoint.protocol !== "https:" &&
      !(process.env.NODE_ENV !== "production" && endpoint.protocol === "http:")) ||
    !config.apiKey.trim() ||
    !config.provider.trim() ||
    !config.model.trim() ||
    !config.modelVersion.trim() ||
    !Number.isInteger(config.dimensions) ||
    config.dimensions <= 0 ||
    !config.textNormalizationVersion.trim()
  ) {
    throw new Error("Invalid OpenAI-compatible embedding provider configuration")
  }
}

export function createOpenAICompatibleEmbeddingProvider(
  config: OpenAICompatibleEmbeddingConfig,
  request: typeof fetch = fetch
): EmbeddingProvider {
  validateConfig(config)

  const contract: EmbeddingContract = {
    contractVersion: EMBEDDING_CONTRACT_VERSION,
    provider: config.provider,
    model: config.model,
    modelVersion: config.modelVersion,
    dimensions: config.dimensions,
    textNormalizationVersion: config.textNormalizationVersion,
  }

  return {
    contract,
    async embed(texts) {
      if (texts.length === 0) return []

      const response = await request(config.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.model,
          input: texts,
          dimensions: config.dimensions,
        }),
      })
      if (!response.ok) {
        throw new Error(
          `Embedding provider request failed with HTTP ${response.status}`
        )
      }

      const payload = (await response.json()) as EmbeddingResponse
      if (
        payload.model !== undefined &&
        payload.model !== config.model
      ) {
        throw new Error("Embedding provider returned a different model")
      }
      if (!Array.isArray(payload.data) || payload.data.length !== texts.length) {
        throw new Error("Embedding provider returned an invalid result count")
      }

      const indexed = payload.data.map((entry) => {
        if (
          !isRecord(entry) ||
          !Number.isInteger(entry.index) ||
          !Array.isArray(entry.embedding) ||
          entry.embedding.length !== config.dimensions ||
          entry.embedding.some(
            (value) => typeof value !== "number" || !Number.isFinite(value)
          )
        ) {
          throw new Error("Embedding provider returned an invalid vector")
        }
        return {
          index: entry.index as number,
          embedding: entry.embedding as number[],
        }
      })
      indexed.sort((left, right) => left.index - right.index)
      if (indexed.some((entry, index) => entry.index !== index)) {
        throw new Error("Embedding provider returned duplicate or missing indexes")
      }

      return indexed.map((entry) => entry.embedding)
    },
  }
}

export function createEmbeddingProviderFromEnvironment(
  environment: NodeJS.ProcessEnv = process.env
): EmbeddingProvider | undefined {
  const endpoint = environment.EMBEDDING_API_URL?.trim()
  const apiKey = environment.EMBEDDING_API_KEY?.trim()
  const model = environment.EMBEDDING_MODEL?.trim()
  const modelVersion = environment.EMBEDDING_MODEL_VERSION?.trim()
  const dimensions = Number(environment.EMBEDDING_DIMENSIONS)

  if (!endpoint && !apiKey && !model && !modelVersion) return undefined
  if (!endpoint || !apiKey || !model || !modelVersion) {
    throw new EmbeddingProviderUnavailableError(
      "Embedding provider configuration is incomplete"
    )
  }

  return createOpenAICompatibleEmbeddingProvider({
    endpoint,
    apiKey,
    provider: environment.EMBEDDING_PROVIDER?.trim() || "openai-compatible",
    model,
    modelVersion,
    dimensions,
    textNormalizationVersion:
      environment.EMBEDDING_TEXT_NORMALIZATION_VERSION?.trim() ||
      "arabic-normalization.v1",
  })
}
