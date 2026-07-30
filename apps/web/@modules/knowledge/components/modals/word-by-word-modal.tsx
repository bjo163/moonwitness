"use client"

export function WordByWordModal(props: any) {
  if (!props.isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-blue-500/20 bg-black/90 p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Word by Word Analysis</h2>
        <p className="text-blue-200/70 mb-6">Word by word data is currently being rebuilt for the new module architecture.</p>
        <button onClick={props.onClose} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors">
          Close
        </button>
      </div>
    </div>
  )
}
