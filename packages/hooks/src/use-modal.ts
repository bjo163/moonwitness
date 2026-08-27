"use client"

import { useState, useCallback } from "react"

export interface UseModalReturn<T = any> {
  /** Whether the modal is currently visible */
  isOpen: boolean
  /** Active payload data passed to the modal */
  data: T | null
  /** Optional mode identifier (e.g. 'create', 'edit', 'delete', 'preview') */
  mode: string | null
  /** Open the modal with optional data payload and mode */
  open: (data?: T | null, modalMode?: string | null) => void
  /** Close the modal and optionally clear data */
  close: (clearData?: boolean) => void
  /** Toggle the modal open/close state */
  toggle: (data?: T | null) => void
  /** Update the active payload data without closing */
  setData: React.Dispatch<React.SetStateAction<T | null>>
}

/**
 * ◈ useModal — Universal Standard Modal Controller Hook
 *
 * Replaces manual boolean and payload state variables across all views.
 * Handles payload binding, mode tracking, and clean dismiss.
 */
export function useModal<T = any>(initialOpen = false, initialData: T | null = null): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen)
  const [data, setData] = useState<T | null>(initialData)
  const [mode, setMode] = useState<string | null>(null)

  const open = useCallback((payload?: T | null, modalMode?: string | null) => {
    if (payload !== undefined) {
      setData(payload)
    }
    if (modalMode !== undefined) {
      setMode(modalMode)
    }
    setIsOpen(true)
  }, [])

  const close = useCallback((clearData = false) => {
    setIsOpen(false)
    if (clearData) {
      setData(null)
      setMode(null)
    }
  }, [])

  const toggle = useCallback((payload?: T | null) => {
    setIsOpen((prev) => {
      if (!prev && payload !== undefined) {
        setData(payload)
      }
      return !prev
    })
  }, [])

  return {
    isOpen,
    data,
    mode,
    open,
    close,
    toggle,
    setData,
  }
}


