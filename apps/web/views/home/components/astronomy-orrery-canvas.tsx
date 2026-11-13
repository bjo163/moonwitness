import { Moon, Sun } from "lucide-react"
import { QiblaRadarWidget } from "@workspace/ui"

function TelemetryPanel({ kind }: { kind: "moon" | "sun" }) {
  const moon = kind === "moon"
  return (
    <div className={`bg-background/80 pointer-events-auto ${moon ? "w-48 border-primary/50" : "w-44 border-amber-500/50"} rounded-lg border p-3 shadow-sm backdrop-blur`}>
      <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
        {moon ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-warning" />}
        <span className={`text-[11px] font-black tracking-wider ${moon ? "text-primary" : "text-warning"}`}>{moon ? "MOON" : "SUN"}</span>
      </div>
      <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[9px]">
        {moon ? <><span className="text-primary">Illumination</span><span className="text-right text-foreground">78.4%</span><span className="text-primary">Age</span><span className="text-right text-primary">12.6 Days</span><span className="text-primary">Distance</span><span className="text-right text-primary">384,400 KM</span><span className="text-primary">Phase</span><span className="text-right text-foreground">Waning Gibbous</span></> : <><span className="text-primary">Altitude</span><span className="text-right text-foreground">52.3°</span><span className="text-primary">Azimuth</span><span className="text-right text-foreground">182.4°</span><span className="text-primary">Distance</span><span className="text-right text-amber-300">149.6 M KM</span><span className="text-primary">Status</span><span className="text-right text-foreground">Active</span></>}
      </div>
    </div>
  )
}

export function AstronomyOrreryCanvas() {
  return (
    <div className="bg-background relative flex min-h-[500px] flex-col overflow-hidden rounded-2xl border-2 border-border p-1 shadow-sm lg:col-span-6">
      <div className="absolute inset-0 z-0"><img src="/assets/hero_bg.png" alt="Deep Space" className="h-full w-full object-cover opacity-60 mix-blend-screen" /><div className="from-background to-background absolute inset-0 bg-gradient-to-b via-transparent" /></div>
      <div className="absolute top-1/2 left-1/2 z-0 h-[60%] w-[110%] -translate-x-1/2 -translate-y-1/2 -rotate-12 transform rounded-[50%] border border-primary/20" />
      <div className="absolute top-1/2 left-1/2 z-0 h-[40%] w-[80%] -translate-x-1/2 -translate-y-1/2 rotate-12 transform rounded-[50%] border border-blue-400/20" />
      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between p-4">
        <div className="flex w-full items-start justify-between"><TelemetryPanel kind="moon" /><TelemetryPanel kind="sun" /></div>
        <div className="pointer-events-auto absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <div className="relative z-20 h-64 w-64 cursor-pointer rounded-full shadow-sm transition-transform duration-1000 hover:scale-105 sm:h-80 sm:w-80"><img src="/assets/moon_photorealistic.png" alt="Moon" className="h-full w-full rounded-full object-cover" /></div>
          <div className="absolute top-[30%] right-[-20px] z-10 h-32 w-32 animate-pulse rounded-full opacity-90 shadow-sm"><img src="/assets/sun_photorealistic.png" alt="Sun" className="h-full w-full rounded-full object-cover mix-blend-screen" /></div>
          <div className="absolute bottom-[10%] left-6 z-30 h-28 w-28 rounded-full shadow-sm"><img src="/assets/earth_from_space.png" alt="Earth" className="h-full w-full rounded-full object-cover" /></div>
        </div>
        <div className="flex w-full items-end justify-between">
          <div className="bg-background/80 pointer-events-auto w-44 rounded-lg border border-blue-500/50 p-3 shadow-sm backdrop-blur"><div className="mb-2 border-b border-border pb-2 text-[11px] font-black tracking-wider text-blue-400 uppercase">EARTH</div><div className="grid grid-cols-2 gap-y-1.5 font-mono text-[9px]"><span className="text-primary">Latitude</span><span className="text-right text-foreground">6.200° S</span><span className="text-primary">Longitude</span><span className="text-right text-foreground">106.816° E</span><span className="text-primary">Altitude</span><span className="text-right text-foreground">32.0 KM</span><span className="text-primary">Status</span><span className="text-right text-blue-300">Day</span></div></div>
          <QiblaRadarWidget />
          <div className="pointer-events-auto text-right"><div className="mb-1 text-[10px] font-black tracking-widest text-foreground uppercase">CONSTELLATIONS</div><div className="font-mono text-xs text-primary">Orion</div><div className="text-[9px] text-primary">Visible Now</div></div>
        </div>
      </div>
    </div>
  )
}
