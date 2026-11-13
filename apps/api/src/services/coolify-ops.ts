import { RiotError, RiotHttpError, RiotTimeoutError } from "@moon/riot"
import {
  createCoolifyProvider,
  sanitizeApplication,
  stripSensitive,
  type CoolifyProvider,
  type CoolifyResourceType,
} from "@moon/riot-coolify"
import type { CoolifyOpsDeployment, CoolifyOpsResource, CoolifyOpsResourcesData } from "@moon/protocol"

let cachedProvider: CoolifyProvider | null = null

export function getCoolifyProvider(): CoolifyProvider {
  if (cachedProvider) return cachedProvider
  try {
    cachedProvider = createCoolifyProvider()
    return cachedProvider
  } catch (error) {
    if (error instanceof RiotError) {
      throw Object.assign(new Error("Coolify connector is not configured (COOLIFY_BASE_URL / COOLIFY_TOKEN)"), {
        statusCode: 503,
        code: "COOLIFY_NOT_CONFIGURED",
      })
    }
    throw error
  }
}

function rethrowUpstream(error: unknown): never {
  if (error instanceof RiotHttpError) {
    throw Object.assign(new Error(`Coolify API request failed (HTTP ${error.status})`), {
      statusCode: 502,
      code: "COOLIFY_UPSTREAM_ERROR",
    })
  }
  if (error instanceof RiotTimeoutError) {
    throw Object.assign(new Error("Coolify API request timed out"), {
      statusCode: 504,
      code: "COOLIFY_TIMEOUT",
    })
  }
  throw error
}

function toResource(type: CoolifyResourceType, record: Record<string, unknown>): CoolifyOpsResource {
  const clean = type === "application" ? sanitizeApplication(record) : stripSensitive(record)
  return {
    uuid: String(clean.uuid ?? ""),
    name: typeof clean.name === "string" ? clean.name : undefined,
    type,
    status: typeof clean.status === "string" ? clean.status : undefined,
    fqdn: typeof clean.fqdn === "string" ? clean.fqdn : null,
  }
}

export async function listCoolifyResources(provider: CoolifyProvider = getCoolifyProvider()): Promise<CoolifyOpsResourcesData> {
  try {
    const [applications, services, databases] = await Promise.all([
      provider.listResources("application"),
      provider.listResources("service"),
      provider.listResources("database"),
    ])
    return {
      applications: applications.map((record: Record<string, unknown>) => toResource("application", record)),
      services: services.map((record: Record<string, unknown>) => toResource("service", record)),
      databases: databases.map((record: Record<string, unknown>) => toResource("database", record)),
    }
  } catch (error) {
    rethrowUpstream(error)
  }
}

export async function getCoolifyDeployment(
  deploymentUuid: string,
  provider: CoolifyProvider = getCoolifyProvider(),
): Promise<CoolifyOpsDeployment> {
  try {
    return await provider.getDeployment(deploymentUuid)
  } catch (error) {
    rethrowUpstream(error)
  }
}

export async function triggerCoolifyDeploy(
  uuid: string,
  force?: boolean,
  provider: CoolifyProvider = getCoolifyProvider(),
): Promise<{ deploymentUuid: string }> {
  try {
    return await provider.deploy(uuid, { force })
  } catch (error) {
    rethrowUpstream(error)
  }
}

export async function getCoolifyApplicationLogs(
  uuid: string,
  lines?: number,
  provider: CoolifyProvider = getCoolifyProvider(),
): Promise<{ logs: string }> {
  try {
    return { logs: await provider.getApplicationLogs(uuid, lines) }
  } catch (error) {
    rethrowUpstream(error)
  }
}