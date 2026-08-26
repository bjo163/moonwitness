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
  borderColor?: string // e.g. "border-primary/60"
  glowColor?: string // e.g. "rgba(0,240,255,0.3)"
}

const FOCUS_DELAY_MS = 50

export function Modal({
  isOpen,
  onClose,
  title,
  icon: Icon,
  children,
  maxWidth = "max-w-lg",
  borderColor = "border-primary/50",
  glowColor = "rgba(0,240,255,0.35)",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Auto-focus close button for keyboard accessibility
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

  // Derive theme color
  const isPink =
    borderColor?.includes("pink") || glowColor?.includes("255, 0, 85")
  const isYellow =
    borderColor?.includes("yellow") || glowColor?.includes("255, 230, 0")
  const isGreen =
    borderColor?.includes("green") || glowColor?.includes("0, 255, 102")
  const isPurple =
    borderColor?.includes("purple") || glowColor?.includes("161, 0, 255")

  let iconColor = "text-primary"
  if (isPink) iconColor = "text-fuchsia-400"
  if (isYellow) iconColor = "text-amber-500"
  if (isGreen) iconColor = "text-emerald-400"
  if (isPurple) iconColor = "text-fuchsia-400"

  const ModalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans font-light sm:p-6"
    >
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="bg-space/80 absolute inset-0 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose()
        }}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div
        className={`w-full ${maxWidth} relative flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl`}
      >
        {/* Subtle Top Gradient Accent */}
        <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-white/5 px-6 py-5">
          <div className="flex items-center gap-4">
            {Icon && (
              <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
            )}
            <h3
              id="modal-title"
              className="text-sm font-light tracking-[0.3em] text-foreground uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] sm:text-base"
            >
              {title}
            </h3>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="rounded-full p-2 text-primary transition-all hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-transparent">{children}</div>
      </div>
    </div>
  )

  if (typeof window === "undefined") return null
  return createPortal(ModalContent, document.body)
}
