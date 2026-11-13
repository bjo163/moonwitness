"use client"

import * as React from "react"
import { Search, X, Loader2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  onClear?: () => void
  onSearch?: (query: string) => void
  shortcut?: string
  loading?: boolean
  size?: "sm" | "default" | "lg"
}

const sizeClasses = {
  sm: "h-8 text-xs pl-8 pr-8",
  default: "h-9 text-sm pl-9 pr-9",
  lg: "h-11 text-sm pl-10 pr-10",
}

const iconSizes = {
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-4.5 w-4.5",
}

const iconLeftPositions = {
  sm: "left-2.5",
  default: "left-3",
  lg: "left-3.5",
}

const iconRightPositions = {
  sm: "right-2.5",
  default: "right-3",
  lg: "right-3.5",
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value,
      onChange,
      onClear,
      onSearch,
      shortcut,
      loading = false,
      size = "default",
      placeholder = "Search...",
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const handleClear = React.useCallback(() => {
      if (onClear) {
        onClear()
      } else if (inputRef.current) {
        inputRef.current.value = ""
        const event = new Event("input", { bubbles: true })
        inputRef.current.dispatchEvent(event)
      }
      inputRef.current?.focus()
    }, [onClear])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        handleClear()
      } else if (e.key === "Enter" && onSearch) {
        onSearch(inputRef.current?.value || "")
      }
      onKeyDown?.(e)
    }

    const hasValue = Boolean(value || inputRef.current?.value)

    return (
      <div className="relative flex w-full items-center">
        <span
          className={cn(
            "pointer-events-none absolute text-muted-foreground transition-colors",
            iconLeftPositions[size]
          )}
          aria-hidden="true"
        >
          {loading ? (
            <Loader2 className={cn("animate-spin", iconSizes[size])} />
          ) : (
            <Search className={iconSizes[size]} />
          )}
        </span>

        <input
          ref={inputRef}
          type="search"
          role="searchbox"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-md border border-input bg-background text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[size],
            shortcut && !hasValue && "pr-12",
            className
          )}
          {...props}
        />

        {hasValue && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute text-muted-foreground transition-colors hover:text-foreground focus:outline-none",
              iconRightPositions[size]
            )}
            aria-label="Clear search input"
          >
            <X className={iconSizes[size]} />
          </button>
        )}

        {!hasValue && shortcut && !loading && (
          <span
            className={cn(
              "pointer-events-none absolute select-none rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground",
              iconRightPositions[size]
            )}
          >
            {shortcut}
          </span>
        )}
      </div>
    )
  }
)

SearchInput.displayName = "SearchInput"
