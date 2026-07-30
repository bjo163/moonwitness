"use client"

import { useState, useCallback, useEffect } from "react"

const DEFAULT_TIMEOUT_MS = 2000

export function useClipboard(timeout = DEFAULT_TIMEOUT_MS) {
  const [hasCopied, setHasCopied] = useState(false)

  const copyToClipboard = useCallback((value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard) return

    navigator.clipboard.writeText(value).then(() => {
      setHasCopied(true)
    })
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (hasCopied) {
      timeoutId = setTimeout(() => {
        setHasCopied(false)
      }, timeout)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [hasCopied, timeout])

  return { hasCopied, copyToClipboard }
}
