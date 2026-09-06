"use client"

import { Panel, Section } from "@workspace/ui"
import { MoonwitnessFrameworkHeader, MoonwitnessKnowledgeModules } from "./moonwitness-knowledge-framework-modules"
import { MoonwitnessKnowledgeFrameworkIntegration } from "./moonwitness-knowledge-framework-integration"

export function MoonwitnessKnowledgeFramework() {
  return <Section id="knowledge-framework" borderColor="cyan" className="relative"><div className="pointer-events-none absolute inset-0"><div className="bg-radial-gradient absolute top-1/2 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/2 from-primary/10 via-indigo-950/10 to-transparent blur-[140px]" /></div><div className="relative z-10"><Panel className="bg-background/90 relative p-6 shadow-sm backdrop-blur-xl"><div className="bg-background absolute -top-3 left-1/2 z-50 -translate-x-1/2 border border-primary/50 px-6 py-0.5 text-[10px] font-black tracking-[0.3em] text-primary uppercase">─── KNOWLEDGE CORE ───</div><MoonwitnessFrameworkHeader /><MoonwitnessKnowledgeModules /><MoonwitnessKnowledgeFrameworkIntegration /></Panel></div></Section>
}
