import type React from 'react'

export type CrudColumn = {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'boolean' | 'select'
  required?: boolean
  hideInTable?: boolean
  hideInForm?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

export type DataTableProps<T = any> = {
  modelName: string
  title: string
  description: string
  columns: CrudColumn[]
  icon?: React.ReactNode
  topWidgets?: React.ReactNode
  sideWidgets?: React.ReactNode
  tabs?: { id: string; label: string }[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  filters?: Record<string, any>
  filterWidgets?: React.ReactNode
  customActions?: React.ReactNode
}
