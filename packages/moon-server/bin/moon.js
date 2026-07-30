#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const command = args[0]

if (command === 'scaffold') {
  const addonName = args[1]
  if (!addonName) {
    console.error('Usage: moon scaffold <addon_name>')
    process.exit(1)
  }

  const addonDir = path.resolve(process.cwd(), 'src/addons', addonName)
  
  if (fs.existsSync(addonDir)) {
    console.error(`Addon directory ${addonDir} already exists!`)
    process.exit(1)
  }

  // Create directories
  fs.mkdirSync(path.join(addonDir, 'models'), { recursive: true })
  fs.mkdirSync(path.join(addonDir, 'controllers'), { recursive: true })

  // manifest.ts
  fs.writeFileSync(path.join(addonDir, 'manifest.ts'), `export const manifest = {
  name: '${addonName}',
  version: '1.0.0',
  description: '${addonName} module',
  depends: ['base'],
  author: 'MoonWitness'
}
`)

  // index.ts
  fs.writeFileSync(path.join(addonDir, 'index.ts'), `export * from './manifest.js'
export * from './models/index.js'
export * from './controllers/index.js'
`)

  // models/index.ts
  fs.writeFileSync(path.join(addonDir, 'models', 'index.ts'), `// export { default as MyModel } from './my-model.js'
`)

  // controllers/index.ts
  fs.writeFileSync(path.join(addonDir, 'controllers', 'index.ts'), `// export { MyController } from './my-controller.js'
`)

  console.log(`Addon '${addonName}' successfully scaffolded at ${addonDir}`)
} else {
  console.log(`
MoonWitness CLI
Usage:
  moon scaffold <addon_name>   Create a new addon module
  `)
}
