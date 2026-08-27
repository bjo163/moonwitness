/**
 * ◈ COSMIC MATRIX ENGINE — VIEW MANIFEST TYPE SYSTEM
 *
 * Declarative view configuration for the Server-Driven UI architecture.
 * Each addon package exports a `views` object mapping model names to ViewManifest.
 * If no manifest is provided, the engine auto-generates views from field definitions.
 */

/** Available view modes in the Cosmic Matrix Engine */
export type MatrixViewMode = 'table' | 'kanban' | 'metrics'

/** Accent color tokens aligned with the Deep Space Sci-Fi Divine OS palette */
export type MatrixAccentColor = 'cyan' | 'green' | 'yellow' | 'purple' | 'pink'

/** Table view configuration */
export interface MatrixTableConfig {
  /** Field names to display as columns (order matters) */
  columns: string[]
  /** Default sort configuration */
  defaultSort?: { field: string; direction: 'asc' | 'desc' }
  /** Fields to include in search filtering */
  searchKeys?: string[]
}

/** Kanban board configuration */
export interface MatrixKanbanConfig {
  /** Field name used to group records into columns (must be many2one or selection) */
  groupBy: string
  /** Field shown as the card title */
  titleField: string
  /** Field shown below the title */
  subtitleField?: string
  /** Selection field rendered as a colored priority badge */
  priorityField?: string
  /** Date/DateTime field shown on the card */
  dateField?: string
  /** Many2one field pointing to vx.user — renders avatar */
  userField?: string
  /** Field rendered as a small status badge */
  badgeField?: string
}

/** Form header action button */
export interface MatrixFormAction {
  /** Button label text (UPPERCASE in the Sci-Fi OS terminal) */
  label: string
  /** RPC method name on the Vertex model class */
  action: string
  /** Button visual variant */
  variant?: 'primary' | 'warning' | 'danger'
  /** Optional confirmation dialog message */
  confirm?: string
}

/** Form section layout */
export interface MatrixFormSection {
  /** Section header title */
  title: string
  /** Number of columns in the section grid (1 = full-width, 2 = half, 3 = third) */
  columns?: 1 | 2 | 3
  /** Field names rendered in this section */
  fields: string[]
}

/** Form view configuration */
export interface MatrixFormConfig {
  /** Form dialog title (shown in ContextBlock) */
  title?: string
  /** Field rendered as a clickable status pipeline bar at the top */
  statusBar?: { field: string }
  /** Action buttons rendered in the form header */
  headerActions?: MatrixFormAction[]
  /** Form field groupings */
  sections: MatrixFormSection[]
  /** Enable @moon/mail chatter (audit trail + comments) at the bottom */
  chatter?: boolean
}

/** Metrics / chart view configuration */
export interface MatrixMetricsConfig {
  /** Field used to group/aggregate data */
  groupBy: string
  /** Numeric field to aggregate (defaults to record count) */
  aggregateField?: string
}

/**
 * Complete View Manifest for a single model.
 * Declared per-model in each addon package's `src/views.ts`.
 */
export interface ViewManifest {
  /** Default view mode when opening this model */
  defaultView: MatrixViewMode
  /** Accent color for the Sci-Fi Deep Space theme */
  accentColor?: MatrixAccentColor
  /** Lucide icon name for navigation and headers */
  icon?: string
  /** Table view configuration */
  table?: MatrixTableConfig
  /** Kanban board configuration */
  kanban?: MatrixKanbanConfig
  /** Form/modal view configuration */
  form?: MatrixFormConfig
  /** Metrics chart view configuration */
  metrics?: MatrixMetricsConfig
}

/**
 * Serialized field metadata returned by the schema introspection API.
 * This is the JSON representation of a FieldDef sent to the frontend.
 */
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

/**
 * Complete model schema returned by GET /api/meta/model/:name
 */
export interface ModelSchema {
  /** Canonical model name (e.g. "pj.task") */
  name: string
  /** Human-readable model description */
  description: string
  /** Display name field (e.g. "title" or "name") */
  recName: string
  /** Field metadata dictionary */
  fields: Record<string, FieldMeta>
  /** View manifest (from package or auto-generated) */
  views: ViewManifest
}

/**
 * Summary model info for the models list endpoint
 */
export interface ModelSummary {
  name: string
  description: string
  recName: string
  fieldCount: number
  icon?: string
  accentColor?: MatrixAccentColor
  defaultView?: MatrixViewMode
}
