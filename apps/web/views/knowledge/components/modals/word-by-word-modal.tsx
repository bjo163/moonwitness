"use client"

export function WordByWordModal(props: any) {
  if (!props.isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-card p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-blue-500/20 bg-card/90 p-8 shadow-2xl">
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Word by Word Analysis
        </h2>
        <p className="mb-6 text-blue-200/70">
          Word by word data is currently being rebuilt for the new module
          architecture.
        </p>
        <button
          onClick={props.onClose}
          className="rounded bg-blue-500/20 px-4 py-2 text-blue-300 transition-colors hover:bg-blue-500/30"
        >
          Close
        </button>
      </div>
    </div>
  )
}
