"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  icon?: React.ElementType
  children: React.ReactNode
  maxWidth?: string // e.g. "max-w-lg", "max-w-2xl", "max-w-3xl"
  borderColor?: string
  glowColor?: string
}

const FOCUS_DELAY_MS = 50

export function Modal({
  isOpen,
  onClose,
  title,
  icon: Icon,
  children,
  maxWidth = "max-w-lg",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setTimeout(() => closeBtnRef.current?.focus(), FOCUS_DELAY_MS)
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const ModalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans sm:p-6"
    >
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="bg-background/80 fixed inset-0 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose()
        }}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div
        className={`w-full ${maxWidth} relative flex max-h-[90vh] flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            )}
            <h3
              id="modal-title"
              className="text-sm font-semibold tracking-tight text-foreground sm:text-base"
            >
              {title}
            </h3>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )

  if (typeof window === "undefined") return null
  return createPortal(ModalContent, document.body)
}

export function ModalTrigger({
  icon: Icon,
  label,
  title,
  onClick,
  hideLabelOnMobile,
  className = "",
}: {
  icon?: React.ElementType
  label: string
  color?: string
  title?: string
  onClick?: () => void
  hideLabelOnMobile?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 font-sans text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
      <span className={hideLabelOnMobile ? "hidden sm:inline" : ""}>{label}</span>
    </button>
  )
}
