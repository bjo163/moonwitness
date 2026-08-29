import React from "react"

export function HomeFooterSection() {
  return (
    <section id="footer" className="relative bg-black py-20">
      <div className="mx-auto mb-12 flex w-full max-w-[1700px] justify-center px-6 sm:px-10">
        <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-primary/50 uppercase">
          [ SECTION 08 : SYSTEM FOOTER ]
        </h2>
      </div>
      <div className="mx-auto flex w-full max-w-[1700px] flex-col items-center justify-center px-6 text-center sm:px-10">
        <h2 className="mb-4 font-mono text-3xl font-black tracking-widest text-primary uppercase">
          MOONWITNESS COMMAND CENTER
        </h2>
        <p className="mb-8 max-w-2xl font-sans text-primary/60">
          &quot;Indeed, in the creation of the heavens and the earth and the
          alternation of the night and the day are signs for those of
          understanding.&quot; (Qur&apos;an 3:190)
        </p>
        <div className="flex gap-4 font-mono text-xs text-primary/40">
          <span>VERSION 6.0.0</span>
          <span>|</span>
          <span>SYSTEM ONLINE</span>
        </div>
      </div>
    </section>
  )
}
