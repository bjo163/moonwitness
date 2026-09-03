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
    label: string
  }
> = {
  success: {
    icon: CheckCircle,
    borderClass: "border-success/40 bg-card",
    iconClass: "text-success",
    titleClass: "text-success",
    label: "SUCCESS",
  },
  error: {
    icon: XCircle,
    borderClass: "border-destructive/40 bg-card",
    iconClass: "text-destructive",
    titleClass: "text-destructive",
    label: "ERROR",
  },
  warning: {
    icon: AlertTriangle,
    borderClass: "border-warning/40 bg-card",
    iconClass: "text-warning",
    titleClass: "text-warning",
    label: "WARNING",
  },
  info: {
    icon: Info,
    borderClass: "border-border bg-card",
    iconClass: "text-primary",
    titleClass: "text-primary",
    label: "INFO",
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
      className={`rounded-xl w-80 border sm:w-96 ${cfg.borderClass} relative flex items-start gap-3 overflow-hidden px-4 py-3 font-sans shadow-lg backdrop-blur-md transition-all duration-280 ${exiting ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"}`}
    >
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-primary opacity-40"
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
          className={`text-xs font-semibold tracking-wide uppercase ${cfg.titleClass}`}
        >
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={dismiss}
        className="mt-0.5 shrink-0 p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
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
            className="fixed right-4 bottom-10 z-[99998] flex flex-col items-end gap-2 font-sans"
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
