"use client"

import { Panel, Section } from "@workspace/ui"
import { MoonwitnessFrameworkHeader, MoonwitnessKnowledgeModules } from "./moonwitness-knowledge-framework-modules"
import { MoonwitnessKnowledgeFrameworkIntegration } from "./moonwitness-knowledge-framework-integration"

export function MoonwitnessKnowledgeFramework() {
  return <Section id="knowledge-framework" borderColor="cyan" className="relative"><div className="relative z-10"><Panel className="relative rounded-md border border-border bg-card p-6"><div className="absolute -top-3 left-1/2 z-50 -translate-x-1/2 border border-border bg-card px-4 py-1 text-xs font-medium text-primary">Knowledge core</div><MoonwitnessFrameworkHeader /><MoonwitnessKnowledgeModules /><MoonwitnessKnowledgeFrameworkIntegration /></Panel></div></Section>
}
