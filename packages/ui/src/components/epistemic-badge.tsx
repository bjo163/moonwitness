'use client'

import * as React from 'react'
import { Badge } from './badge'

export type AuthorityClass =
  | 'REVELATION'
  | 'TRADITION'
  | 'INTERPRETIVE'
  | 'RESEARCH'
  | 'EXCLUDED'
  | 'PRIMARY_SOURCE'
  | 'TRANSLATION'
  | 'DERIVED'
  | 'AI_ASSISTED'

export type ContentKind =
  | 'ORIGINAL_TEXT'
  | 'TRANSLATION'
  | 'TRANSLITERATION'
  | 'COMMENTARY'
  | 'TAFSIR'
  | 'MATN'
  | 'DERIVED'
  | 'AI_GENERATED'

export type EnginePolicyRole =
  | 'NORMATIVE_CORE'
  | 'COMPLEMENTARY_REFERENCE'
  | 'CONTEXTUAL'
  | 'RESEARCH_ONLY'
  | 'EXCLUDED'

interface EpistemicBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  authority?: AuthorityClass | string
  contentKind?: ContentKind | string
  engineRole?: EnginePolicyRole | string
  isAiGenerated?: boolean
}

export function EpistemicBadge({
  authority,
  contentKind,
  engineRole,
  isAiGenerated,
  className,
  ...props
}: EpistemicBadgeProps) {
  return (
    <div className={`inline-flex flex-wrap items-center gap-1.5 ${className || ''}`} {...props}>
      {/* Content Type Badge */}
      {contentKind && (
        <Badge
          variant={contentKind === 'ORIGINAL_TEXT' ? 'default' : 'secondary'}
          className="text-[11px] font-medium"
        >
          {contentKind === 'ORIGINAL_TEXT'
            ? 'Original Source'
            : contentKind === 'TRANSLATION'
            ? 'Translation'
            : contentKind === 'TRANSLITERATION'
            ? 'Transliteration'
            : contentKind === 'COMMENTARY' || contentKind === 'TAFSIR'
            ? 'Commentary'
            : contentKind}
        </Badge>
      )}

      {/* Authority Classification Badge */}
      {authority && (
        <Badge
          variant="outline"
          className={`text-[11px] font-medium ${
            authority === 'REVELATION' || authority === 'PRIMARY_SOURCE'
              ? 'border-primary/40 text-primary bg-primary/5'
              : authority === 'TRADITION'
              ? 'border-info/40 text-info bg-info/5'
              : authority === 'RESEARCH' || authority === 'INTERPRETIVE'
              ? 'border-muted-foreground/30 text-muted-foreground'
              : 'border-destructive/40 text-destructive bg-destructive/5'
          }`}
        >
          {authority === 'REVELATION'
            ? 'Revelation'
            : authority === 'TRADITION'
            ? 'Tradition'
            : authority === 'INTERPRETIVE'
            ? 'Interpretation'
            : authority === 'RESEARCH'
            ? 'Research Dataset'
            : authority}
        </Badge>
      )}

      {/* AI Attribution Badge */}
      {isAiGenerated && (
        <Badge
          variant="outline"
          className="border-warning/40 text-warning bg-warning/5 text-[11px] font-medium"
        >
          AI-Assisted Synthesis
        </Badge>
      )}

      {/* Engine Application Role Badge */}
      {engineRole && (
        <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">
          Policy: {engineRole.replace(/_/g, ' ')}
        </Badge>
      )}
    </div>
  )
}
