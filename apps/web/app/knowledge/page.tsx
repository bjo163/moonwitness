import Link from "next/link"
import { BookOpen, Database, Search, ShieldCheck } from "lucide-react"
import { PublicFrame, PublicHeader } from "@/components/knowledge/public-content"

const destinations = [
  { href: "/knowledge/kitab", title: "Scripture", description: "Browse the available scripture structure and open canonical passages.", icon: BookOpen },
  { href: "/knowledge/hadits", title: "Traditions", description: "Explore public hadith collections and their available records.", icon: BookOpen },
  { href: "/knowledge/search", title: "Search", description: "Find source-backed records by reference, language, or indexed text.", icon: Search },
  { href: "/knowledge/sources", title: "Sources", description: "Inspect the public source registry and provenance metadata.", icon: Database },
  { href: "/transparency", title: "Transparency", description: "Understand how corpus releases flow through Witness and the API.", icon: ShieldCheck },
]

export const metadata = { title: "Explore knowledge · MoonWitness", description: "Explore source-aware public scripture, traditions, search, and sources." }

export default function KnowledgePage() {
  return <PublicFrame><div className="space-y-8"><PublicHeader eyebrow="Explore" title="Knowledge" description="A public entry point for reading, searching, and tracing source-backed records." /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{destinations.map(({ href, title, description, icon: Icon }) => <Link key={href} href={href} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary"><Icon className="h-5 w-5 text-primary" aria-hidden="true" /><h2 className="mt-6 font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></Link>)}</div></div></PublicFrame>
}
