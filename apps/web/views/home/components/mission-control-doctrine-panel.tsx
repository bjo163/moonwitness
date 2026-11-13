import { resolveVisualizationColor } from "@workspace/ui"
import { MISSION_PILLARS } from "./mission-control-data"

export function MissionControlDoctrinePanel() {
  return (
    <div className="bg-background flex flex-col justify-between space-y-6 rounded-xl border-2 border-primary/50 p-6 shadow-sm sm:p-7 lg:col-span-3">
      <div>
        <h2 className="font-mono text-4xl leading-tight font-black tracking-widest uppercase sm:text-5xl">
          <span className="text-foreground drop-shadow-sm">MISSION</span>
          <br />
          <span className="text-primary drop-shadow-sm">CONTROL</span>
        </h2>
        <p className="mt-5 border-l-2 border-primary pl-3.5 font-sans text-xs leading-relaxed text-primary">
          MoonWitness OS exists to connect humanity, creation, and wisdom into one living observatory.
        </p>
      </div>

      <div className="space-y-4 border-t border-border pt-5">
        {MISSION_PILLARS.map((item) => (
          <div key={item.label} className="group flex items-start gap-3.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/60 transition-transform group-hover:scale-110">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: resolveVisualizationColor(item.color),
                  boxShadow: `0 0 8px ${resolveVisualizationColor(item.color)}`,
                }}
              />
            </div>
            <div>
              <div className="text-xs font-black tracking-wider text-foreground uppercase">{item.label}</div>
              <div className="mt-0.5 font-mono text-[11px] font-bold" style={{ color: resolveVisualizationColor(item.color) }}>
                • {item.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
