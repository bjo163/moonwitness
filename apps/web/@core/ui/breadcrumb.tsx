"use client"

import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Breadcrumb({
  paths,
}: {
  paths: { label: string; href?: string }[]
}) {
  return (
    <nav className="mb-4 flex items-center gap-1.5 overflow-x-auto py-1 font-mono text-[10px] tracking-widest whitespace-nowrap text-primary">
      <span className="font-black text-primary">MOONWITNESS OS</span>
      {paths.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-3 w-3 shrink-0 text-primary/40" />
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-primary"
            >
              {item.label.toUpperCase()}
            </Link>
          ) : (
            <span className="text-success font-bold">
              {item.label.toUpperCase()}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

import { usePathname } from "next/navigation"

export function AutoBreadcrumb({
  className = "",
  customLastLabel,
}: {
  className?: string
  customLastLabel?: string
}) {
  const pathname = usePathname()

  if (
    !pathname ||
    pathname === "/" ||
    pathname === "/home" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/erp") ||
    pathname.startsWith("/console")
  ) {
    return null
  }

  // Split path into segments and remove empty ones
  const segments = pathname.split("/").filter(Boolean)

  // Format segments into readable labels (e.g. "canonical-scriptures" -> "CANONICAL SCRIPTURES")
  const formatLabel = (str: string) => str.replace(/-/g, " ").toUpperCase()

  const paths = segments.map((segment, index) => {
    const isLast = index === segments.length - 1
    const href = "/" + segments.slice(0, index + 1).join("/")

    // Use custom label for the last segment if provided (e.g. to show "Al-Qur'an" instead of "1")
    const label =
      isLast && customLastLabel ? customLastLabel : formatLabel(segment)

    return {
      label,
      href: isLast ? undefined : href, // Only provide href if it's not the last item
    }
  })

  return (
    <div
      className={`flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/40 uppercase ${className}`}
    >
      <Link
        href="/home"
        className="flex items-center gap-1 hover:text-blue-400"
      >
        MOONWITNESS OS
      </Link>
      {paths.map((p, i) => (
        <React.Fragment key={i}>
          <span>&gt;</span>
          {p.href ? (
            <Link href={p.href} className="hover:text-blue-400">
              {p.label}
            </Link>
          ) : (
            <span className="text-blue-400">{p.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
