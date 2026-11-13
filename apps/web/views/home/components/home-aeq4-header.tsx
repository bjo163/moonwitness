export function HomeAEQ4Header({ isPreEra }: { isPreEra: boolean }) {
  return (
    <>
      <div className="mb-10 flex items-start justify-between">
        <div>
          <p className="mb-1 font-mono text-[10px] tracking-widest text-warning/60 uppercase">
            ◈ O-09 · TEMPORAL STATION
          </p>
          <h2 className="font-sans text-2xl font-black tracking-wider text-foreground uppercase">
            AEQ4 TIME SYSTEM
          </h2>
          <p className="mt-1 font-mono text-xs text-foreground/40">
            Q = 4 = Qur&apos;an · Torah · Zabur · Gospel
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-md px-2 py-1 font-mono text-[9px] font-bold tracking-widest uppercase ${isPreEra ? "border border-yellow-400/40 text-warning shadow-sm" : "border border-emerald-500/40 text-success shadow-sm"}`}
          >
            {isPreEra ? "● PRE-ERA" : "● ERA 1 ACTIVE"}
          </span>
          <span className="font-mono text-[8px] text-foreground/30 uppercase">
            zero-dependency · pure math
          </span>
        </div>
      </div>
      <div className="mb-8 rounded-2xl border border-yellow-400/20 bg-card p-6 text-center shadow-sm">
        <div className="mb-1 font-mono text-4xl text-yellow-300/90">∞</div>
        <p className="font-sans text-xs tracking-widest text-warning/50 uppercase">
          Allah · Unlimited · Beyond All Numbers · Beyond All Time
        </p>
        <div className="mx-auto mt-3 h-px w-24 bg-yellow-400/20" />
        <p className="mt-3 font-mono text-[10px] text-foreground/30 italic">
          &quot;Semua angka di bawah ini milik manusia — terbatas, rapuh,
          sementara.&quot;
        </p>
      </div>
    </>
  )
}
