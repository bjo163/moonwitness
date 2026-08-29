"use client"

import React, { Component, type ReactNode, type ErrorInfo } from "react"
import { reportCrash } from "./crash-reporter"

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((props: { error: Error; reset: () => void }) => ReactNode)
  moduleId?: string
  onError?: (error: Error, info: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ◈ ErrorBoundary — Standard React Fault Tolerance Component
 *
 * Catches render-time JavaScript errors in child component trees,
 * logs diagnostic telemetry to CrashReporter, and renders a clean fallback.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    reportCrash(error, {
      module: this.props.moduleId || "ErrorBoundary",
      extra: { componentStack: errorInfo.componentStack },
    })
    this.props.onError?.(error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    const { error } = this.state

    if (typeof this.props.fallback === "function") {
      if (error) {
        return this.props.fallback({ error, reset: this.handleReset })
      }
      return null
    }

    if (this.props.fallback) {
      return this.props.fallback
    }

    return (
      <div className="relative my-4 w-full overflow-hidden rounded-xl border border-destructive/30 bg-destructive/5 p-6 font-sans">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-destructive" />
            <span className="text-xs font-semibold text-destructive uppercase tracking-wider">
              An error occurred
            </span>
          </div>

          <h3 className="mb-2 text-base font-bold text-foreground">
            {this.props.moduleId ? `Component Error (${this.props.moduleId})` : "Application Error"}
          </h3>

          <p className="mb-4 max-w-md text-xs text-muted-foreground">
            {error?.message || "An unexpected error occurred while rendering this section."}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              type="button"
              className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                if (typeof window !== "undefined") window.location.reload()
              }}
              type="button"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }
}
