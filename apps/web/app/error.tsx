"use client"

import { useEffect } from "react"
import { ErrorState } from "@core/ui"
import { ContentWrapper } from "@core/layouts/content-wrapper"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("MoonWitness System Error:", error)
  }, [error])

  return (
    <ContentWrapper className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-lg">
        <ErrorState
          title="SYSTEM FAULT DETECTED"
          description={
            error.message ||
            "An unexpected anomaly occurred in the MoonWitness datastreams."
          }
          onRetry={reset}
        />
      </div>
    </ContentWrapper>
  )
}
