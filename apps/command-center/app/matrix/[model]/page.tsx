"use client"

import React from "react"
import { useParams } from "next/navigation"
import { ModelWorkspace } from "@workspace/ui"
import { ModuleGuard } from "@workspace/error"

export default function DynamicMatrixModelPage() {
  const params = useParams()
  const rawModel = params?.model
  const model = Array.isArray(rawModel) ? rawModel[0] : rawModel ? String(rawModel) : ""

  if (!model) {
    return (
      <div className="p-8 text-center text-muted-foreground font-sans text-xs">
        No model identifier specified in route parameters.
      </div>
    )
  }

  return (
    <ModuleGuard moduleId={`matrix-${model}`}>
      <ModelWorkspace model={model} />
    </ModuleGuard>
  )
}
