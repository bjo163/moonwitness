"use client"

import React, { useEffect, useState } from "react"
import { create } from "zustand"
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export type ToastType = "info" | "success" | "warning" | "error"

export interface ToastProps {
  id: string
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

interface ToastStore {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id">) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, toast.duration || 5000)
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export const toast = {
  info: (title: string, description?: string, duration?: number) =>
    useToastStore
      .getState()
      .addToast({ title, description, type: "info", duration }),
  success: (title: string, description?: string, duration?: number) =>
    useToastStore
      .getState()
      .addToast({ title, description, type: "success", duration }),
  warning: (title: string, description?: string, duration?: number) =>
    useToastStore
      .getState()
      .addToast({ title, description, type: "warning", duration }),
  error: (title: string, description?: string, duration?: number) =>
    useToastStore
      .getState()
      .addToast({ title, description, type: "error", duration }),
}

const icons = {
  info: <Info className="h-5 w-5 text-cyan-400" />,
  success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-400" />,
  error: <XCircle className="h-5 w-5 text-red-400" />,
}

const borders = {
  info: "border-cyan-500/50",
  success: "border-emerald-500/50",
  warning: "border-amber-500/50",
  error: "border-red-500/50",
}

const bgGlows = {
  info: "bg-cyan-950/40",
  success: "bg-emerald-950/40",
  warning: "bg-amber-950/40",
  error: "bg-red-950/40",
}

export function TacticalToastContainer() {
  const { toasts, removeToast } = useToastStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto relative overflow-hidden rounded-xl border ${
              borders[t.type || "info"]
            } ${bgGlows[t.type || "info"]} p-4 shadow-2xl backdrop-blur-xl`}
          >
            <div className="flex gap-3">
              <div className="mt-0.5 shrink-0">{icons[t.type || "info"]}</div>
              <div className="flex-1 space-y-1">
                <h4 className="font-sans text-sm font-bold tracking-wider text-white uppercase">
                  {t.title}
                </h4>
                {t.description && (
                  <p className="font-mono text-xs leading-relaxed text-primary/80">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="h-fit shrink-0 text-white/50 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Holographic scanning line */}
            <div className="absolute top-0 left-0 h-[1px] w-full animate-[scan_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
