import { existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'

export function findWorkspaceRoot(startDir: string = process.cwd()): string {
  let curr = startDir
  while (curr && curr !== dirname(curr)) {
    if (existsSync(join(curr, 'pnpm-workspace.yaml'))) {
      return curr
    }
    curr = dirname(curr)
  }
  return process.cwd()
}

export function loadJsonSeed<T = any>(filenameOrPkgName: string, packageFallbackDir?: string): T | null {
  const root = findWorkspaceRoot()
  const name = filenameOrPkgName.endsWith('.json') ? filenameOrPkgName : `${filenameOrPkgName}.json`
  const possiblePaths = [
    join(root, 'data', 'seeds', name),
    join(root, 'data', name),
    join(process.cwd(), 'data', 'seeds', name),
    join(process.cwd(), 'data', name),
    join(process.cwd(), '..', '..', 'data', 'seeds', name),
  ]

  if (packageFallbackDir) {
    possiblePaths.push(
      join(packageFallbackDir, 'data', name),
      join(packageFallbackDir, name)
    )
  }

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      try {
        const raw = readFileSync(p, 'utf8')
        return JSON.parse(raw) as T
      } catch (err) {
        console.warn(`[seed-loader] Failed to parse JSON seed from ${p}:`, err)
      }
    }
  }
  return null
}
