import type { ChangeEvent, KeyboardEvent } from "react"
import { Send } from "lucide-react"
import { Button, Input } from "@workspace/ui"
import type { WhisperTier } from "../whisper-mercy"

export function WhisperComposer({
  inputValue,
  selectedTier,
  onChange,
  onSend,
}: {
  inputValue: string
  selectedTier: WhisperTier
  onChange: (value: string) => void
  onSend: () => void
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        value={inputValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Whisper dari ${selectedTier}...`}
        className="flex-1 border border-border/40 bg-card/60 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-yellow-400/50 focus:outline-none"
      />
      <Button type="button" variant="outline" size="icon" onClick={onSend} disabled={!inputValue.trim()} className="rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-warning transition-all hover:bg-yellow-400/20 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-30">
        <Send className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
