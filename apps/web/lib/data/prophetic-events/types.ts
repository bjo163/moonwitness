export type PropheticEvent = {
  id: string
  monthNumber: number // 1 to 12
  dayNumber: number // 1 to 30
  title: string
  description: string
  quranicReference?: {
    surah: string
    ayah: string
    text: string
    translation: string
  }
}

