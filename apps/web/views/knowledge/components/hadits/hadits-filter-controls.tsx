"use client"

import React from "react"
import { Search, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface HaditsFilterControlsProps {
  searchQuery: string
  onSearchChange: (val: string) => void
  selectedGrade: string
  onGradeChange: (val: string) => void
  currentPage: number
  onPageChange: (page: number) => void
  totalCount: number
  limit: number
}

export function HaditsFilterControls({
  searchQuery,
  onSearchChange,
  selectedGrade,
  onGradeChange,
  currentPage,
  onPageChange,
  totalCount,
  limit
}: HaditsFilterControlsProps) {
  const totalPages = Math.ceil(totalCount / limit) || 1

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by keyword, narrator, book, or number..."
          className="w-full rounded-xl border border-white/10 bg-card py-2.5 pr-4 pl-10 text-xs text-white placeholder-white/30 transition-all outline-none focus:border-cyan-500/50 focus:bg-card"
        />
      </div>

      {/* Grade Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {["ALL", "SAHIH", "HASAN", "DA'IF"].map((grade) => (
          <button
            key={grade}
            onClick={() => onGradeChange(grade)}
            className={`rounded-lg border px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition-all ${
              selectedGrade === grade
                ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-300 shadow-sm"
                : "border-white/5 bg-card text-white/50 hover:border-white/20 hover:text-white"
            }`}
          >
            {grade}
          </button>
        ))}
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center gap-1 font-mono text-xs text-white/60">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-card transition-colors hover:bg-white/5 disabled:opacity-30"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-card transition-colors hover:bg-white/5 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-2 text-[10px]">
          Page <strong className="text-white">{currentPage}</strong> of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-card transition-colors hover:bg-white/5 disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-card transition-colors hover:bg-white/5 disabled:opacity-30"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
