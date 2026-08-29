import Link from "next/link"
import { ArrowUpRight, BookOpen, CalendarDays, Globe2, History, LineChart, MoonStar } from "lucide-react"
import { PublicHero } from "../hero/public-hero"

const destinations = [
  { id: "observatory", icon: MoonStar, title: "Observatory", description: "Moon phases, prayer times, qibla, and celestial events grounded in your place and time.", href: "/observatory", action: "View the sky" },
  { id: "knowledge", icon: BookOpen, title: "Knowledge", description: "A focused reading space for Qur'an, hadith, daily adhkar, and the ideas that shape a faithful life.", href: "/knowledge", action: "Start reading" },
  { id: "history", icon: History, title: "History & reflection", description: "Trace the people, choices, and turning points that help us read the present with greater wisdom.", href: "/history", action: "Explore history" },
]

const tools = [
  { icon: CalendarDays, title: "Calendar", href: "/observatory/lunar-calendar" },
  { icon: Globe2, title: "Global monitoring", href: "/observatory/global-monitoring" },
  { icon: LineChart, title: "Personal reflection", href: "/analytics" },
]

export function PublicHome() {
  return (
    <div className="bg-cyber-dark text-white">
      <PublicHero />

      <section id="observatory" className="border-b border-cyber-cyan/15 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-xs font-semibold tracking-[0.22em] text-cyber-cyan uppercase">One place, three ways in</p>
            <h2 className="font-orbitron text-3xl font-semibold tracking-tight text-white uppercase sm:text-5xl">A clearer way to pay attention.</h2>
            <p className="text-base leading-relaxed text-white/60 sm:text-lg">Use MoonWitness as a companion for the moments that deserve more attention: the sky above you, the words you are studying, and the history you are carrying forward.</p>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {destinations.map(({ id, icon: Icon, title, description, href, action }) => (
              <article key={id} id={id} className="clip-card flex min-h-72 flex-col justify-between border border-cyber-cyan/20 bg-cyber-panel p-6 transition-colors hover:border-cyber-cyan/50">
                <div>
                  <Icon className="h-7 w-7 text-cyber-cyan" aria-hidden="true" />
                  <h3 className="mt-8 font-orbitron text-xl font-semibold text-white uppercase">{title}</h3>
                  <p className="mt-3 leading-relaxed text-white/60">{description}</p>
                </div>
                <Link href={href} className="mt-8 inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-cyber-cyan uppercase hover:text-white">
                  {action} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="analytics" className="border-b border-cyber-cyan/15 bg-cyber-panel/40 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="font-mono text-xs font-semibold tracking-[0.22em] text-cyber-green uppercase">Designed for return visits</p>
            <h2 className="mt-4 font-orbitron text-3xl font-semibold text-white uppercase sm:text-4xl">A useful rhythm, not another feed.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {tools.map(({ icon: Icon, title, href }) => (
              <Link key={title} href={href} className="clip-card group border border-white/10 bg-cyber-dark/70 p-5 hover:border-cyber-cyan/40">
                <Icon className="h-5 w-5 text-cyber-cyan" aria-hidden="true" />
                <span className="mt-8 block font-mono text-xs font-bold tracking-widest text-white uppercase">{title}</span>
                <ArrowUpRight className="mt-4 h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <p className="font-mono text-xs font-semibold tracking-[0.22em] text-cyber-yellow uppercase">The intention</p>
          <h2 className="mt-4 font-orbitron text-3xl font-semibold text-white uppercase sm:text-5xl">Knowledge should bring us closer to what matters.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">MoonWitness is an open public space for observation, study, and reflection — built to make depth easier to return to every day.</p>
          <Link href="/home" className="mt-8 inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-cyber-cyan uppercase hover:text-white">Begin with today <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <footer id="footer" className="border-t border-cyber-cyan/15 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span className="font-mono tracking-widest uppercase">MoonWitness</span>
          <span>Observe with care. Learn with humility.</span>
        </div>
      </footer>
    </div>
  )
}
