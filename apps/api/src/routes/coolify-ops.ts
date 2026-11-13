import { z } from "zod"
import { defineRoute } from "@moon/server"
import {
  CoolifyOpsDeploymentResponseSchema,
  CoolifyOpsDeployResponseSchema,
  CoolifyOpsLogsResponseSchema,
  CoolifyOpsResourcesResponseSchema,
} from "@moon/protocol"
import {
  getCoolifyApplicationLogs,
  getCoolifyDeployment,
  listCoolifyResources,
  triggerCoolifyDeploy,
} from "../services/coolify-ops.js"

const uuidParams = z.object({ uuid: z.string().min(1) })

export function registerCoolifyOpsRoutes(): void {
  defineRoute({
    method: "GET",
    path: "/api/command-center/coolify/resources",
    auth: "admin",
    tags: ["Coolify Ops"],
    summary: "List Coolify applications, services, and databases (secrets stripped)",
    response: CoolifyOpsResourcesResponseSchema,
    handler: async () => ({ success: true as const, data: await listCoolifyResources() }),
  })

  defineRoute({
    method: "GET",
    path: "/api/command-center/coolify/deployments/:deploymentUuid",
    auth: "admin",
    tags: ["Coolify Ops"],
    summary: "Get a Coolify deployment record with parsed build logs",
    schema: { params: z.object({ deploymentUuid: z.string().min(1) }) },
    response: CoolifyOpsDeploymentResponseSchema,
    handler: async ({ params }) => ({
      success: true as const,
      data: await getCoolifyDeployment(params.deploymentUuid!),
    }),
  })

  defineRoute({
    method: "POST",
    path: "/api/command-center/coolify/deploy/:uuid",
    auth: "admin",
    tags: ["Coolify Ops"],
    summary: "Queue a Coolify deployment and return its deployment handle",
    schema: { params: uuidParams, body: z.object({ force: z.boolean().optional() }) },
    response: CoolifyOpsDeployResponseSchema,
    handler: async ({ params, body }) => ({
      success: true as const,
      data: await triggerCoolifyDeploy(params.uuid!, body.force),
    }),
  })

  defineRoute({
    method: "GET",
    path: "/api/command-center/coolify/applications/:uuid/logs",
    auth: "admin",
    tags: ["Coolify Ops"],
    summary: "Read runtime container logs for a Coolify application",
    schema: {
      params: uuidParams,
      query: z.object({ lines: z.coerce.number().int().min(1).max(2000).optional() }),
    },
    response: CoolifyOpsLogsResponseSchema,
    handler: async ({ params, query }) => ({
      success: true as const,
      data: await getCoolifyApplicationLogs(params.uuid!, query.lines === undefined ? undefined : Number(query.lines)),
    }),
  })
}