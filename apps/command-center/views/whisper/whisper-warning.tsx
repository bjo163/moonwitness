import { AlertTriangle } from "lucide-react"

export function WhisperWarning() {
  return (
    <div className="flex items-center gap-2">
      <AlertTriangle className="h-3 w-3 shrink-0 text-foreground/15" />
      <p className="font-mono text-[8px] text-foreground/15">Whisper disimpan secara lokal. Tidak ada server. Akan hilang otomatis sesuai masa yang dipilih.</p>
    </div>
  )
}
