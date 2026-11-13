import { z } from 'zod'

export const CoolifyOpsResourceTypeSchema = z.enum(['application', 'service', 'database'])

export const CoolifyOpsResourceSchema = z.object({
  uuid: z.string(),
  name: z.string().optional(),
  type: CoolifyOpsResourceTypeSchema,
  status: z.string().optional(),
  fqdn: z.string().nullable().optional(),
})

export const CoolifyOpsResourcesDataSchema = z.object({
  applications: z.array(CoolifyOpsResourceSchema),
  services: z.array(CoolifyOpsResourceSchema),
  databases: z.array(CoolifyOpsResourceSchema),
})

export const CoolifyOpsResourcesResponseSchema = z.object({
  success: z.literal(true),
  data: CoolifyOpsResourcesDataSchema,
})

export const CoolifyOpsDeploymentLogSchema = z.object({
  output: z.string(),
  hidden: z.boolean().optional(),
  timestamp: z.string().optional(),
})

export const CoolifyOpsDeploymentSchema = z.object({
  uuid: z.string(),
  status: z.string(),
  commit: z.string().nullable().optional(),
  finished_at: z.string().nullable().optional(),
  application_name: z.string().optional(),
  logs: z.array(CoolifyOpsDeploymentLogSchema),
})

export const CoolifyOpsDeploymentResponseSchema = z.object({
  success: z.literal(true),
  data: CoolifyOpsDeploymentSchema,
})

export const CoolifyOpsDeployResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    deploymentUuid: z.string(),
  }),
})

export const CoolifyOpsLogsResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    logs: z.string(),
  }),
})

export type CoolifyOpsResource = z.infer<typeof CoolifyOpsResourceSchema>
export type CoolifyOpsResourcesData = z.infer<typeof CoolifyOpsResourcesDataSchema>
export type CoolifyOpsResourcesResponse = z.infer<typeof CoolifyOpsResourcesResponseSchema>
export type CoolifyOpsDeployment = z.infer<typeof CoolifyOpsDeploymentSchema>
export type CoolifyOpsDeploymentResponse = z.infer<typeof CoolifyOpsDeploymentResponseSchema>
export type CoolifyOpsDeployResponse = z.infer<typeof CoolifyOpsDeployResponseSchema>
export type CoolifyOpsLogsResponse = z.infer<typeof CoolifyOpsLogsResponseSchema>