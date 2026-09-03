import { z } from 'zod'

/** Available view modes in the Matrix Engine */
export type MatrixViewMode = 'table' | 'kanban' | 'metrics'

/** Semantic accent color variants */
export type MatrixAccentColor = 'primary' | 'secondary' | 'success' | 'warning' | 'info'

/** Table view configuration */
export interface MatrixTableConfig {
  columns: string[]
  defaultSort?: { field: string; direction: 'asc' | 'desc' }
  searchKeys?: string[]
}

/** Kanban board configuration */
export interface MatrixKanbanConfig {
  groupBy: string
  titleField: string
  subtitleField?: string
  priorityField?: string
  dateField?: string
  userField?: string
  badgeField?: string
}

/** Form header action button */
export interface MatrixFormAction {
  label: string
  action: string
  variant?: 'primary' | 'warning' | 'destructive'
  confirm?: string
}

/** Form section layout */
export interface MatrixFormSection {
  title: string
  columns?: 1 | 2 | 3
  fields: string[]
}

/** Form view configuration */
export interface MatrixFormConfig {
  title?: string
  statusBar?: { field: string }
  headerActions?: MatrixFormAction[]
  sections: MatrixFormSection[]
  chatter?: boolean
}

/** Metrics / chart view configuration */
export interface MatrixMetricsConfig {
  groupBy: string
  aggregateField?: string
}

/** Complete View Manifest for a single model */
export interface ViewManifest {
  defaultView: MatrixViewMode
  accentColor?: MatrixAccentColor
  icon?: string
  table?: MatrixTableConfig
  kanban?: MatrixKanbanConfig
  form?: MatrixFormConfig
  metrics?: MatrixMetricsConfig
}

/** Serialized field metadata returned by schema introspection API */
export interface FieldMeta {
  name: string
  type: string
  label: string
  required: boolean
  widget: string
  selection?: [string, string][]
  comodel?: string
  help?: string
  default?: unknown
  readonly: boolean
  invisible: boolean
  tracking: boolean
  unique: boolean
  size?: number
  groupOperator?: string
}

/** Complete model schema returned by GET /api/meta/model/:name */
export interface ModelSchema {
  name: string
  description: string
  recName: string
  fields: Record<string, FieldMeta>
  views: ViewManifest
}

/** Summary model info for the models list endpoint */
export interface ModelSummary {
  name: string
  description: string
  recName: string
  fieldCount: number
  icon?: string
  accentColor?: MatrixAccentColor
  defaultView?: MatrixViewMode
}
