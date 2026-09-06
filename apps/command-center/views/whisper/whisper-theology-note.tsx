import { Infinity } from "lucide-react"

export function WhisperTheologyNote() {
  return (
    <div className="flex items-start gap-2 rounded-none border border-yellow-400/20 bg-yellow-400/5 px-3 py-2">
      <Infinity className="mt-0.5 h-3 w-3 shrink-0 text-warning/60" />
      <p className="font-mono text-[9px] italic text-warning/80">
        Whisper ini bersifat fana — ia akan berakhir pada masanya. &quot;Kullu man &apos;alayha fan.&quot; QS 55:26
      </p>
    </div>
  )
}
