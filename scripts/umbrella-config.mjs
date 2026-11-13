import fs from "node:fs"
import path from "node:path"

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

export function loadUmbrellaConfig(rootDir) {
  const configDir = path.join(rootDir, ".audit", "config")
  const scoringConfig = readJson(path.join(configDir, "scoring.v1.json"))
  const evidenceConfig = readJson(path.join(configDir, "evidence.v1.json"))
  const hygieneConfig = readJson(path.join(configDir, "hygiene.v1.json"))
  const complexityConfig = readJson(path.join(configDir, "complexity.v1.json"))
  const qualityConfig = readJson(path.join(configDir, "quality.v1.json"))
  const futureBaseline = readJson(path.join(configDir, "future-baseline.v1.json"))
  const progressConfig = readJson(path.join(configDir, "progress.v1.json"))
  const inventoryConfig = readJson(path.join(configDir, "inventory.v1.json"))

  const config = {
    ...scoringConfig,
    audit_configs: {
      evidence: evidenceConfig,
      hygiene: hygieneConfig,
      complexity: complexityConfig,
      quality: qualityConfig,
      future_baseline: futureBaseline,
      progress: progressConfig,
      inventory: inventoryConfig,
    },
  }

  return {
    configDir,
    config,
    scoringConfig,
    evidenceConfig,
    hygieneConfig,
    complexityConfig,
    qualityConfig,
    futureBaseline,
    progressConfig,
    inventoryConfig,
  }
}
