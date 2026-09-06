"use client"

import {
  ContributionSection,
  NetworkFooter,
  NetworkHeader,
  defaultContributionItems,
} from "./os-global-knowledge-network-sections"
import { OSGlobalKnowledgeNetworkCenterColumn } from "./os-global-knowledge-network-center-column"
import { OSGlobalKnowledgeNetworkLeftColumn } from "./os-global-knowledge-network-left-column"
import { OSGlobalKnowledgeNetworkRightColumn } from "./os-global-knowledge-network-right-column"

export function OSGlobalKnowledgeNetwork() {
  return (
    <section
      id="network"
      className="relative z-10 overflow-hidden border-b border-blue-500/30 bg-background py-20 font-mono text-foreground"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
        <div className="bg-radial-gradient absolute top-1/2 left-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 from-blue-900/15 via-background/60 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-6 sm:px-10">
        <NetworkHeader
          sectionNumber="11"
          label="GLOBAL KNOWLEDGE NETWORK"
          title="TOGETHER, WE PRESERVE. TOGETHER, WE DISCOVER."
          arabicQuote="وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ"
          quote="And cooperate in righteousness and piety."
          reference="Qur'an 5:2"
        />

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <OSGlobalKnowledgeNetworkLeftColumn />
          <OSGlobalKnowledgeNetworkCenterColumn />
          <OSGlobalKnowledgeNetworkRightColumn />
        </div>

        <ContributionSection items={defaultContributionItems} />
        <NetworkFooter />
      </div>
    </section>
  )
}
