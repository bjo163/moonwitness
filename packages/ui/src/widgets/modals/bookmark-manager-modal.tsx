"use client"
import { useMounted } from "@workspace/hooks"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bookmark, Trash2, ArrowRight, BookOpen } from "lucide-react"
import {
  getBookmarks,
  toggleBookmark,
  TacticalBookmarkItem,
} from "@workspace/state"
import { Modal, ModalTrigger } from "../../components/modal"

export function BookmarkManagerModal() {
  const mounted = useMounted()
  const [isOpen, setIsOpen] = useState(false)
  const [bookmarks, setBookmarks] = useState<TacticalBookmarkItem[]>([])

  const loadBookmarks = () => {
    setBookmarks(getBookmarks())
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Client-side hydration requires fetching data in effect
    loadBookmarks()

    const handleUpdate = () => loadBookmarks()
    window.addEventListener("mw_bookmarks_updated", handleUpdate)
    return () =>
      window.removeEventListener("mw_bookmarks_updated", handleUpdate)
  }, [])

  function removeBookmark(item: TacticalBookmarkItem) {
    toggleBookmark(item)
    loadBookmarks()
  }

  return (
    <>
      <ModalTrigger
        icon={Bookmark}
        label={`[ VAULT: ${bookmarks.length} ]`}
        onClick={() => setIsOpen(true)}
        title="Buka Vault Penanda Ayat & Hadits Pilihan"
        color="yellow"
      />

      <Modal
        isOpen={isOpen && mounted}
        onClose={() => setIsOpen(false)}
        title={`// VAULT BOOKMARK TACTICAL (${bookmarks.length})`}
        icon={Bookmark}
        maxWidth="max-w-xl"
        borderColor="border-accent/50"
        glowColor="rgba(255,230,0,0.25)"
      >
        <div className="space-y-3 p-6 text-xs">
          {bookmarks.length === 0 ? (
            <div className="space-y-2 py-16 text-center text-muted">
              <BookOpen className="mx-auto h-6 w-6 text-accent/40" />
              <p className="text-xs font-bold text-foreground">
                {/* TIDAK ADA BOOKMARK TERSIMPAN */}
              </p>
              <p className="text-[10px]">
                Tandai ayat Al-Qur&apos;an atau Hadits favorit Anda untuk
                menyimpannya di Vault lokal ini.
              </p>
            </div>
          ) : (
            bookmarks.map((item) => (
              <div
                key={item.id}
                className="bg-space tag-clip flex flex-col justify-between space-y-2 border border-accent/20 p-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-accent">
                    {item.title}
                  </span>
                  <button
                    onClick={() => removeBookmark(item)}
                    className="hover:text-danger p-1 text-muted transition-colors"
                    title="Hapus Bookmark"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {item.textArabic && (
                  <div className="arabic-text text-right text-lg font-bold text-foreground">
                    {item.textArabic}
                  </div>
                )}

                {item.textTranslation && (
                  <p className="text-[10px] text-muted italic">
                    &ldquo;{item.textTranslation}&rdquo;
                  </p>
                )}

                <div className="flex items-center justify-between border-t border-accent/15 pt-2">
                  <span className="text-[8px] text-muted">
                    {new Date(item.timestamp).toLocaleDateString("id-ID")}
                  </span>

                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="btn-primary flex items-center gap-1 border-accent px-3 py-1 text-[9px] text-accent btn-clip hover:bg-accent/10"
                  >
                    <span>BUKA AYAT</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </>
  )
}
