import { Vertex } from './base.js'
import type { ViewManifest } from './manifest.js'

export interface ViewContractIssue {
  model: string
  path: string
  field: string
  reason: 'unknown-model' | 'unknown-field' | 'unknown-parent' | 'inheritance-cycle'
}

export function validateViewContracts(views: Readonly<Record<string, ViewManifest>>, models: ReadonlyMap<string, typeof Vertex>): ViewContractIssue[] {
  const issues: ViewContractIssue[] = []
  for (const [name, view] of Object.entries(views)) {
    const model = models.get(name)
    if (!model) { issues.push({ model: name, path: name, field: '', reason: 'unknown-model' }); continue }
    const fields = new Set(['id'])
    const collect = (current: typeof Vertex, ancestry: Set<string>): void => {
      if (ancestry.has(current._name)) { issues.push({ model: name, path: '_inherits', field: current._name, reason: 'inheritance-cycle' }); return }
      const next = new Set(ancestry).add(current._name)
      Object.keys(Vertex.getFieldDefs(current)).forEach(field => fields.add(field))
      for (const parent of Object.keys(current._inherits ?? {})) {
        const parentModel = models.get(parent)
        if (parentModel) collect(parentModel, next)
        else issues.push({ model: name, path: '_inherits', field: parent, reason: 'unknown-parent' })
      }
    }
    collect(model, new Set())
    const check = (field: string | undefined, path: string): void => { if (field !== undefined && !fields.has(field)) issues.push({ model: name, path, field, reason: 'unknown-field' }) }
    view.table?.columns.forEach((field, i) => check(field, `table.columns[${i}]`))
    view.table?.searchKeys?.forEach((field, i) => check(field, `table.searchKeys[${i}]`))
    check(view.table?.defaultSort?.field, 'table.defaultSort.field')
    for (const key of ['groupBy', 'titleField', 'subtitleField', 'priorityField', 'dateField', 'userField', 'badgeField'] as const) check(view.kanban?.[key], `kanban.${key}`)
    check(view.form?.statusBar?.field, 'form.statusBar.field')
    view.form?.sections.forEach((section, i) => section.fields.forEach((field, j) => check(field, `form.sections[${i}].fields[${j}]`)))
    check(view.metrics?.groupBy, 'metrics.groupBy')
    check(view.metrics?.aggregateField, 'metrics.aggregateField')
  }
  return issues
}

export function assertViewContracts(views: Readonly<Record<string, ViewManifest>>, models: ReadonlyMap<string, typeof Vertex>): void {
  const issues = validateViewContracts(views, models)
  if (issues.length) throw new Error(`Invalid model view contracts:\n${issues.map(issue => `${issue.model}: ${issue.path} -> ${issue.field || '(model)'} (${issue.reason})`).join('\n')}`)
}
