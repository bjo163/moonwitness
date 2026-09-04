import fs from "node:fs"
import path from "node:path"

function readText(rootDir, relativePath) {
  const fullPath = path.join(rootDir, relativePath)
  if (!fs.existsSync(fullPath)) throw new Error(`Inventory source not found: ${relativePath}`)
  return fs.readFileSync(fullPath, "utf8")
}

function stripQuotes(value) {
  return String(value || "").trim().replace(/^['"]|['"]$/g, "")
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => String(a).localeCompare(String(b)))
}

function parsePortConstants(text) {
  const block = text.match(/export\s+const\s+APP_PORTS\s*=\s*\{([\s\S]*?)\}\s*as\s+const/)
  if (!block) return {}
  const entries = {}
  for (const match of block[1].matchAll(/^\s*([A-Z][A-Z0-9_]*)\s*:\s*(\d+)\s*,?\s*$/gm)) {
    entries[match[1]] = Number(match[2])
  }
  return Object.fromEntries(Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)))
}

function parseEnvKeys(text) {
  const keys = []
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)=/)
    if (match) keys.push(match[1])
  }
  return uniqueSorted(keys)
}

function parsePortSpec(raw) {
  const value = stripQuotes(raw)
  const container = value.match(/:(\d+)\s*$/)
  const variable = value.match(/\$\{([A-Z][A-Z0-9_]*):-([0-9]+)\}/)
  return {
    raw: value,
    container_port: container ? Number(container[1]) : null,
    host_port_env: variable?.[1] || null,
    host_port_default: variable ? Number(variable[2]) : null,
  }
}

function parseCompose(text) {
  const lines = text.split(/\r?\n/)
  const services = []
  let inServices = false
  let current = null
  let subsection = null

  const finishCurrent = () => {
    if (!current) return
    current.environment_keys = uniqueSorted(current.environment_keys)
    current.env_references = uniqueSorted(current.env_references)
    current.depends_on = uniqueSorted(current.depends_on)
    current.health_endpoints = uniqueSorted(current.health_endpoints)
    current.ports.sort((a, b) => `${a.container_port}:${a.raw}`.localeCompare(`${b.container_port}:${b.raw}`))
    services.push(current)
    current = null
  }

  for (const line of lines) {
    if (/^[^\s#][^:]*:\s*$/.test(line)) {
      const topLevel = line.trim().slice(0, -1)
      if (topLevel === "services") {
        inServices = true
        continue
      }
      if (inServices) {
        finishCurrent()
        inServices = false
      }
    }
    if (!inServices) continue

    const serviceMatch = line.match(/^  ([A-Za-z0-9_-]+):\s*$/)
    if (serviceMatch) {
      finishCurrent()
      current = {
        name: serviceMatch[1],
        image: null,
        dockerfile: null,
        workspace_filter: null,
        environment_keys: [],
        env_references: [],
        ports: [],
        depends_on: [],
        health_endpoints: [],
      }
      subsection = null
      continue
    }
    if (!current) continue

    for (const match of line.matchAll(/\$\{([A-Z][A-Z0-9_]*)/g)) current.env_references.push(match[1])
    for (const match of line.matchAll(/(\/health\/[A-Za-z0-9_./-]+)/g)) current.health_endpoints.push(match[1])
    const filterMatch = line.match(/["']--filter["']\s*,\s*["']([^"']+)["']/)
    if (filterMatch) current.workspace_filter = filterMatch[1]

    const sectionMatch = line.match(/^    ([A-Za-z0-9_-]+):(?:\s*(.*))?$/)
    if (sectionMatch) {
      subsection = sectionMatch[1]
      const inline = stripQuotes(sectionMatch[2])
      if (subsection === "image" && inline) current.image = inline
      continue
    }

    if (subsection === "build") {
      const dockerfile = line.match(/^\s{6}dockerfile:\s*(.+?)\s*$/)
      if (dockerfile) current.dockerfile = stripQuotes(dockerfile[1])
    } else if (subsection === "environment") {
      const env = line.match(/^\s{6}([A-Z][A-Z0-9_]*):/)
      if (env) current.environment_keys.push(env[1])
    } else if (subsection === "ports") {
      const port = line.match(/^\s{6}-\s*(.+?)\s*$/)
      if (port) current.ports.push(parsePortSpec(port[1]))
    } else if (subsection === "depends_on") {
      const dependency = line.match(/^\s{6}([A-Za-z0-9_-]+):\s*$/)
      if (dependency) current.depends_on.push(dependency[1])
    }
  }
  finishCurrent()
  return services.sort((a, b) => a.name.localeCompare(b.name))
}

function discoverWorkspacePackages(rootDir, roots) {
  const packages = []
  const visit = (absoluteDir, relativeDir) => {
    if (!fs.existsSync(absoluteDir)) return
    for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue
      const absolute = path.join(absoluteDir, entry.name)
      const relative = path.posix.join(relativeDir.replaceAll("\\", "/"), entry.name)
      if (entry.isDirectory()) {
        visit(absolute, relative)
        continue
      }
      if (!entry.isFile() || entry.name !== "package.json") continue
      try {
        const parsed = JSON.parse(fs.readFileSync(absolute, "utf8"))
        const dependencyNames = uniqueSorted([
          ...Object.keys(parsed.dependencies || {}),
          ...Object.keys(parsed.devDependencies || {}),
          ...Object.keys(parsed.peerDependencies || {}),
          ...Object.keys(parsed.optionalDependencies || {}),
        ])
        packages.push({
          path: relative,
          name: parsed.name || null,
          private: Boolean(parsed.private),
          dependencies: dependencyNames,
        })
      } catch {
        packages.push({ path: relative, name: null, private: false, dependencies: [], parse_error: true })
      }
    }
  }
  for (const root of roots) visit(path.join(rootDir, root), root)
  return packages.sort((a, b) => a.path.localeCompare(b.path))
}

export function validateInventoryConfig(config) {
  const errors = []
  if (!Number.isInteger(config?.schema_version) || config.schema_version < 1) errors.push("schema_version must be positive")
  if (!config?.version) errors.push("version is required")
  for (const key of ["compose", "env_example", "port_constants"]) {
    if (!config?.sources?.[key]) errors.push(`sources.${key} is required`)
  }
  if (!Array.isArray(config?.sources?.workspace_roots) || config.sources.workspace_roots.length === 0) errors.push("sources.workspace_roots must be non-empty")
  if (!config?.application_port_map || typeof config.application_port_map !== "object") errors.push("application_port_map is required")
  if (errors.length) throw new Error(`Invalid inventory config:\n- ${errors.join("\n- ")}`)
  return true
}

export function collectServiceInventory(rootDir, config) {
  validateInventoryConfig(config)
  const composeText = readText(rootDir, config.sources.compose)
  const envText = readText(rootDir, config.sources.env_example)
  const constantsText = readText(rootDir, config.sources.port_constants)
  const services = parseCompose(composeText)
  const envExampleKeys = parseEnvKeys(envText)
  const portConstants = parsePortConstants(constantsText)
  const workspaces = discoverWorkspacePackages(rootDir, config.sources.workspace_roots)
  const serviceNames = new Set(services.map((service) => service.name))
  const workspaceNames = new Set(workspaces.map((workspace) => workspace.name).filter(Boolean))
  const envKeySet = new Set(envExampleKeys)
  const checks = []

  const addCheck = (id, passed, details = {}) => checks.push({ id, passed: Boolean(passed), details })

  for (const service of services) {
    for (const dependency of service.depends_on) {
      addCheck(`service:${service.name}:depends_on:${dependency}`, serviceNames.has(dependency), { service: service.name, dependency })
    }
    if (service.dockerfile) {
      addCheck(`service:${service.name}:dockerfile`, fs.existsSync(path.join(rootDir, service.dockerfile)), { service: service.name, path: service.dockerfile })
    }
    if (service.workspace_filter) {
      addCheck(`service:${service.name}:workspace_filter`, workspaceNames.has(service.workspace_filter), { service: service.name, workspace_filter: service.workspace_filter })
    }
    for (const envName of service.env_references) {
      addCheck(`service:${service.name}:env:${envName}`, envKeySet.has(envName), { service: service.name, env: envName })
    }
  }

  for (const [serviceName, constantName] of Object.entries(config.application_port_map).sort(([a], [b]) => a.localeCompare(b))) {
    const service = services.find((item) => item.name === serviceName)
    addCheck(`application:${serviceName}:service_exists`, Boolean(service), { service: serviceName })
    if (!service) continue
    const expectedPort = portConstants[constantName]
    const observedPorts = service.ports.map((item) => item.container_port).filter(Number.isFinite)
    addCheck(`application:${serviceName}:port_constant`, Number.isFinite(expectedPort), { service: serviceName, constant: constantName })
    if (!Number.isFinite(expectedPort)) continue
    addCheck(
      `application:${serviceName}:port_match`,
      observedPorts.includes(expectedPort),
      { service: serviceName, constant: constantName, expected_port: expectedPort, observed_ports: observedPorts },
    )
  }

  const hostDefaults = services
    .flatMap((service) => service.ports.map((port) => ({ service: service.name, port: port.host_port_default })).filter((item) => Number.isFinite(item.port)))
  const byHostPort = new Map()
  for (const item of hostDefaults) {
    const existing = byHostPort.get(item.port) || []
    existing.push(item.service)
    byHostPort.set(item.port, existing)
  }
  for (const [port, serviceList] of [...byHostPort.entries()].sort(([a], [b]) => a - b)) {
    addCheck(`host_port:${port}:unique`, serviceList.length === 1, { port, services: uniqueSorted(serviceList) })
  }

  const failedChecks = checks.filter((check) => !check.passed)
  const findings = failedChecks.map((check) => {
    let category = "inventory_drift"
    if (check.id.includes(":env:")) category = "env_contract_drift"
    else if (check.id.endsWith(":dockerfile")) category = "dockerfile_drift"
    else if (check.id.endsWith(":workspace_filter")) category = "workspace_filter_drift"
    else if (check.id.includes(":depends_on:")) category = "service_dependency_drift"
    else if (check.id.endsWith(":port_match")) category = "port_mismatch"
    else if (check.id.endsWith(":port_constant")) category = "missing_port_constant"
    else if (check.id.startsWith("host_port:")) category = "duplicate_host_port"
    else if (check.id.endsWith(":service_exists")) category = "missing_service"
    return { category, check_id: check.id, ...check.details }
  }).sort((a, b) => `${a.category}:${a.check_id}`.localeCompare(`${b.category}:${b.check_id}`))

  const passed = checks.filter((check) => check.passed).length
  const value = checks.length === 0 ? null : Number(((passed / checks.length) * 100).toFixed(2))
  const inventory = {
    version: config.version,
    sources: {
      compose: config.sources.compose,
      env_example: config.sources.env_example,
      port_constants: config.sources.port_constants,
      workspace_roots: [...config.sources.workspace_roots],
    },
    services,
    port_constants: portConstants,
    env_example_keys: envExampleKeys,
    workspaces,
    drift: {
      status: findings.length === 0 ? "PASS" : "FAIL",
      assessed_checks: checks.length,
      passed_checks: passed,
      findings,
    },
  }

  return {
    inventory,
    evidence: {
      id: "service_config_inventory",
      kind: "generated_inventory",
      evidence_level: "E1",
      condition: inventory.drift.status,
      assessed: checks.length,
      passed,
      value,
      findings,
    },
  }
}
