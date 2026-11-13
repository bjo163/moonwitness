"use client"

interface SidebarOverlayProps {
  open: boolean
  onClose: () => void
  isDesktop: boolean
}

export function SidebarOverlay({ open, onClose, isDesktop }: SidebarOverlayProps) {
  if (!open || isDesktop) return null

  return (
    <button
      type="button"
      aria-label="Close navigation"
      className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
      onClick={onClose}
    />
  )
}
