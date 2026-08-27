"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { BreadcrumbTrail } from "@workspace/ui"

export function AutoBreadcrumb({ className = "" }: { className?: string }) {
  const pathname = usePathname()

  // Do not show breadcrumb on home page or root
  if (!pathname || pathname === "/") {
    return null
  }

  // Split path into segments and filter empty strings
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length === 0) return null

  // Map segments to breadcrumb paths
  const paths = segments.map((segment, index) => {
    // Build href up to current segment (except for the last active segment)
    const isLast = index === segments.length - 1
    const href = isLast
      ? undefined
      : "/" + segments.slice(0, index + 1).join("/")

    // Format label: replace hyphens with spaces and uppercase
    const label = decodeURIComponent(segment).replace(/-/g, " ").toUpperCase()

    return { label, href }
  })

  return <BreadcrumbTrail paths={paths} className={className} />
}
