"use client"

import React, { useState } from "react"
import { Search } from "lucide-react"

export interface ReaderNavSidebarProps {
  title: string
  items: Array<{
    id: string | number
    book_number: string | number
    name: string
    subname?: string
  }>
  currentBook: string
  onSelectBook: (bookNumber: string | number) => void
}

export function ReaderNavSidebar({
  title,
  items,
  currentBook,
  onSelectBook,
}: ReaderNavSidebarProps) {
  const [search, setSearch] = useState("")

  const filteredItems = items.filter((item) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      item.name.toLowerCase().includes(q) ||
      (item.subname && item.subname.toLowerCase().includes(q)) ||
      item.book_number.toString().includes(q)
    )
  })

  return (
    <div className="space-y-6 md:col-span-3 lg:col-span-2">
      <div className="rounded-xl border border-white/5 bg-card p-4">
        <h3 className="mb-4 text-[10px] font-black tracking-widest text-white/40 uppercase">
          {title}
        </h3>

        <div className="relative mb-4">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/40 py-2 pr-3 pl-9 text-xs focus:border-blue-500/50 focus:outline-none"
          />
        </div>

        <div className="custom-scrollbar max-h-[500px] space-y-1 overflow-y-auto pr-2">
          {filteredItems.map((item) => {
            const isActive =
              item.book_number.toString() === currentBook.toString()
            return (
              <button
                key={item.id}
                onClick={() => onSelectBook(item.book_number)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                  isActive
                    ? "border-blue-500/30 bg-blue-500/10"
                    : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${
                      isActive
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    {item.book_number}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-bold ${
                        isActive ? "text-blue-400" : "text-white/80"
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.subname && (
                      <span className="text-[9px] text-white/40">
                        {item.subname}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
