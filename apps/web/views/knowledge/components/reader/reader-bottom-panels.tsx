"use client"

import React from "react"
import { CheckCircle2 } from "lucide-react"
import { CitationBox, ProvenanceCard } from "@workspace/ui"

export interface ReaderBottomPanelsProps {
  bottomPanels?: {
    themes?: string[]
    related?: Array<{ ref: string; desc: string }>
    tafsir_highlight?: { text: string; author: string }
    science?: string[]
    citation?: {
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
    provenance?: {
      sourceName?: string
      sourceKey?: string
      edition?: string
      revision?: string
      publisher?: string
      language?: string
      license?: string
      checksum?: string
      authority?: string
      contentKind?: string
    }
  }
}

export function ReaderBottomPanels({ bottomPanels }: ReaderBottomPanelsProps) {
  if (!bottomPanels) return null

  return (
    <div className="border-t border-border bg-card px-6 py-5 space-y-6">
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-4 md:grid-cols-4">
        {bottomPanels.themes && bottomPanels.themes.length > 0 && (
          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-foreground/50 uppercase">
              THEMES & TOPICS
            </h4>
            <div className="flex flex-wrap gap-2">
              {bottomPanels.themes.map((t, i) => (
                <span
                  key={i}
                  className="cursor-pointer rounded border border-border bg-muted/30 px-2 py-1 text-[9px] font-bold text-foreground/60 transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {bottomPanels.related && bottomPanels.related.length > 0 && (
          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-foreground/50 uppercase">
              RELATED VERSES
            </h4>
            <div className="space-y-2">
              {bottomPanels.related.map((r, i) => (
                <div key={i} className="text-xs">
                  <span className="mr-2 font-bold text-primary">{r.ref}</span>
                  <span className="text-foreground/50">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {bottomPanels.tafsir_highlight && (
          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-foreground/50 uppercase">
              TAFSIR HIGHLIGHT
            </h4>
            <p className="border-l-2 border-warning/60 pl-3 text-xs leading-relaxed text-foreground/70 italic">
              &quot;{bottomPanels.tafsir_highlight.text}&quot;
              <span className="mt-2 block font-bold text-foreground/50 not-italic">
                — {bottomPanels.tafsir_highlight.author}
              </span>
            </p>
          </div>
        )}

        {bottomPanels.science && bottomPanels.science.length > 0 && (
          <div>
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-foreground/50 uppercase">
              FEATURES
            </h4>
            <ul className="space-y-2 text-xs text-foreground/60">
              {bottomPanels.science.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 text-success" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Source Citation and Provenance Transparency */}
      <div className="mx-auto max-w-[1920px] grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {bottomPanels.citation && (
          <CitationBox
            title={bottomPanels.citation.title}
            sourceName={bottomPanels.citation.sourceName}
            edition={bottomPanels.citation.edition}
            reference={bottomPanels.citation.reference}
            language={bottomPanels.citation.language}
            translator={bottomPanels.citation.translator}
            publisher={bottomPanels.citation.publisher}
            revision={bottomPanels.citation.revision}
            sourceUrl={bottomPanels.citation.sourceUrl}
          />
        )}

        {bottomPanels.provenance && (
          <ProvenanceCard
            provenance={{
              sourceName: bottomPanels.provenance.sourceName,
              sourceKey: bottomPanels.provenance.sourceKey,
              edition: bottomPanels.provenance.edition,
              revision: bottomPanels.provenance.revision,
              publisher: bottomPanels.provenance.publisher,
              language: bottomPanels.provenance.language,
              license: bottomPanels.provenance.license,
              checksum: bottomPanels.provenance.checksum,
              authority: bottomPanels.provenance.authority || "REVELATION",
              contentKind: bottomPanels.provenance.contentKind || "ORIGINAL_TEXT"
            }}
          />
        )}
      </div>
    </div>
  )
}
