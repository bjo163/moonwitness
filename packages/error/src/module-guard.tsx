"use client"

import React, { type ReactNode } from "react"
import { ErrorBoundary } from "./error-boundary"

export interface ModuleGuardProps {
  moduleId: string
  children: ReactNode
  fallback?: ReactNode
}

/**
 * ModuleGuard — Isolates crashes to a single module container.
 * If a module crashes, only its zone displays the SIGNAL LOST panel,
 * allowing the rest of the OS layout, navbar, and sidebar to remain operational.
 */
export function ModuleGuard({ moduleId, children, fallback }: ModuleGuardProps) {
  return (
    <ErrorBoundary moduleId={moduleId} fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}
