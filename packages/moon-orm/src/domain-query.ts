import { isSqlite } from './dialect.js'

type ASTNode =
  | { type: 'AND', left: ASTNode, right: ASTNode }
  | { type: 'OR', left: ASTNode, right: ASTNode }
  | { type: 'NOT', child: ASTNode }
  | { type: 'LEAF', clause: [string, string, unknown] }

function toSnakeCase(s: string): string {
  return s.replace(/([A-Z])/g, '_$1').toLowerCase()
}

function parseDomainToAST(domain: unknown[]): ASTNode[] {
  if (!domain || domain.length === 0) return []

  let i = 0
  function parseNode(): ASTNode | null {
    if (i >= domain.length) return null
    const current = domain[i]
    i += 1

    if (current === '|' || current === '&') {
      const left = parseNode()
      const right = parseNode()
      if (left && right) return current === '|' ? { type: 'OR', left, right } : { type: 'AND', left, right }
      return left || right
    }
    if (current === '!') {
      const child = parseNode()
      return child ? { type: 'NOT', child } : null
    }
    if (Array.isArray(current) && current.length === 3) {
      return { type: 'LEAF', clause: current as [string, string, unknown] }
    }
    return null
  }

  const nodes: ASTNode[] = []
  while (i < domain.length) {
    const node = parseNode()
    if (node) nodes.push(node)
  }
  return nodes
}

function applyAST(query: any, nodes: ASTNode[], tableName?: string, parentTables?: Record<string, string[]>): void {
  for (const node of nodes) applyNode(query, node, tableName, parentTables)
}

function applyNode(query: any, node: ASTNode, tableName?: string, parentTables?: Record<string, string[]>): void {
  if (node.type === 'LEAF') {
    applyClause(query, node.clause, tableName, parentTables)
    return
  }
  if (node.type === 'AND') {
    query.where((qb: any) => {
      applyNode(qb, node.left, tableName, parentTables)
      qb.andWhere((qb2: any) => applyNode(qb2, node.right, tableName, parentTables))
    })
    return
  }
  if (node.type === 'OR') {
    query.where((qb: any) => {
      applyNode(qb, node.left, tableName, parentTables)
      qb.orWhere((qb2: any) => applyNode(qb2, node.right, tableName, parentTables))
    })
    return
  }
  query.whereNot((qb: any) => applyNode(qb, node.child, tableName, parentTables))
}

function applyClause(query: any, clause: [string, string, unknown], tableName?: string, parentTables?: Record<string, string[]>): void {
  const [field, operator, value] = clause
  let column = toSnakeCase(String(field))
  if (tableName) {
    const parent = Object.entries(parentTables ?? {}).find(([, fields]) => fields.includes(column))
    column = parent ? `${parent[0]}.${column}` : `${tableName}.${column}`
  }

  switch (String(operator).toLowerCase()) {
    case 'ilike': query.where(column, isSqlite() ? 'like' : 'ilike', `%${value}%`); break
    case 'like': query.where(column, 'like', `%${value}%`); break
    case '=':
    case '==': query.where(column, value); break
    case '!=':
    case '<>': query.whereNot(column, value); break
    case '>': query.where(column, '>', value); break
    case '<': query.where(column, '<', value); break
    case '>=': query.where(column, '>=', value); break
    case '<=': query.where(column, '<=', value); break
    case 'in': query.whereIn(column, value as any[]); break
    case 'not in': query.whereNotIn(column, value as any[]); break
    case 'child_of': query.where('parent_path', 'like', `%/${value}/%`); break
    case 'parent_of': query.whereRaw(`? like parent_path || '%'`, [value]); break
  }
}

export function applyDomain(query: any, domain: unknown[], tableName?: string, parentTables?: Record<string, string[]>): void {
  applyAST(query, parseDomainToAST(domain), tableName, parentTables)
}
