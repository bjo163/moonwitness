import { Sparkles } from "lucide-react"

export function MissionControlScriptureTicker() {
  return (
    <div className="mt-10 flex items-center justify-center gap-4 rounded-sm border-y-2 border-primary bg-gradient-to-r from-blue-950/70 via-transparent to-blue-950/70 px-8 py-5 text-center font-mono text-xs font-bold tracking-wider text-primary shadow-sm sm:text-sm md:text-base">
      <Sparkles className="h-5 w-5 shrink-0 animate-pulse text-primary drop-shadow-sm" />
      <span className="italic drop-shadow-sm">
        &ldquo;Indeed, in the creation of the heavens and the earth, and the alternation of the night and the day, are signs for people of understanding.&rdquo;{" "}
        <span className="ml-2 font-black text-success not-italic drop-shadow-sm">(Qur&apos;an 3:190)</span>
      </span>
      <Sparkles className="h-5 w-5 shrink-0 animate-pulse text-primary drop-shadow-sm" />
    </div>
  )
}
