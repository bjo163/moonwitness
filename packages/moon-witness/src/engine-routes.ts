import type { IncomingMessage, ServerResponse } from 'node:http'
import { createCtx, getModel } from '@moon/orm'
import { verifyToken } from '@moon/server'
import { globalRoutes } from '@moon/server/dist/router.ts'
import { WitnessEngineRegistry, WitnessEngineRuntime } from './services/engine-runtime.ts'
import { MoonOrmEngineRunStore } from './services/engine-store.ts'
import { createRevelationQueryModule } from './engines/revelation-query.ts'
import { createCrossScriptureComparisonModule } from './engines/cross-scripture.ts'
import { createFigureAnalysisModule, createTraditionTransmissionModule } from './engines/figure-tradition.ts'
import { createLexicalAnalysisModule } from './engines/lexical-analysis.ts'
import { createConceptEvidenceModule } from './engines/concept-evidence.ts'
import { createDivineExpressionModule } from './engines/divine-expression.ts'
import { createResearchHypothesisModule, createAiResearchSynthesisModule } from './engines/research-hypothesis.ts'

const MAX_BODY = 1024 * 1024
const HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
let registered = false
function send(res: ServerResponse, status: number, body: unknown): void { res.writeHead(status, HEADERS); res.end(JSON.stringify(body)) }
function auth(req: IncomingMessage, secret: string) { const decoded = verifyToken(req, secret); return createCtx(decoded.sub, {}, getModel as any) }
async function readBody(req: IncomingMessage): Promise<any> { let size = 0; const chunks: Buffer[] = []; for await (const chunk of req) { const part = Buffer.from(chunk as any); size += part.length; if (size > MAX_BODY) throw Object.assign(new Error('Request body exceeds 1 MiB limit'), { statusCode: 413 }); chunks.push(part) } try { return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {} } catch { throw Object.assign(new Error('Request body must be valid JSON'), { statusCode: 400 }) } }
function makeRegistry(): WitnessEngineRegistry { const result = new WitnessEngineRegistry(); for (const module of [createRevelationQueryModule(), createCrossScriptureComparisonModule(), createFigureAnalysisModule(), createTraditionTransmissionModule(), createLexicalAnalysisModule(), createConceptEvidenceModule(), createDivineExpressionModule(), createResearchHypothesisModule(), createAiResearchSynthesisModule()]) result.register(module); return result }
export function registerWitnessEngineRoutes(jwtSecret: string): void {
  if (registered) return; registered = true
  const runtime = new WitnessEngineRuntime(new MoonOrmEngineRunStore(), { registry: makeRegistry() })
  const guarded = (handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>) => async (req: IncomingMessage, res: ServerResponse) => { try { await handler(req, res) } catch (error: any) { const status = error?.statusCode === 413 ? 413 : error?.statusCode === 401 || error?.message?.toLowerCase().includes('token') ? 401 : 400; send(res, status, { error: status === 401 ? 'Authentication required' : error.message || 'Engine request failed' }) } }
  globalRoutes.push({ method: 'GET', path: '/api/witness/engine/modules', handler: guarded(async (req, res) => { auth(req, jwtSecret); send(res, 200, { modules: runtime.listModules() }) }) })
  globalRoutes.push({ method: 'POST', path: '/api/witness/engine/run', handler: guarded(async (req, res) => { const ctx = auth(req, jwtSecret); const input = await readBody(req); if (typeof input.moduleCode !== 'string' || typeof input.moduleVersion !== 'string') return send(res, 400, { error: 'moduleCode and moduleVersion are required' }); send(res, 200, await runtime.runModule(ctx, { moduleCode: input.moduleCode, moduleVersion: input.moduleVersion, input: input.input ?? {}, ai: input.ai })) }) })
  globalRoutes.push({ method: 'POST', path: '/api/witness/engine/runs/:runId/replay', handler: guarded(async (req, res) => { const ctx = auth(req, jwtSecret); const runId = Number((req as any).params?.runId); if (!Number.isSafeInteger(runId) || runId < 1) return send(res, 400, { error: 'runId must be a positive integer' }); send(res, 200, await runtime.replayRun(ctx, String(runId))) }) })
  globalRoutes.push({ method: 'GET', path: '/api/witness/engine/runs/:runId/result', handler: guarded(async (req, res) => { const ctx = auth(req, jwtSecret); const runId = Number((req as any).params?.runId); if (!Number.isSafeInteger(runId) || runId < 1) return send(res, 400, { error: 'runId must be a positive integer' }); const result = await runtime.getResult(ctx, String(runId)); if (!result) return send(res, 404, { error: 'Engine result not found' }); send(res, 200, result) }) })
  globalRoutes.push({ method: 'POST', path: '/api/witness/engine/runs/:runId/explain', handler: guarded(async (req, res) => { const ctx = auth(req, jwtSecret); const runId = Number((req as any).params?.runId); const input = await readBody(req); if (!Number.isSafeInteger(runId) || runId < 1 || typeof input.findingKey !== 'string' || !input.findingKey.trim()) return send(res, 400, { error: 'runId and findingKey are required' }); send(res, 200, await runtime.explainFinding(ctx, String(runId), input.findingKey)) }) })
}
