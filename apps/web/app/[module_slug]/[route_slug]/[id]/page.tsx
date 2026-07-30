import React from "react"
import { notFound } from "next/navigation"
import { UniversalReaderView } from "@modules/knowledge/views/universal-reader-view"

export default async function ModuleRouteIdPage({
  params,
}: {
  params: Promise<{ module_slug: string; route_slug: string; id: string }>
}) {
  const { module_slug, route_slug, id } = await params

  if (module_slug === "api" || module_slug.startsWith("_")) {
    return null
  }

  if (module_slug === "knowledge" && route_slug === "kitab") {
    return <UniversalReaderView id={id} />
  }

  notFound()
}
