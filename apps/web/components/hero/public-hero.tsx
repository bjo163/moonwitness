import Link from "next/link"
import {
  ArrowRight,
  BookOpenText,
  CircleDot,
  Compass,
  MoonStar,
  Telescope,
} from "lucide-react"

const focusPoints = [
  {
    icon: Telescope,
    label: "Observe",
    text: "Read the sky through lunar cycles, celestial events, place, and time.",
  },
  {
    icon: BookOpenText,
    label: "Study",
    text: "Move through scripture and traditions with source-aware references.",
  },
  {
    icon: Compass,
    label: "Reflect",
    text: "Connect observation, history, evidence, and meaning without losing context.",
  },
]

export function PublicHero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-border bg-background pt-28 pb-20 sm:pt-36 sm:pb-28"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 right-[-10rem] h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-[-10rem] h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 sm:px-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 font-mono text-xs text-muted-foreground shadow-sm backdrop-blur">
            <CircleDot className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            MoonWitness public observatory
          </div>

          <div className="mt-8 space-y-6">
            <p className="font-mono text-xs font-semibold tracking-widest text-primary">
              When the Moon witnesses, we share messages.
            </p>
            <h1 className="max-w-3xl text-5xl leading-[0.98] font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Look beyond the surface. Follow the evidence toward meaning.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              MoonWitness brings celestial observation, scripture, traditions, history,
              and source-aware research into one public space built for careful study.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/observatory"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Open observatory <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
            >
              Explore knowledge
            </Link>
          </div>

          <div className="mt-12 grid gap-5 border-t border-border pt-7 sm:grid-cols-3">
            {focusPoints.map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background/10 to-background/80" />

            <div className="absolute inset-[11%] rounded-full border border-border" aria-hidden="true" />
            <div className="absolute inset-[24%] rounded-full border border-primary/30" aria-hidden="true" />
            <div className="absolute inset-[36%] rounded-full border border-border" aria-hidden="true" />

            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border border-primary/40 bg-background shadow-lg sm:h-40 sm:w-40">
                <MoonStar className="h-16 w-16 text-primary sm:h-20 sm:w-20" />
              </div>
            </div>

            <div className="absolute top-[17%] left-[16%] rounded-xl border border-border bg-background/90 px-3 py-2 shadow-sm backdrop-blur">
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground">SKY</p>
              <p className="mt-1 text-sm font-semibold text-foreground">Celestial context</p>
            </div>

            <div className="absolute right-[10%] bottom-[18%] rounded-xl border border-border bg-background/90 px-3 py-2 shadow-sm backdrop-blur">
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground">SOURCE</p>
              <p className="mt-1 text-sm font-semibold text-foreground">Traceable knowledge</p>
            </div>

            <div className="absolute right-[12%] top-[20%] h-3 w-3 rounded-full bg-success shadow-sm" aria-hidden="true" />
            <div className="absolute bottom-[24%] left-[15%] h-2.5 w-2.5 rounded-full bg-warning shadow-sm" aria-hidden="true" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground">LENS 01</p>
              <p className="mt-2 text-sm font-semibold text-foreground">Observation</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground">LENS 02</p>
              <p className="mt-2 text-sm font-semibold text-foreground">Revelation</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground">LENS 03</p>
              <p className="mt-2 text-sm font-semibold text-foreground">History</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
