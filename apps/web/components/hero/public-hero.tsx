import Link from "next/link"
import { ArrowRight, BookOpen, Compass, MoonStar } from "lucide-react"

const focusPoints = [
  {
    icon: MoonStar,
    label: "Observe",
    text: "Follow the moon, prayer times, qibla, and celestial events in context.",
  },
  {
    icon: BookOpen,
    label: "Understand",
    text: "Read scripture and hadith with tools designed for steady, thoughtful study.",
  },
  {
    icon: Compass,
    label: "Reflect",
    text: "Connect history, character, and daily practice into a meaningful rhythm.",
  },
]

export function PublicHero() {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-border bg-background pt-24 pb-8">

      <div className="relative mx-auto grid max-w-6xl gap-6 px-6 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold text-primary">
            Observation, sources, and research
          </p>
          <div className="space-y-3">
            <h1 className="text-2xl leading-tight font-semibold tracking-tight text-foreground sm:text-3xl">
              Look up. Learn deeply. Live deliberately.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              MoonWitness brings the sky, sacred knowledge, and human history into one calm place for observation and reflection.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/observatory" className="rounded-md inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Open observatory <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/knowledge" className="rounded-md inline-flex items-center gap-2 border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent">
              Explore knowledge
            </Link>
          </div>
        </div>

        <aside className="rounded-md border border-border bg-background relative p-4">
          <p className="mb-3 text-[11px] font-semibold text-primary/70">A simple daily loop</p>
          <div className="space-y-5">
            {focusPoints.map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex gap-4">
                <div className="rounded-md flex h-10 w-10 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">{label}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
