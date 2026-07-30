import { readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Vertex } from './base.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MODELS_DIR = __dirname

const INFRA_FILES = new Set([
  'base.ts',
  'base.js',
  'fields.ts',
  'fields.js',
  'index.ts',
  'index.js',
  'registry.ts',
  'registry.js',
  'schema-sync.ts',
  'schema-sync.js',
  'manifest.ts',
  'manifest.js',
  'seed.ts',
  'seed.js'
])

export const registry = new Map<string, typeof Vertex>()

function walk(dir: string): string[] {
  let results: string[] = []
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      results = results.concat(walk(fullPath))
    } else if (
      (entry.endsWith('.ts') || entry.endsWith('.js')) &&
      !INFRA_FILES.has(entry)
    ) {
      results.push(fullPath)
    }
  }
  return results
}

export function getRegistry(): Map<string, typeof Vertex> {
  return registry
}

export function registerModel(modelClass: typeof Vertex): void {
  if (modelClass._name) {
    registry.set(modelClass._name, modelClass)
  }
}

export async function loadModels(): Promise<void> {
  const files = walk(MODELS_DIR)
  for (const fullPath of files) {
    const relPath = relative(MODELS_DIR, fullPath)
    const baseName = relPath.replace(/\.(ts|js)$/, '')
    try {
      const mod = await import(`./${baseName}.js`)
      const ModelClass = mod.default
      if (
        ModelClass &&
        typeof ModelClass === 'function' &&
        ModelClass._name
      ) {
        registry.set(ModelClass._name, ModelClass)
      }
    } catch (err) {
      console.error(`Failed to load model ${relPath}:`, err)
    }
  }
}

export function getModel(
  name: string
): typeof Vertex | undefined {
  return registry.get(name)
}

export function getModelNames(): string[] {
  return Array.from(registry.keys())
}