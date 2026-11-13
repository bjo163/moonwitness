"use client"

import { ArrowRight, CheckCircle2, Scale, Shield, Users } from "lucide-react"
import { Button } from "@workspace/ui"

const PILLARS = [
  {
    title: "UNIVERSAL JUSTICE",
    description:
      "Ensuring fair treatment, equal rights, and unbiased trials for all humanity regardless of background.",
    Icon: Scale,
    color: "text-success",
    background: "bg-success/10",
    border: "border-success/30",
  },
  {
    title: "LIBERATION OF OPPRESSED",
    description:
      "Actively breaking the systemic chains of the Mustadhafin (the marginalized and oppressed).",
    Icon: Shield,
    color: "text-primary",
    background: "bg-primary/10",
    border: "border-border",
  },
  {
    title: "HUMAN RIGHTS ADVOCACY",
    description:
      "Providing immediate legal aid, resources, and protection for those facing tyrannical systems.",
    Icon: Users,
    color: "text-blue-400",
    background: "bg-blue-400/10",
    border: "border-blue-500/30",
  },
] as const

const ACTIVE_FRONTS = [
  {
    region: "Gaza Legal Defense",
    status: "Active Filing",
    progress: 75,
    cases: "12,450",
    color: "bg-emerald-500",
  },
  {
    region: "Uyghur Human Rights",
    status: "Investigating",
    progress: 45,
    cases: "8,300",
    color: "bg-primary",
  },
  {
    region: "Sudan Refugee Aid",
    status: "Intervention",
    progress: 60,
    cases: "5,120",
    color: "bg-blue-500",
  },
] as const

const DIRECTIVES = [
  "Uphold truth unequivocally",
  "Protect the weak and voiceless",
  "Reject systemic tyranny",
  "Ensure equitable resource distribution",
  "Foster restorative justice",
]

export function JusticePillars() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      {PILLARS.map(({ title, description, Icon, color, background, border }) => (
        <div
          key={title}
          className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-border"
        >
          <div
            className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg border ${background} ${border} transition-transform group-hover:scale-110`}
          >
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <h3 className="mb-3 text-sm font-bold tracking-widest text-foreground uppercase">
            {title}
          </h3>
          <p className="mb-6 text-[11px] leading-relaxed text-muted-foreground">
            {description}
          </p>
          <Button type="button" variant="ghost"
            className={`group/btn flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase ${color}`}
          >
            EXPLORE INITIATIVE <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export function LiberationFronts() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 lg:col-span-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[10px] font-bold tracking-widest text-foreground uppercase">
          ACTIVE LIBERATION FRONTS
        </h3>
        <span className="rounded border border-success/30 bg-success/20 px-2 py-1 text-[8px] font-bold tracking-widest text-success uppercase">
          3 HIGH PRIORITY
        </span>
      </div>

      <div className="space-y-4">
        {ACTIVE_FRONTS.map((front) => (
          <div
            key={front.region}
            className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center"
          >
            <div>
              <div className="mb-1 text-[11px] font-bold tracking-widest text-foreground uppercase">
                {front.region}
              </div>
              <div className="text-[9px] text-muted-foreground">
                {front.cases} Affected Individuals
              </div>
            </div>
            <div className="w-full max-w-xs flex-1">
              <div className="mb-1.5 flex justify-between text-[8px] tracking-widest uppercase">
                <span className="text-foreground">{front.status}</span>
                <span className="text-foreground">{front.progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                <div
                  className={`h-full rounded-full ${front.color}`}
                  style={{ width: `${front.progress}%` }}
                />
              </div>
            </div>
            <Button type="button" variant="outline" className="rounded border border-border px-4 py-2 text-[8px] font-bold tracking-widest text-foreground uppercase transition-colors hover:bg-muted/30">
              View Docket
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StrategicDirectives() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-6 lg:col-span-4">
      <div className="mb-6">
        <h3 className="text-[10px] font-bold tracking-widest text-foreground uppercase">
          STRATEGIC DIRECTIVES
        </h3>
        <p className="mt-1 text-[9px] text-muted-foreground">
          Core tenets of prophetic justice
        </p>
      </div>

      <div className="flex-1 space-y-4">
        {DIRECTIVES.map((directive) => (
          <div key={directive} className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            <span className="text-[10px] leading-relaxed text-foreground">
              {directive}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <div className="mb-1 text-[8px] tracking-widest text-muted-foreground uppercase">
          UMBRELLA COMMANDER
        </div>
        <div className="font-mono text-[10px] font-bold text-success">
          ALLIANCE OF THE JUST
        </div>
      </div>
    </div>
  )
}
