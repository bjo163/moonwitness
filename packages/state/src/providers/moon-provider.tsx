"use client"

import React, { useEffect } from "react"
import { ThemeProvider } from "./theme-provider"
import { LanguageProvider } from "./language-provider"
import { ToastProvider } from "./toast-provider"
import { AudioProvider } from "./audio-provider"
import { initGlobalCrashHandler } from "@workspace/error"

export interface MoonProviderProps {
  children: React.ReactNode
}

/**
 * ◈ MOONWITNESS MASTER PROVIDER
 * Unifies Theme, Language, Toast, Audio state, and Global Fault Telemetry
 * for all applications in the monorepo.
 */
export function MoonProvider({ children }: MoonProviderProps) {
  useEffect(() => {
    initGlobalCrashHandler()
  }, [])

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AudioProvider>{children}</AudioProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
