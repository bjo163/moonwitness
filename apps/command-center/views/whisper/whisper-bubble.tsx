import { Clock, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui"
import { formatDate, formatTimeLeft, type Whisper } from "../whisper-mercy"
import { TIER_CONFIG } from "./whisper-config"

export function WhisperBubble({ whisper, onDelete }: { whisper: Whisper; onDelete: (id: string) => void }) {
  const config = TIER_CONFIG[whisper.tier]
  const timeLeft = formatTimeLeft(whisper.expiresAt)
  const isShadow = whisper.tier === "SHADOW"

  return (
    <div className={`flex flex-col gap-1 ${isShadow ? "items-end" : "items-start"}`}>
      <div className={`flex items-center gap-1 ${isShadow ? "flex-row-reverse" : "flex-row"}`}>
        <span className={`${config.color} flex items-center gap-1 font-mono text-[8px] font-bold uppercase tracking-widest`}>
          {config.icon} {config.label}
        </span>
        <span className="font-mono text-[8px] text-foreground/20">{formatDate(whisper.createdAt)}</span>
      </div>

      <div className={`relative max-w-[85%] rounded-xl border px-3 py-2 ${config.border} ${config.bg}`}>
        <p className={`font-mono text-xs leading-relaxed ${config.color}`}>{whisper.content}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className={`flex items-center gap-1 font-mono text-[8px] ${timeLeft.urgent ? "text-warning/70" : "text-foreground/20"}`}>
            <Clock className="h-2.5 w-2.5" />
            {timeLeft.text}
          </span>
          <Button type="button" variant="ghost" size="icon-xs" onClick={() => onDelete(whisper.id)} className="text-foreground/15 transition-colors hover:text-destructive/60" title="Hapus whisper">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
