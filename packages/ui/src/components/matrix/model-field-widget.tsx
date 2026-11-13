"use client"

import type { FieldMeta } from "@workspace/types"
import {
  ModelFieldBoolean,
  ModelFieldDate,
  ModelFieldMany2One,
  ModelFieldNumber,
  ModelFieldSelection,
  ModelFieldText,
  ModelFieldTextarea,
} from "./model-field-widget-presentation"
import { useModelFieldWidgetController } from "./model-field-widget-controller"

export interface ModelFieldWidgetProps {
  field: FieldMeta
  value: any
  onChange?: (val: any) => void
  disabled?: boolean
}

export function ModelFieldWidget({
  field,
  value,
  onChange,
  disabled = false,
}: ModelFieldWidgetProps) {
  const controller = useModelFieldWidgetController(field, onChange)
  const controlProps = { field, value, onChange, disabled }

  if (field.type === "boolean" || field.widget === "toggle") {
    return <ModelFieldBoolean {...controlProps} />
  }

  if (field.type === "text" || field.widget === "textarea") {
    return <ModelFieldTextarea {...controlProps} />
  }

  if (field.type === "selection" && field.selection) {
    return <ModelFieldSelection {...controlProps} />
  }

  if (field.type === "many2one" && field.comodel) {
    return (
      <ModelFieldMany2One
        {...controlProps}
        options={controller.comodelOptions}
        loading={controller.comodelLoading}
        quickCreating={controller.quickCreating}
        onQuickCreate={controller.handleQuickCreate}
      />
    )
  }

  if (field.type === "date" || field.type === "datetime" || field.widget === "datepicker") {
    return <ModelFieldDate {...controlProps} />
  }

  if (field.type === "integer" || field.type === "float" || field.widget === "number") {
    return <ModelFieldNumber {...controlProps} />
  }

  return <ModelFieldText {...controlProps} />
}
