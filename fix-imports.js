import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function walkDir(dir) {
  let results = []
  const list = readdirSync(dir)
  list.forEach(file => {
    file = join(dir, file)
    const stat = statSync(file)
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file))
    } else {
      if (file.endsWith('.ts')) results.push(file)
    }
  })
  return results
}

const files = walkDir('apps/api/src')

for (const file of files) {
  let content = readFileSync(file, 'utf-8')
  
  // Replace imports like: import { X } from '../../base.js' with '@moon/orm'
  content = content.replace(/from\s+['"](?:\.\.\/)+((?:base|fields|registry|env|schema-sync|security))\.js['"]/g, "from '@moon/orm'")
  // Replace imports like: import { X } from '../base.js' with '@moon/orm'
  content = content.replace(/from\s+['"](?:\.\/)+((?:base|fields|registry|env|schema-sync|security))\.js['"]/g, "from '@moon/orm'")
  // Replace models/index.js imports
  content = content.replace(/from\s+['"](?:\.\.\/)+models\/index\.js['"]/g, "from '@moon/orm'")
  content = content.replace(/from\s+['"](?:\.\/)+models\/index\.js['"]/g, "from '@moon/orm'")
  
  writeFileSync(file, content)
}
console.log('Imports fixed!')
