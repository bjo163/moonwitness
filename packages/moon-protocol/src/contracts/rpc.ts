/**
 * ◈ MOONWITNESS PROTOCOL — RPC CONTRACT
 *
 * Canonical request/response envelope for the `/rpc` dispatch endpoint.
 * Consumed by the runtime handler (handleRpc) and the OpenAPI generator.
 */
import { z } from 'zod'

export const RpcRequestSchema = z.object({
  model: z.string().min(1).describe('Target model name, e.g. "vx.user".'),
  method: z
    .string()
    .min(1)
    .describe('Method name to invoke. Dunder/private/forbidden names rejected at runtime.'),
  args: z
    .array(z.unknown())
    .optional()
    .describe('Positional arguments passed to the method.'),
  kwargs: z
    .record(z.unknown())
    .optional()
    .describe('Keyword arguments appended as the final positional arg.'),
})

export type RpcRequest = z.infer<typeof RpcRequestSchema>

export const RpcResponseSchema = z.object({
  result: z.unknown().describe('Method return value.'),
})

export type RpcResponse = z.infer<typeof RpcResponseSchema>
