'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent } from './card.js'
import { Button } from './button.js'
import { Badge } from './badge.js'

export interface CitationProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  sourceName?: string
  edition?: string
  reference: string
  language?: string
  translator?: string
  publisher?: string
  revision?: string
  sourceUrl?: string
}

export function formatCitation(props: CitationProps): string {
  const parts: string[] = []
  if (props.sourceName || props.title) {
    parts.push(props.sourceName || props.title || '')
  }
  if (props.edition) {
    parts.push(`[${props.edition}]`)
  }
  if (props.reference) {
    parts.push(props.reference)
  }
  if (props.translator) {
    parts.push(`(trans. ${props.translator})`)
  }
  if (props.revision) {
    parts.push(`rev. ${props.revision}`)
  }
  return parts.join(' — ')
}

export function CitationBox({
  title,
  sourceName,
  edition,
  reference,
  language,
  translator,
  publisher,
  revision,
  sourceUrl,
  className,
  ...props
}: CitationProps) {
  const [copied, setCopied] = useState(false)
  const citationText = formatCitation({
    title,
    sourceName,
    edition,
    reference,
    language,
    translator,
    publisher,
    revision
  })

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(citationText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // Fallback
    }
  }

  return (
    <Card className={`border border-border bg-card shadow-sm ${className || ''}`} {...props}>
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Citation Reference
            </span>
            {language && (
              <Badge variant="outline" className="text-[10px] uppercase">
                {language}
              </Badge>
            )}
          </div>
          <p className="text-sm font-medium text-foreground select-all">
            {citationText}
          </p>
          {publisher && (
            <p className="text-xs text-muted-foreground">
              Publisher: {publisher}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground h-8 transition-colors"
            >
              Source Link
            </a>
          )}
          <Button
            variant={copied ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleCopy}
            className="text-xs h-8"
            aria-label="Copy citation to clipboard"
          >
            {copied ? 'Copied' : 'Copy Citation'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
