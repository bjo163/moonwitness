"use client"

import React from "react"
import { SearchInput, CompactPagination } from "@workspace/ui"

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
  limit,
}: HaditsFilterControlsProps) {
  const totalPages = Math.ceil(totalCount / limit) || 1

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <SearchInput
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange("")}
          placeholder="Search by keyword, narrator, book, or number..."
          size="sm"
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
                ? "border-border bg-primary/10 text-primary shadow-xs"
                : "border-border bg-card text-foreground/50 hover:border-border hover:text-foreground"
            }`}
          >
            {grade}
          </button>
        ))}
      </div>

      {/* Pagination Bar */}
      <CompactPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}

