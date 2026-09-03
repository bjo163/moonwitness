import Link from "next/link"
import { fetchHadithBooks } from "@moon/client"
import { ErrorNotice, PublicFrame, PublicHeader } from "@/components/knowledge/public-content"

export const dynamic = "force-dynamic"
export default async function HadithIndexPage() {
  try {
    const data: any = await fetchHadithBooks()
    const books = data.books || []
    return <PublicFrame><div className="space-y-8"><PublicHeader eyebrow="Traditions" title="Hadith collections" description="Browse public tradition collections returned by the Witness API." /><div className="grid gap-3 sm:grid-cols-2">{books.map((book: any) => <Link key={book.slug || book.id} href={`/knowledge/hadits/${book.slug}`} className="rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary"><h2 className="font-semibold">{book.name}</h2><p className="mt-2 text-sm text-muted-foreground">{book.totalItems ?? "—"} records{book.gradeLevel ? ` · ${book.gradeLevel}` : ""}</p></Link>)}</div></div></PublicFrame>
  } catch { return <PublicFrame><ErrorNotice message="Hadith collections are temporarily unavailable." /></PublicFrame> }
}
