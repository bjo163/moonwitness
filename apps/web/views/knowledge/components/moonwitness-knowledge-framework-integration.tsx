import { BookOpen, Brain, Cpu, Orbit, Sun } from "lucide-react"

const stages = [
  ["OBSERVE REALITY", "Through history and revelation", BookOpen, "text-danger"],
  ["EXPLORE CREATION", "Through cosmos and signs", Orbit, "text-success"],
  ["REFLECT WISDOM", "Through deep contemplation", Brain, "text-primary"],
  ["ILLUMINATE UNDERSTANDING", "Through integrated unity", Sun, "text-foreground"],
] as const

export function MoonwitnessKnowledgeFrameworkIntegration() {
  return <div className="mt-10 rounded-md border border-border bg-background p-5 text-sm"><div className="mb-6 flex items-center gap-3 border-b border-border pb-4"><Cpu className="h-5 w-5 text-primary" /><span className="font-semibold text-foreground">Integration path</span></div><div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 xl:grid-cols-4">{stages.map(([title, copy, Icon, color]) => <div key={title} className="flex items-center gap-3.5 rounded-md border border-border p-4"><div className={`shrink-0 rounded-full border border-border bg-muted p-2.5 ${color}`}><Icon className="h-5 w-5" /></div><div><div className="text-sm font-medium text-foreground">{title}</div><div className="text-sm text-muted-foreground">{copy}</div></div></div>)}</div><div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-sm text-muted-foreground"><span className="font-medium text-foreground">System ID: <span className="text-primary">MWOS-2026-0525</span></span><span>Status: online</span></div></div>
}
