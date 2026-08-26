import React, { Suspense } from "react"
import { Navbar } from "@workspace/ui"
import { NAVIGATION_MESH } from "@workspace/types"
import { AutoBreadcrumb } from "@core/ui/breadcrumb"

export default async function ModuleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ module_slug: string }>
}) {
  const { module_slug } = await params

  // Exclude some internal Next.js routes if they ever slip through
  if (module_slug === "api" || module_slug.startsWith("_")) {
    return <>{children}</>
  }

  // Standard Public Portal Layout
  return (
    <>
      <Suspense fallback={null}>
        <Navbar navLinks={NAVIGATION_MESH.portal} />
      </Suspense>
      <main className="flex min-h-screen flex-col pt-16">
        <Suspense fallback={<div className="h-6"></div>}>
          <AutoBreadcrumb className="px-6 pt-6 pb-2" />
        </Suspense>
        {children}
      </main>
    </>
  )
}
