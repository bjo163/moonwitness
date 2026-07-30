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
