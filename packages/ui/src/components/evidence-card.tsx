'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './card'
import { Badge } from './badge'

export interface EvidenceItem {
  id: string | number
  sourceReference: string
  passageReference?: string
  evidenceWeight?: number | string
  excerpt?: string
  relationshipType?: string
  provenanceId?: number | null
}

export interface AssertionData {
  title: string
  assertionText: string
  status?: string
  confidence?: string | number
  supportingEvidence?: EvidenceItem[]
  isAiAssisted?: boolean
  engineVersion?: string
}

interface EvidenceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  assertion: AssertionData
  className?: string
}

export function EvidenceCard({
  assertion,
  className,
  ...props
}: EvidenceCardProps) {
  return (
    <Card className={`border border-border bg-card shadow-sm ${className || ''}`} {...props}>
      <CardHeader className="p-4 pb-2 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            {assertion.title}
          </CardTitle>
          <div className="flex items-center gap-1.5">
            {assertion.isAiAssisted && (
              <Badge variant="outline" className="border-warning/40 text-warning bg-warning/5 text-[10px]">
                AI-Assisted Analysis
              </Badge>
            )}
            {assertion.status && (
              <Badge variant="secondary" className="text-[10px] uppercase">
                {assertion.status}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Epistemic Assertion & Supporting Witness Citations
        </p>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3 text-xs">
        <div className="p-3 bg-muted/30 rounded-md border border-border/40">
          <p className="text-sm text-foreground leading-relaxed">
            {assertion.assertionText}
          </p>
        </div>

        {/* Supporting Evidence Chain */}
        {assertion.supportingEvidence && assertion.supportingEvidence.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Supporting Evidence ({assertion.supportingEvidence.length})
            </span>
            <div className="space-y-2">
              {assertion.supportingEvidence.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded border border-border/60 bg-card hover:bg-muted/10 transition-colors flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-foreground">
                      {ev.sourceReference}
                    </span>
                    {ev.relationshipType && (
                      <Badge variant="outline" className="text-[10px]">
                        {ev.relationshipType}
                      </Badge>
                    )}
                  </div>
                  {ev.excerpt && (
                    <p className="text-muted-foreground italic">
                      &ldquo;{ev.excerpt}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {assertion.engineVersion && (
          <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground flex justify-between">
            <span>Engine Runtime: {assertion.engineVersion}</span>
            <span>Zero Unverified Inferences</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
