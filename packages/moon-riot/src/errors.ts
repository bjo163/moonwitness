export class RiotError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'RiotError'
  }
}

export class RiotHttpError extends RiotError {
  readonly status: number
  readonly url: string
  readonly body: unknown

  constructor(status: number, url: string, body: unknown) {
    super(`HTTP ${status} for ${url}`)
    this.name = 'RiotHttpError'
    this.status = status
    this.url = url
    this.body = body
  }
}

export class RiotTimeoutError extends RiotError {
  constructor(url: string, timeoutMs: number) {
    super(`Request to ${url} timed out after ${timeoutMs}ms`)
    this.name = 'RiotTimeoutError'
  }
}