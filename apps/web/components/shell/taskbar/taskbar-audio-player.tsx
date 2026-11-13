import { Button } from "@workspace/ui"
import { Gauge, Music, Pause, Play, Repeat, SkipBack, SkipForward } from "lucide-react"
import { GlobalLiveAudioTranslator } from "../global-live-audio-translator"

type TaskbarAudioPlayerProps = {
  currentSurah: { number: number; name: string }
  isPlaying: boolean
  playbackRate: number
  isLooping: boolean
  onTogglePlay: () => void
  onToggleLoop: () => void
  onSetPlaybackRate: (rate: number) => void
}

export function TaskbarAudioPlayer({
  currentSurah,
  isPlaying,
  playbackRate,
  isLooping,
  onTogglePlay,
  onToggleLoop,
  onSetPlaybackRate,
}: TaskbarAudioPlayerProps) {
  return (
    <div className="flex shrink-0 items-center gap-4 text-primary sm:gap-6">
      <div className="flex items-center gap-1 sm:gap-2">
        <Music className="hidden h-3 w-3 text-primary sm:block" />
        <span className="hidden max-w-[120px] truncate font-medium text-primary sm:inline-block">#{currentSurah.number} {currentSurah.name}</span>
        <div className="flex items-center gap-1 sm:ml-2">
          <Button variant="ghost" size="icon-xs" aria-label="Previous" className="flex items-center justify-center p-1 text-muted-foreground transition-colors hover:text-primary"><SkipBack className="h-3 w-3" /></Button>
          <Button variant="ghost" size="icon-xs" onClick={onTogglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="hover:text-success flex items-center justify-center p-1 text-primary transition-colors">{isPlaying ? <Pause className="text-success h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}</Button>
          <Button variant="ghost" size="icon-xs" aria-label="Next" className="flex items-center justify-center p-1 text-muted-foreground transition-colors hover:text-primary"><SkipForward className="h-3 w-3" /></Button>
        </div>
        <div className="hidden items-center gap-2 sm:ml-2 sm:flex">
          <Button variant="ghost" size="icon-xs" onClick={onToggleLoop} aria-label="Toggle Loop" className={`flex items-center justify-center p-1 transition-colors ${isLooping ? "text-info" : "text-muted-foreground hover:text-primary"}`}><Repeat className="h-3 w-3" /></Button>
          <Button variant="ghost" size="icon-xs" onClick={() => onSetPlaybackRate(playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1)} aria-label="Toggle Speed" className="flex items-center gap-1 p-1 font-mono text-xs text-primary/80 transition-colors hover:text-primary"><Gauge className="h-3 w-3" />{playbackRate}x</Button>
        </div>
      </div>
      <span className="hidden h-3 w-px bg-border sm:block" />
      <div className="hidden md:block"><GlobalLiveAudioTranslator /></div>
      <span className="hidden h-3 w-px bg-border md:block" />
      <span className="rounded border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">MW-OS v6.5</span>
    </div>
  )
}
