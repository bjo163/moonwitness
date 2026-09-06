import Link from "next/link"
import { ArrowUpRight, BookOpen, CalendarDays, History, MoonStar, Search, ShieldCheck } from "lucide-react"
import { PublicHero } from "../hero/public-hero"

const destinations = [
  { id: "observatory", icon: MoonStar, title: "Observatory", description: "Moon phases, prayer times, qibla, and celestial events grounded in your place and time.", href: "/observatory", action: "View the sky" },
  { id: "knowledge", icon: BookOpen, title: "Scripture", description: "Browse public scripture structure and open a passage with its source text and available translations.", href: "/knowledge/kitab", action: "Browse scripture" },
  { id: "traditions", icon: History, title: "Traditions", description: "Explore hadith collections and read public tradition records with their available references.", href: "/knowledge/hadits", action: "Browse traditions" },
]

const tools = [
  { icon: CalendarDays, title: "Calendar", href: "/observatory/lunar-calendar" },
  { icon: Search, title: "Corpus search", href: "/knowledge/search" },
  { icon: ShieldCheck, title: "Sources & provenance", href: "/knowledge/sources" },
]

export function PublicHome() {
  return (
    <div className="bg-background text-foreground font-sans">
      <PublicHero />

      <section id="observatory" className="border-b border-border py-8">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-semibold text-primary">Public knowledge, source-aware</p>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Explore sources and references.</h2>
            <p className="text-base leading-relaxed text-muted-foreground">MoonWitness connects public source records to readable references, translations, and provenance so you can move from discovery to careful reading.</p>
          </div>
          <div className="mt-5 divide-y divide-border">
            {destinations.map(({ id, icon: Icon, title, description, href, action }) => (
              <article key={id} id={`destination-${id}`} className="rounded-md flex flex-col py-4">
                <div>
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
                </div>
                <Link href={href} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4">
                  {action} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="analytics" className="border-b border-border bg-muted/40 py-8">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold text-success">Designed for return visits</p>
            <h2 className="mt-4 text-xl font-semibold text-foreground">A useful rhythm, not another feed.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {tools.map(({ icon: Icon, title, href }) => (
              <Link key={title} href={href} className="rounded-md group border border-border bg-card p-3 hover:border-primary/40 transition-colors">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="mt-3 block text-sm font-medium text-foreground">{title}</span>
                <ArrowUpRight className="mt-4 h-4 w-4 text-muted-foreground transition-transform " />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="py-8">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <p className="text-xs font-semibold text-warning">The intention</p>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Knowledge should bring us closer to what matters.</h2>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">MoonWitness is an open public space for observation, study, and reflection — built to make depth easier to return to every day.</p>
          <Link href="/home" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4">Begin with today <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <footer id="footer" className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span className="font-semibold">MoonWitness</span>
          <span>Observe with care. Learn with humility.</span>
        </div>
      </footer>
    </div>
  )
}
