import { BookOpen, Brain, Cpu, Orbit, Sun } from "lucide-react"

const stages = [
  ["OBSERVE REALITY", "Through history and revelation", BookOpen, "text-danger"],
  ["EXPLORE CREATION", "Through cosmos and signs", Orbit, "text-success"],
  ["REFLECT WISDOM", "Through deep contemplation", Brain, "text-primary"],
  ["ILLUMINATE UNDERSTANDING", "Through integrated unity", Sun, "text-foreground"],
] as const

export function MoonwitnessKnowledgeFrameworkIntegration() {
  return <div className="bg-background mt-12 rounded-lg border border-border p-7 font-mono text-xs shadow-inner"><div className="mb-6 flex items-center gap-3 border-b border-primary/30 pb-4"><Cpu className="h-5 w-5 animate-pulse text-primary" /><span className="text-sm font-black tracking-widest text-foreground uppercase">THE INTEGRATION PATH</span></div><div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 xl:grid-cols-4">{stages.map(([title, copy, Icon, color]) => <div key={title} className="flex items-center gap-3.5 rounded-md border border-border p-4 shadow-inner"><div className={`shrink-0 rounded-full border border-border bg-muted/30 p-2.5 ${color}`}><Icon className="h-5 w-5" /></div><div><div className="text-xs font-black tracking-wider text-foreground uppercase">{title}</div><div className="font-sans text-[11px] text-primary">{copy}</div></div></div>)}</div><div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-xs tracking-wider text-primary"><span className="font-bold text-foreground">SYSTEM ID: <span className="text-primary">MWOS-2026-0525</span></span><span>STATUS: ONLINE</span></div></div>
}
