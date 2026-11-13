import { resolveSemanticColor } from "@workspace/ui"
import { HERO_BACKGROUNDS } from "./hero/home-hero-constants"

export function HomeHeroVisualLayer({
  bgIndex,
  isZapping,
}: {
  bgIndex: number
  isZapping: boolean
}) {
  return (
    <>
      <div
        className={`pointer-events-none fixed inset-0 z-[999] transition-opacity duration-100 ${isZapping ? "opacity-100" : "opacity-0"}`}
        style={{
          background: `radial-gradient(ellipse at center, color-mix(in srgb, ${resolveSemanticColor("info")} 25%, transparent) 0%, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 75%, transparent 100%)",
        }}
      >
        {HERO_BACKGROUNDS.map((bg, idx) => (
          <div
            key={bg}
            className={`absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${idx === bgIndex ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url('${bg}')` }}
          />
        ))}
        <div className="pointer-events-none absolute top-[140px] right-[220px] z-10 font-mono text-[10px] tracking-[0.3em] text-foreground/40 uppercase">
          LUNA
        </div>
        <div className="pointer-events-none absolute top-[400px] right-[140px] z-10 font-mono text-[9px] tracking-[0.2em] text-primary/50 uppercase">
          ORBIT-7
        </div>
        <div className="absolute inset-0 w-full bg-gradient-to-r from-background via-background/60 to-transparent sm:w-2/3" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="theme-grid-bg absolute inset-0 opacity-15" />
      </div>
    </>
  )
}
