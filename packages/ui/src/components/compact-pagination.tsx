"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface CompactPaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number
  totalPages: number
  totalCount?: number
  pageSize?: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
}

export function CompactPagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  showFirstLast = true,
  className,
  ...props
}: CompactPaginationProps) {
  const safeTotalPages = Math.max(1, totalPages || 1)
  const canPrev = page > 1
  const canNext = page < safeTotalPages

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 text-xs",
        className
      )}
      {...props}
    >
      {/* Optional count label */}
      {typeof totalCount === "number" && (
        <div className="text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {pageSize ? Math.min((page - 1) * pageSize + 1, totalCount) : page}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-foreground">
            {pageSize ? Math.min(page * pageSize, totalCount) : safeTotalPages}
          </span>{" "}
          of <span className="font-semibold text-foreground">{totalCount}</span>
        </div>
      )}

      {/* Button Controls */}
      <div className="flex items-center gap-1 font-mono">
        {showFirstLast && (
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={!canPrev}
            aria-label="First page"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <span className="px-2 text-muted-foreground">
          Page <strong className="text-foreground">{page}</strong> of{" "}
          <strong className="text-foreground">{safeTotalPages}</strong>
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        {showFirstLast && (
          <button
            type="button"
            onClick={() => onPageChange(safeTotalPages)}
            disabled={!canNext}
            aria-label="Last page"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </nav>
  )
}
