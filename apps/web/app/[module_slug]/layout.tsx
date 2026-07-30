import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { getModule } from "@modules/index"
import { ErpSidebar, ErpNavbar } from "@core/shell-erp"
import { Navbar } from "@core/shell/navbar"
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

  const moduleDef = getModule(module_slug)

  if (!moduleDef) {
    notFound()
  }

  if (moduleDef.navPlacement === "ERP_SIDEBAR") {
    return (
      <div className="bg-space flex min-h-screen text-white">
        <Suspense fallback={null}>
          <ErpSidebar />
        </Suspense>
        <div className="flex flex-1 flex-col pl-64">
          <Suspense fallback={null}>
            <ErpNavbar />
          </Suspense>
          <main className="flex-1 overflow-x-hidden p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    )
  }

  // Standard OS Layout for OS_DOCK and HIDDEN
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
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
