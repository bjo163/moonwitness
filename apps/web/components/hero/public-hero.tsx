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
    <section id="hero" className="relative overflow-hidden border-b border-cyber-cyan/20 bg-cyber-dark pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-cosmic-grid opacity-40" />
      <div className="pointer-events-none absolute -top-48 right-[-12rem] h-[32rem] w-[32rem] rounded-full bg-cyber-cyan/10 blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
        <div className="max-w-3xl space-y-8">
          <p className="font-mono text-xs font-semibold tracking-[0.24em] text-cyber-cyan uppercase">
            A PUBLIC OBSERVATORY FOR A LIFE OF MEANING
          </p>
          <div className="space-y-5">
            <h1 className="font-orbitron text-4xl leading-[1.08] font-semibold tracking-tight text-white uppercase sm:text-6xl lg:text-7xl">
              Look up. Learn deeply. Live deliberately.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              MoonWitness brings the sky, sacred knowledge, and human history into one calm place for observation and reflection.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/observatory" className="clip-btn inline-flex items-center gap-2 bg-cyber-cyan px-5 py-3 font-mono text-xs font-bold tracking-widest text-cyber-dark uppercase transition-colors hover:bg-white">
              Open observatory <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/knowledge" className="clip-btn inline-flex items-center gap-2 border border-cyber-cyan/35 px-5 py-3 font-mono text-xs font-bold tracking-widest text-cyber-cyan uppercase transition-colors hover:bg-cyber-cyan/10">
              Explore knowledge
            </Link>
          </div>
        </div>

        <aside className="panel-glass clip-card relative p-5 sm:p-6">
          <p className="mb-6 font-mono text-[11px] font-semibold tracking-[0.18em] text-cyber-cyan/70 uppercase">A simple daily loop</p>
          <div className="space-y-5">
            {focusPoints.map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex gap-4">
                <div className="clip-rune flex h-10 w-10 shrink-0 items-center justify-center border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-mono text-sm font-bold tracking-widest text-white uppercase">{label}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
