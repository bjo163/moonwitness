"use client"

import React from "react"
import { useParams } from "next/navigation"
import { CosmicModelWorkspace } from "@workspace/ui"
import { ModuleGuard } from "@workspace/error"

export default function DynamicMatrixModelPage() {
  const params = useParams()
  const rawModel = params?.model
  const model = Array.isArray(rawModel) ? rawModel[0] : rawModel ? String(rawModel) : ""

  if (!model) {
    return (
      <div className="p-8 text-center text-steel-gray font-mono text-xs">
        NO MODEL IDENTIFIER SPECIFIED IN ROUTE PARAMETERS.
      </div>
    )
  }

  return (
    <ModuleGuard moduleId={`matrix-${model}`}>
      <CosmicModelWorkspace model={model} />
    </ModuleGuard>
  )
}
