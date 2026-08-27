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
 * Catches render-time JavaScript crashes in child component trees,
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
      <div className="relative my-4 w-full overflow-hidden border border-cyber-pink/40 bg-[#070C14]/90 p-6 backdrop-blur-md">
        {/* Accent glow bar */}
        <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-pink to-transparent opacity-80" />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-ping bg-cyber-pink" />
            <span className="font-mono text-xs font-black tracking-widest text-cyber-pink uppercase">
              ◈ SIGNAL LOST — FAULT DETECTED
            </span>
          </div>

          <h3 className="font-orbitron mb-2 text-lg font-black tracking-wider text-white uppercase">
            {this.props.moduleId ? `MODULE FAULT [${this.props.moduleId}]` : "TELEMETRY ANOMALY"}
          </h3>

          <p className="mb-4 max-w-md font-mono text-xs text-cyber-pink/80">
            {error?.message || "An unexpected subsystem interruption occurred."}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              type="button"
              className="border border-cyber-pink/60 bg-cyber-pink/10 px-4 py-2 font-mono text-xs font-black tracking-wider text-cyber-pink uppercase transition-all hover:bg-cyber-pink/20 hover:shadow-[0_0_15px_rgba(255,0,85,0.3)] active:translate-y-0"
            >
              [ RE-INITIALIZE ]
            </button>
            <button
              onClick={() => {
                if (typeof window !== "undefined") window.location.reload()
              }}
              type="button"
              className="border border-cyber-cyan/40 bg-cyber-cyan/5 px-4 py-2 font-mono text-xs font-bold tracking-wider text-cyber-cyan/80 uppercase transition-all hover:bg-cyber-cyan/15 hover:text-cyber-cyan"
            >
              [ HARD REBOOT ]
            </button>
          </div>
        </div>
      </div>
    )
  }
}


