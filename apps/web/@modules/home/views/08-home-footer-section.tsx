import React from "react"

export function HomeFooterSection() {
  return (
    <section id="footer" className="bg-black py-20 relative">
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 mb-12 flex justify-center">
        <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-cyan-500/50 uppercase">
          [ SECTION 08 : SYSTEM FOOTER ]
        </h2>
      </div>
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 flex flex-col items-center justify-center text-center">
         <h2 className="font-mono text-3xl font-black text-cyan-500 uppercase tracking-widest mb-4">
           MOONWITNESS COMMAND CENTER
         </h2>
         <p className="text-cyan-400/60 font-sans max-w-2xl mb-8">
           &quot;Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding.&quot; (Qur&apos;an 3:190)
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
