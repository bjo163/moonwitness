export interface RiotConfig {
  baseUrl: string
  token: string
}

export interface ConnectorProvider {
  readonly id: string
  readonly kind: string
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export type QueryValue = string | number | boolean | undefined

export interface RequestOptions {
  query?: Record<string, QueryValue>
  body?: unknown
  headers?: Record<string, string>
}