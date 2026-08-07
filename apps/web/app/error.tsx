"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 font-mono text-cyan-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)]" />
      
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center justify-center space-y-6 rounded-2xl border border-red-500/50 bg-black/60 p-8 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-in zoom-in duration-500">
        
        <div className="relative flex items-center justify-center h-24 w-24">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-500/50 animate-[spin_4s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-red-500/30 animate-[spin_3s_linear_infinite_reverse]" />
          <div className="absolute -inset-4 animate-pulse rounded-full bg-red-500/20 blur-xl" />
          <AlertTriangle className="relative h-10 w-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]" />
        </div>
        
        <div className="space-y-3 w-full">
          <h2 className="text-xl font-black tracking-widest text-red-500 uppercase">
            System Failure
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          <p className="text-sm leading-relaxed text-red-400/80">
            A critical error occurred in the primary matrix. The telemetry stream has been interrupted.
          </p>
          
          <div className="mt-4 rounded bg-red-950/40 p-4 text-left text-[10px] text-red-300/70 overflow-auto max-h-32 w-full border border-red-500/20 shadow-inner">
            <code className="whitespace-pre-wrap">{error.message || "Unknown anomaly detected in sectors."}</code>
          </div>
        </div>

        <button
          onClick={() => reset()}
          className="group relative flex items-center gap-2 overflow-hidden rounded border border-red-500/50 bg-red-950/30 px-8 py-3 font-bold text-red-400 transition-all hover:bg-red-900/50 hover:text-red-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95"
        >
          <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-180 duration-700" />
          <span className="tracking-widest uppercase text-xs">Reinitialize Core</span>
          {/* Scanning line effect */}
          <div className="absolute top-0 left-0 h-full w-[2px] bg-red-400/50 blur-[1px] opacity-0 group-hover:opacity-100 group-hover:animate-[scan_1.5s_ease-in-out_infinite]" />
        </button>
      </div>
    </div>
  )
}
