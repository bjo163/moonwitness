"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { useMounted } from "@workspace/hooks"
import {
  useNotificationStore,
  type NotificationType,
} from "../stores/notification-store"

const DEFAULT_TOAST_DURATION_MS = 4000
const TOAST_ANIMATION_DELAY_MS = 280
const RADIX_ALPHANUMERIC = 36
const ID_SLICE_LENGTH = 7
const MAX_TOASTS_COUNT = 4

export type ToastVariant = "success" | "error" | "warning" | "info"

export type Toast = {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  duration?: number
}

export type ToastContextValue = {
  toast: (opts: Omit<Toast, "id">) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>")
  return ctx
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    icon: React.ElementType
    borderClass: string
    iconClass: string
    titleClass: string
    glow: string
    label: string
  }
> = {
  success: {
    icon: CheckCircle,
    borderClass: "border-success/50",
    iconClass: "text-success",
    titleClass: "text-success",
    glow: "rgba(0,255,102,0.15)",
    label: "OPERATION COMPLETE",
  },
  error: {
    icon: XCircle,
    borderClass: "border-danger/50",
    iconClass: "text-danger",
    titleClass: "text-danger",
    glow: "rgba(255,0,85,0.15)",
    label: "SYSTEM FAULT",
  },
  warning: {
    icon: AlertTriangle,
    borderClass: "border-warning/50",
    iconClass: "text-warning",
    titleClass: "text-warning",
    glow: "rgba(255,230,0,0.15)",
    label: "CAUTION",
  },
  info: {
    icon: Info,
    borderClass: "border-primary/50",
    iconClass: "text-primary",
    titleClass: "text-primary",
    glow: "rgba(0,240,255,0.15)",
    label: "TRANSMISSION",
  },
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cfg = VARIANT_CONFIG[toast.variant]
  const Icon = cfg.icon as React.ComponentType<{ className?: string }>
  const duration = toast.duration ?? DEFAULT_TOAST_DURATION_MS

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onDismiss(toast.id), TOAST_ANIMATION_DELAY_MS)
  }, [toast.id, onDismiss])

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, duration)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [dismiss, duration])

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`panel-clip w-80 border sm:w-96 ${cfg.borderClass} bg-space/98 relative flex items-start gap-3 overflow-hidden px-4 py-3 font-mono backdrop-blur-md transition-all duration-280 ${exiting ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"} `}
      style={{ boxShadow: `0 0 30px ${cfg.glow}, 0 4px 20px rgba(0,0,0,0.6)` }}
    >
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-current opacity-40"
        style={{
          animation: `toastProgress ${duration}ms linear forwards`,
        }}
        aria-hidden="true"
      />

      <div className={`mt-0.5 shrink-0 ${cfg.iconClass}`} aria-hidden="true">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[9px] font-black tracking-widest uppercase ${cfg.titleClass}`}
        >
          // {toast.title}
        </p>
        {toast.description && (
          <p className="mt-0.5 text-[9px] leading-relaxed text-primary">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={dismiss}
        className="mt-0.5 shrink-0 p-0.5 text-primary transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const mounted = useMounted()

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(RADIX_ALPHANUMERIC).slice(2, ID_SLICE_LENGTH)}`
    setToasts((prev) => {
      const trimmed = prev.length >= MAX_TOASTS_COUNT ? prev.slice(1) : prev
      return [...trimmed, { ...opts, id }]
    })

    let type: NotificationType = "info"
    if (opts.variant === "success") type = "success"
    if (opts.variant === "error") type = "error"
    if (opts.variant === "warning") type = "warning"

    useNotificationStore.getState().addNotification({
      type,
      title: opts.title,
      message: opts.description || "",
    })
  }, [])

  const success = useCallback(
    (title: string, description?: string) =>
      toast({ variant: "success", title, description }),
    [toast]
  )
  const error = useCallback(
    (title: string, description?: string) =>
      toast({ variant: "error", title, description }),
    [toast]
  )
  const warning = useCallback(
    (title: string, description?: string) =>
      toast({ variant: "warning", title, description }),
    [toast]
  )
  const info = useCallback(
    (title: string, description?: string) =>
      toast({ variant: "info", title, description }),
    [toast]
  )

  const toastRegion =
    mounted && toasts.length > 0 && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed right-4 bottom-10 z-[99998] flex flex-col items-end gap-2 font-mono"
            aria-label="Notifications"
            aria-live="polite"
          >
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </div>,
          document.body
        )
      : null

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {toastRegion}
    </ToastContext.Provider>
  )
}
