import { ArrowRight, BookOpen, Brain, Orbit, Sparkles, Sun } from "lucide-react"
import { Panel } from "@workspace/ui"

const modules = [
  { number: "01", color: "destructive", title: "HAQIQAH", subtitle: "REALITY • HISTORY • TRUTH", icon: BookOpen, copy: "Discover reality through history, scripture, human civilization, and empirical reflections upon ancestral truth." },
  { number: "02", color: "success", title: "FALĀḤ", subtitle: "CREATION • UNIVERSE • GROWTH", icon: Orbit, copy: "Observe creation, explore the cosmos, study scientific astronomy, and cultivate flourishing throughout the living natural world." },
  { number: "03", color: "primary", title: "ḤIKMAH", subtitle: "WISDOM • REFLECTION • PURPOSE", icon: Brain, copy: "Synthesize reality and creation through divine guidance, extracting profound meaning and eternal wisdom." },
  { number: "//", color: "secondary", title: "NŪR", subtitle: "THE ULTIMATE SYNTHESIS", icon: Sun, copy: "The integrated state of awareness. When Truth, Flourishing, and Wisdom align, the mind reaches enlightenment (Nūr)." },
] as const

export function MoonwitnessKnowledgeModules() {
  return <div className="relative my-10 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">{modules.map((module) => <MoonwitnessKnowledgeModule key={module.title} module={module} />)}</div>
}

function MoonwitnessKnowledgeModule({ module }: { module: (typeof modules)[number] }) {
  const Icon = module.icon
  return (
    <Panel accentColor={module.color} className="group bg-background/80 flex min-h-[380px] flex-col justify-between p-7 backdrop-blur-xl">
      <div><div className="mb-4 flex items-center justify-between border-b border-border pb-3.5"><span className="rounded-md border border-border bg-muted/30 px-3 py-1 text-xs font-black tracking-widest text-foreground uppercase">{module.number} // {module.color}</span><span className="h-2.5 w-2.5 animate-ping rounded-full bg-primary shadow-sm" /></div><h3 className="mb-1 font-mono text-3xl font-black tracking-widest text-foreground uppercase">{module.title}</h3><div className="mb-6 font-mono text-[11px] font-black tracking-[0.2em] text-primary uppercase">{module.subtitle}</div></div>
      <div className="relative my-6 flex items-center justify-center"><div className="bg-radial-gradient via-background/60 relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-primary/50 from-primary/20 to-transparent shadow-sm transition-transform duration-300 group-hover:scale-110"><div className="animate-spin-slow absolute h-[120%] w-[120%] rounded-full border border-dashed border-primary/60" style={{ animationDuration: "30s" }} /><Icon className="h-12 w-12 text-primary drop-shadow-sm" /></div><div className="absolute top-1/2 -right-[40px] z-30 hidden -translate-y-1/2 items-center lg:flex"><div className="h-[3px] w-8 bg-primary shadow-sm" /><ArrowRight className="h-4 w-4 text-primary" /></div></div>
      <p className="mt-auto border-t border-border pt-6 font-sans text-xs leading-relaxed font-normal text-primary">{module.copy}</p>
    </Panel>
  )
}

export function MoonwitnessFrameworkHeader() {
  return <div className="mb-12 flex flex-col items-start justify-between gap-8 border-b border-border pb-10 lg:flex-row lg:items-center"><div className="space-y-4"><div className="text-xs font-bold tracking-[0.2em] text-primary uppercase">02 // THE MOONWITNESS KNOWLEDGE FRAMEWORK</div><h2 className="flex items-center gap-4 font-mono text-4xl font-black tracking-wider text-foreground uppercase sm:text-6xl"><span><span className="text-danger">R</span><span className="text-success">G</span><span className="text-primary">B</span></span><ArrowRight className="h-8 w-8 text-foreground sm:h-12 sm:w-12" /><span>LIGHT</span></h2></div><div className="max-w-2xl rounded-md border-y border-r border-l-4 border-primary/30 bg-primary/90 p-5 py-2 pl-6 text-xs leading-relaxed text-foreground shadow-sm sm:text-sm"><p>Light symbolizes the integration of <strong className="text-danger">Reality (Haqiqah)</strong>, <strong className="text-success">Flourishing (Falāḥ)</strong>, and <strong className="text-primary">Wisdom (Ḥikmah)</strong> into a coherent understanding.</p><div className="mt-2.5 border-t border-border pt-2.5 text-xs font-black tracking-[0.15em] text-success uppercase">● Integrated understanding</div></div></div>
}
