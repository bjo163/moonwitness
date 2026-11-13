"use client"

import { useEffect, useState } from "react"
import { apiGet } from "@moon/client"
import {
  MizanAssessmentOutput,
  MizanAssessmentParameters,
  type MethodDecision,
} from "./mizan-assessment-renderers"

export function MizanAssessmentView() {
  const [generalSufficient, setGeneralSufficient] = useState(false)
  const [balanceSatisfied, setBalanceSatisfied] = useState(false)
  const [internalReferenceVerified, setInternalReferenceVerified] =
    useState(false)
  const [decision, setDecision] = useState<MethodDecision | null>(null)
  const [isResolving, setIsResolving] = useState(true)

  useEffect(() => {
    let mounted = true
    const query = new URLSearchParams({
      generalSufficient: String(generalSufficient),
      balanceSatisfied: String(balanceSatisfied),
      internalReferenceVerified: String(internalReferenceVerified),
    })

    setIsResolving(true)
    apiGet<{ decision: MethodDecision }>(`/api/mizan/decision?${query.toString()}`)
      .then((data: { decision: MethodDecision }) => {
        if (mounted) setDecision(data.decision)
      })
      .catch(() => {
        if (mounted) setDecision(null)
      })
      .finally(() => {
        if (mounted) setIsResolving(false)
      })

    return () => {
      mounted = false
    }
  }, [balanceSatisfied, generalSufficient, internalReferenceVerified])

  const method = decision?.method
  const limitation = decision?.limitation
  const accent =
    method === "general" ? "cyan" : method === "prophetic" ? "purple" : "amber"

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pb-20 md:px-0">
      {/* display Context Block */}
      <div className="rounded-xl border border-border bg-card/80 p-6 shadow-purple-500/30 backdrop-blur-md">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="font-sans text-3xl font-black tracking-wider text-foreground uppercase">
              MIZAN ASSESSMENT ENGINE
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Public testing interface for the internal weighted-assessment and
              validation logic.
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
              OPERATION
            </div>
            <div className="font-mono text-xs font-bold text-primary">
              SIMULATION-MODE
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MizanAssessmentParameters
          values={[generalSufficient, balanceSatisfied, internalReferenceVerified]}
          onToggle={(index) => {
            if (index === 0) setGeneralSufficient((value) => !value)
            if (index === 1) setBalanceSatisfied((value) => !value)
            if (index === 2) setInternalReferenceVerified((value) => !value)
          }}
        />
        <MizanAssessmentOutput
          method={method}
          limitation={limitation}
          isResolving={isResolving}
          accent={accent as "cyan" | "purple" | "amber"}
        />
      </div>
    </div>
  )
}
