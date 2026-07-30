import React from "react"
import {
  Moon,
  Eye,
  AlertTriangle,
  Target,
  BookOpen,
  Bot,
  FileText,
} from "lucide-react"

export function KnowledgeSignalsWidget() {
  return (
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-3 xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[9px] font-black tracking-widest text-primary uppercase">
          KNOWLEDGE SIGNALS
        </div>
        <div className="cursor-pointer text-[8px] text-primary hover:text-white">
          View All
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {[
          {
            n: "Moon Observation",
            v: "+32%",
            s: "Rising",
            c: "text-success",
            icon: Moon,
          },
          {
            n: "Hilal Visibility",
            v: "+29%",
            s: "Rising",
            c: "text-success",
            icon: Eye,
          },
          {
            n: "End Times Signs",
            v: "+21%",
            s: "Rising",
            c: "text-success",
            icon: AlertTriangle,
          },
          {
            n: "Astronomy Discovery",
            v: "+18%",
            s: "Stable",
            c: "text-warning",
            icon: Target,
          },
          {
            n: "Qur'an Studies",
            v: "+17%",
            s: "Rising",
            c: "text-success",
            icon: BookOpen,
          },
          {
            n: "AI in Knowledge",
            v: "+15%",
            s: "Stable",
            c: "text-warning",
            icon: Bot,
          },
          {
            n: "Translation Activity",
            v: "+12%",
            s: "Rising",
            c: "text-success",
            icon: FileText,
          },
        ].map((sig, i) => (
          <div
            key={i}
            className="group flex cursor-default items-center justify-between rounded p-1 transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <sig.icon className="h-3.5 w-3.5 text-primary transition-colors group-hover:text-white" />
              <span className="text-[9px] text-primary transition-colors group-hover:text-white">
                {sig.n}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-[9px] font-bold ${sig.c}`}>
                {sig.v}
              </span>
              <span className={`text-[7px] uppercase ${sig.c}`}>{sig.s}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
