export type Operation = {
  id: number
  name: string
  argument?: string
  targetUrl?: string
  targetImage?: string
  wisdom?: string
  verseIds?: number[]
}

export type Verse = {
  id: number
  scriptureId: number
  bookId: number
  chapterNumber: number
  verseNumber: number
  translationId?: string
  translationEn?: string
}

export type Scripture = { id: number; name: string }
export type Book = { id: number; name: string }

export type OperationForm = {
  name: string
  argument: string
  targetUrl: string
  targetImage: string
  wisdom: string
  verseIds: number[]
}

export const emptyOperation: OperationForm = {
  name: "",
  argument: "",
  targetUrl: "",
  targetImage: "",
  wisdom: "",
  verseIds: [],
}
