#!/usr/bin/env node
import { parseArgs } from 'util'
import * as path from 'path'

async function main() {
  const { positionals, values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      dir: {
        type: 'string',
        short: 'd',
        default: path.join(process.cwd(), 'migrations')
      }
    },
    allowPositionals: true
  })

  const command = positionals[0]
  
  if (!command) {
    console.error('Usage: moon <command>')
    console.error('Commands: diff, migrate, rollback')
    process.exit(1)
  }

  // We load migrator from the built output
  const migratorPath = new URL('../dist/migrator.js', import.meta.url).pathname
  const migratorUrl = 'file://' + migratorPath.replace(/\\/g, '/')
  const { diff, up, down } = await import(migratorUrl)

  try {
    switch (command) {
      case 'diff':
        await diff(values.dir)
        break
      case 'migrate':
      case 'up':
        await up(values.dir)
        break
      case 'rollback':
      case 'down':
        await down(values.dir)
        break
      default:
        console.error(`Unknown command: ${command}`)
        process.exit(1)
    }
    process.exit(0)
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

main()
