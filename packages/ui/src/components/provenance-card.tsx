'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './card'
import { Button } from './button'
import { EpistemicBadge } from './epistemic-badge'

export interface ProvenanceData {
  sourceName?: string
  sourceKey?: string
  edition?: string
  revision?: string
  publisher?: string
  language?: string
  license?: string
  checksum?: string
  retrievedAt?: string
  validationStatus?: string
  authority?: string
  contentKind?: string
  isAiGenerated?: boolean
  snapshotId?: number | string
  parserVersion?: string
}

interface ProvenanceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  provenance: ProvenanceData
  title?: string
  defaultExpanded?: boolean
}

export function ProvenanceCard({
  provenance,
  title = 'Source & Provenance Lineage',
  defaultExpanded = false,
  className,
  ...props
}: ProvenanceCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <Card className={`border border-border bg-card shadow-sm ${className || ''}`} {...props}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold text-foreground">
            {title}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <EpistemicBadge
              authority={provenance.authority}
              contentKind={provenance.contentKind}
              isAiGenerated={provenance.isAiGenerated}
            />
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-xs h-7 px-2 text-muted-foreground"
          aria-expanded={expanded}
        >
          {expanded ? 'Hide Details' : 'View Provenance'}
        </Button>
      </CardHeader>

      <CardContent className="p-4 pt-2 text-xs space-y-3">
        {/* Primary Lineage Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 border-t border-border/50">
          <div>
            <span className="text-muted-foreground block">Source:</span>
            <span className="font-medium text-foreground">
              {provenance.sourceName || provenance.sourceKey || 'Not provided'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">Edition:</span>
            <span className="font-medium text-foreground">
              {provenance.edition || 'Standard Edition'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">Revision:</span>
            <span className="font-medium text-foreground">
              v{provenance.revision || '1.0.0'}
            </span>
          </div>
        </div>

        {/* Expanded Provenance Details */}
        {expanded && (
          <div className="pt-2 border-t border-border/50 space-y-2 bg-muted/20 p-3 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
              {provenance.publisher && (
                <div>
                  <span className="font-medium text-foreground">Publisher:</span>{' '}
                  {provenance.publisher}
                </div>
              )}
              {provenance.license && (
                <div>
                  <span className="font-medium text-foreground">License:</span>{' '}
                  {provenance.license}
                </div>
              )}
              {provenance.validationStatus && (
                <div>
                  <span className="font-medium text-foreground">Validation:</span>{' '}
                  <span className="capitalize">{provenance.validationStatus}</span>
                </div>
              )}
              {provenance.retrievedAt && (
                <div>
                  <span className="font-medium text-foreground">Retrieved:</span>{' '}
                  {provenance.retrievedAt}
                </div>
              )}
            </div>

            {provenance.checksum && (
              <div className="pt-1">
                <span className="text-[11px] font-medium text-foreground block">
                  SHA-256 Checksum:
                </span>
                <code className="text-[10px] font-mono text-muted-foreground break-all select-all">
                  {provenance.checksum}
                </code>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
