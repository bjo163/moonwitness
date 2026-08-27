export type PropheticAIChatTerminalProps = {
  maxHeight?: string
  fullWorkspace?: boolean
}

export type SpeechRecognitionEvent = {
  results: Array<{
    [index: number]: { transcript: string }
    length: number
  }>
}

export type SpeechRecognitionErrorEvent = {
  error: string
}

export type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

export type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

export type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}

export type ChatMessage = {
  id: string
  role: string
  content: string
}

export const QUICK_PROMPTS = [
  {
    label: "📖 Patience in tribulations",
    prompt:
      "Find Quranic verses and prophetic wisdom on exercising steadfast patience during periods of extreme global tribulation and uncertainty",
  },
  {
    label: "🌐 Unity in shattered era",
    prompt:
      "What are the core divine commands regarding preserving collective brotherhood and spiritual solidarity in a politically fragmented world?",
  },
  {
    label: "🚀 Pursue empirical science",
    prompt:
      "Provide Quranic and authentic Hadith perspectives on observing celestial mechanics and advanced scientific inquiry as an act of worship",
  },
  {
    label: "⚖️ Financial muamalah in end times",
    prompt:
      "What is the Quranic and prophetic guidance regarding wealth preservation and ethical trade in the modern financial era?",
  },
  {
    label: "🤲 Dhikr for tranquility of heart",
    prompt:
      "Find Quranic prayers and dhikr formulations for inner tranquility, mental strength, and spiritual clarity",
  },
  {
    label: "👁️ Lowering gaze in digital age",
    prompt:
      "Explain the theological command of lowering the gaze and guarding spiritual purity within modern digital environments",
  },
]
