/**
 * ◈ MOON ORM — VIEW MANIFEST TYPE DEFINITIONS
 *
 * Declarative view configuration interfaces for the celestial Matrix Engine.
 */

export type MatrixViewMode = 'table' | 'kanban' | 'metrics'
export type MatrixAccentColor = 'cyan' | 'green' | 'yellow' | 'purple' | 'pink'

export interface MatrixTableConfig {
  columns: string[]
  defaultSort?: { field: string; direction: 'asc' | 'desc' }
  searchKeys?: string[]
}

export interface MatrixKanbanConfig {
  groupBy: string
  titleField: string
  subtitleField?: string
  priorityField?: string
  dateField?: string
  userField?: string
  badgeField?: string
}

export interface MatrixFormSection {
  title: string
  columns?: 1 | 2 | 3
  fields: string[]
}

export interface MatrixFormAction {
  label: string
  action: string
  variant?: 'primary' | 'warning' | 'danger'
  confirm?: string
}

export interface MatrixFormConfig {
  title?: string
  statusBar?: { field: string }
  headerActions?: MatrixFormAction[]
  sections: MatrixFormSection[]
  chatter?: boolean
}

export interface ViewManifest {
  defaultView: MatrixViewMode
  accentColor?: MatrixAccentColor
  icon?: string
  table?: MatrixTableConfig
  kanban?: MatrixKanbanConfig
  form?: MatrixFormConfig
  metrics?: { groupBy: string; aggregateField?: string }
}
