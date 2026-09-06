import type { RefObject } from "react"
import { MessageCircle } from "lucide-react"
import type { Whisper } from "../whisper-mercy"
import { WhisperBubble } from "./whisper-bubble"

export function WhisperMessages({
  bottomRef,
  onDelete,
  whispers,
}: {
  bottomRef: RefObject<HTMLDivElement | null>
  onDelete: (id: string) => void
  whispers: Whisper[]
}) {
  return (
    <div className="flex max-h-64 flex-col gap-2 overflow-y-auto rounded-none border border-border/40 bg-card/60 p-3">
      {whispers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <MessageCircle className="mb-2 h-6 w-6 text-muted-foreground/30" />
          <p className="font-mono text-[9px] text-muted-foreground">Belum ada whisper. Mulai komunikasi antar layer.</p>
        </div>
      ) : (
        whispers.map((whisper) => <WhisperBubble key={whisper.id} whisper={whisper} onDelete={onDelete} />)
      )}
      <div ref={bottomRef} />
    </div>
  )
}
