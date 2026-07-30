import React from "react"
import { MoonwitnessKnowledgeFramework } from "@modules/knowledge/components/moonwitness-knowledge-framework"
import { OSScriptureIntelligence } from "@modules/home/components/os-scripture-intelligence"

export function HomeKnowledgeSection() {
  return (
    <section
      id="knowledge"
      className="relative flex min-h-screen flex-col gap-10 py-10"
    >
      <div className="mx-auto mb-4 w-full max-w-[1700px] px-6 sm:px-10">
        <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-cyan-500/50 uppercase">
          [ SECTION 03 : KNOWLEDGE MODULES ]
        </h2>
      </div>
      <MoonwitnessKnowledgeFramework />
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10">
        <OSScriptureIntelligence />
      </div>
    </section>
  )
}
