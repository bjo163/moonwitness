export interface VerseItem {
  id: string | number
  verse_number: number | string
  text_transliteration?: string
  text_translated?: string
  text_original?: string
  text_tajweed?: string
}

export interface ReaderBook {
  id: string | number
  name: string
  original_name?: string
  summary?: string
  meaning?: string
  audio_url?: string
  chapters_count?: number
}
