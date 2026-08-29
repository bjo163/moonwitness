import Link from "next/link"
import { ArrowRight, BookOpen, Compass, MoonStar } from "lucide-react"

const focusPoints = [
  {
    icon: MoonStar,
    label: "OBSERVE",
    text: "Follow the moon, prayer times, qibla, and celestial events in context.",
  },
  {
    icon: BookOpen,
    label: "UNDERSTAND",
    text: "Read scripture and hadith with tools designed for steady, thoughtful study.",
  },
  {
    icon: Compass,
    label: "REFLECT",
    text: "Connect history, character, and daily practice into a meaningful rhythm.",
  },
]

export function PublicHero() {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-border bg-background pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="pointer-events-none absolute -top-48 right-[-12rem] h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
        <div className="max-w-3xl space-y-8">
          <p className="font-mono text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            A PUBLIC OBSERVATORY FOR A LIFE OF MEANING
          </p>
          <div className="space-y-5">
            <h1 className="text-4xl leading-[1.08] font-bold tracking-tight text-foreground uppercase sm:text-6xl lg:text-7xl font-sans">
              Look up. Learn deeply. Live deliberately.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              MoonWitness brings the sky, sacred knowledge, and human history into one calm place for observation and reflection.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/observatory" className="rounded-lg inline-flex items-center gap-2 bg-primary px-5 py-3 font-mono text-xs font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 shadow-sm">
              Open observatory <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/knowledge" className="rounded-lg inline-flex items-center gap-2 border border-border bg-card px-5 py-3 font-mono text-xs font-bold tracking-widest text-foreground uppercase transition-colors hover:bg-accent">
              Explore knowledge
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-card/80 backdrop-blur-md relative p-5 sm:p-6 shadow-sm">
          <p className="mb-6 font-mono text-[11px] font-semibold tracking-[0.18em] text-primary/70 uppercase">A simple daily loop</p>
          <div className="space-y-5">
            {focusPoints.map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex gap-4">
                <div className="rounded-xl flex h-10 w-10 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-mono text-sm font-bold tracking-widest text-foreground uppercase">{label}</h2>
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
