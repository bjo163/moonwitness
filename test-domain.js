import knex from 'knex'

const db = knex({
  client: 'pg',
})

function toSnakeCase(s) {
  return s.replace(/[A-Z]/g, '_$1').toLowerCase()
}

function parseDomainToAST(domain) {
  if (!domain || domain.length === 0) return []
  
  let i = 0
  function parseNode() {
    if (i >= domain.length) return null
    const current = domain[i]
    i++
    
    if (current === '|') {
      const left = parseNode()
      const right = parseNode()
      if (left && right) return { type: 'OR', left, right }
      return left || right
    } else if (current === '&') {
      const left = parseNode()
      const right = parseNode()
      if (left && right) return { type: 'AND', left, right }
      return left || right
    } else if (current === '!') {
      const child = parseNode()
      if (child) return { type: 'NOT', child }
      return null
    } else if (Array.isArray(current) && current.length === 3) {
      return { type: 'LEAF', clause: current }
    }
    return null
  }
  
  const nodes = []
  while (i < domain.length) {
    const node = parseNode()
    if (node) nodes.push(node)
  }
  return nodes
}

function applyAST(query, nodes) {
  for (const node of nodes) {
    applyNode(query, node)
  }
}

function applyNode(query, node) {
  if (node.type === 'LEAF') {
    applyClause(query, node.clause)
  } else if (node.type === 'AND') {
    query.where((qb) => {
      applyNode(qb, node.left)
      qb.andWhere((qb2) => applyNode(qb2, node.right))
    })
  } else if (node.type === 'OR') {
    query.where((qb) => {
      applyNode(qb, node.left)
      qb.orWhere((qb2) => applyNode(qb2, node.right))
    })
  } else if (node.type === 'NOT') {
    query.whereNot((qb) => applyNode(qb, node.child))
  }
}

function applyDomain(query, domain) {
  const ast = parseDomainToAST(domain)
  applyAST(query, ast)
}

function applyClause(query, clause) {
  const [field, operator, value] = clause
  const col = toSnakeCase(String(field))
  switch (String(operator).toLowerCase()) {
    case '=':
    case '==':
      query.where(col, value)
      break
  }
}

console.log("Testing applyDomain...")
const q1 = db('users')
applyDomain(q1, [['code', '=', 'ID']])
console.log(q1.toString())

const q2 = db('users')
applyDomain(q2, ['|', ['code', '=', 'ID'], ['code', '=', 'US']])
console.log(q2.toString())

console.log("Done")
