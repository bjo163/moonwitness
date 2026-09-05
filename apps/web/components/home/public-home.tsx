import Link from "next/link"
import {
  ArrowUpRight,
  BookOpenText,
  CalendarDays,
  Compass,
  History,
  MoonStar,
  Network,
  Search,
  ShieldCheck,
  Telescope,
} from "lucide-react"

import { PublicHero } from "../hero/public-hero"

const pathways = [
  {
    icon: Telescope,
    title: "Observatory",
    description:
      "Follow lunar cycles, prayer times, qibla, and celestial events with place and time kept in context.",
    href: "/observatory",
    action: "View the sky",
  },
  {
    icon: BookOpenText,
    title: "Scripture core",
    description:
      "Read public scripture records with source text, translations, structure, and available provenance.",
    href: "/knowledge/kitab",
    action: "Browse scripture",
  },
  {
    icon: History,
    title: "Traditions and history",
    description:
      "Explore traditions, historical records, and connected references without collapsing their source boundaries.",
    href: "/knowledge/hadits",
    action: "Trace traditions",
  },
  {
    icon: Search,
    title: "Knowledge search",
    description:
      "Move across the public corpus by concept, source, and reference while preserving a path back to evidence.",
    href: "/knowledge/search",
    action: "Search the corpus",
  },
]

const principles = [
  {
    icon: ShieldCheck,
    title: "Source-aware by design",
    text: "References, translations, evidence, and synthesis remain distinct so the reader can see what each statement rests on.",
  },
  {
    icon: Compass,
    title: "Context before conclusion",
    text: "Time, place, source identity, and surrounding records stay visible before interpretation moves forward.",
  },
  {
    icon: Network,
    title: "Connected without flattening",
    text: "MoonWitness links observations and records while preserving the boundaries between astronomy, scripture, history, and research.",
  },
]

const tools = [
  {
    icon: CalendarDays,
    title: "Lunar calendar",
    description: "Return to the sky through a calendar built around lunar rhythm.",
    href: "/observatory/lunar-calendar",
  },
  {
    icon: Search,
    title: "Corpus search",
    description: "Search public knowledge while keeping references close at hand.",
    href: "/knowledge/search",
  },
  {
    icon: ShieldCheck,
    title: "Sources and provenance",
    description: "Inspect where records come from and how they are represented.",
    href: "/knowledge/sources",
  },
]

const rhythm = [
  ["01", "Observe", "Begin with what can be seen, measured, located, or dated."],
  ["02", "Read", "Open the relevant source instead of relying on a detached summary."],
  ["03", "Trace", "Follow references, chronology, provenance, and connected records."],
  ["04", "Reflect", "Hold interpretation after evidence, context, and uncertainty are visible."],
] as const

export function PublicHome() {
  return (
    <div className="bg-background text-foreground">
      <PublicHero />

      <section className="border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-semibold tracking-widest text-primary">
                One observatory, multiple lenses
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Explore the sky, the sources, and the story around them.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg lg:justify-self-end">
              MoonWitness is designed as a public research surface: discovery should
              lead naturally to the record, the record to its context, and context to
              a more careful understanding.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {pathways.map(({ icon: Icon, title, description, href, action }) => (
              <article
                key={title}
                className="group flex min-h-72 flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:p-7"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
                    {description}
                  </p>
                </div>
                <Link
                  href={href}
                  className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  {action}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="font-mono text-xs font-semibold tracking-widest text-success">
                Evidence before certainty
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Built to preserve context, not erase it.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                A useful observatory does more than show an answer. It shows the path
                that made the answer possible and keeps different kinds of knowledge
                from being silently merged together.
              </p>
              <Link
                href="/methodology"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Read the methodology <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {principles.map(({ icon: Icon, title, text }, index) => (
                <article
                  key={title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7"
                >
                  <div className="flex gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-mono text-[11px] tracking-widest text-muted-foreground">
                        PRINCIPLE {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">
                        {title}
                      </h3>
                      <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                <MoonStar className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                A daily rhythm for deeper reading.
              </h2>
              <p className="mt-4 max-w-md leading-7 text-muted-foreground">
                MoonWitness is not built as an endless feed. It is built as a place
                worth returning to with a question.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {rhythm.map(([number, title, text]) => (
                <div key={number} className="bg-card p-6 sm:p-7">
                  <p className="font-mono text-xs font-semibold tracking-widest text-primary">
                    {number}
                  </p>
                  <h3 className="mt-8 text-xl font-semibold text-foreground">{title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs font-semibold tracking-widest text-primary">
                Return points
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                Useful places to begin today.
              </h2>
            </div>
            <Link href="/knowledge" className="text-sm font-semibold text-primary">
              View all knowledge <ArrowUpRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {tools.map(({ icon: Icon, title, description, href }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-8 text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                <ArrowUpRight className="mt-7 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 text-center sm:px-10">
          <p className="font-mono text-xs font-semibold tracking-widest text-warning">
            The intention
          </p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Reflect goodness. Spread wisdom. Guide with humility.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            MoonWitness exists to make observation, study, and reflection easier to
            return to — with the source still visible and the mystery still respected.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Begin exploring <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
            >
              About MoonWitness
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span className="font-mono font-semibold tracking-widest text-foreground">
            MoonWitness
          </span>
          <span>Observe with care. Learn with humility.</span>
        </div>
      </footer>
    </div>
  )
}
