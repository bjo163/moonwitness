import React from "react"
import { AutoBreadcrumb } from "./auto-breadcrumb"

type PageLayoutProps = {
  children: React.ReactNode
  subNav?: React.ReactNode
  contentClass?: string
  showBreadcrumb?: boolean
}

export function PageLayout({
  children,
  subNav,
  contentClass,
  showBreadcrumb = true,
}: PageLayoutProps) {
  return (
    <div
      className="min-h-screen bg-cyber-dark pb-10 font-sans text-foreground"
      suppressHydrationWarning
    >
      {/* Spacer for fixed Navbar (h-16 = 64px) */}
      <div className="pt-16">{subNav}</div>

      {/* Content area */}
      <div
        className={
          contentClass ?? "mx-auto mt-6 max-w-5xl space-y-6 px-4 sm:px-6"
        }
      >
        {showBreadcrumb && <AutoBreadcrumb />}
        {children}
      </div>
    </div>
  )
}
