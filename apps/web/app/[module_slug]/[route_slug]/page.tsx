import React from "react"
import { notFound } from "next/navigation"
import { getViewForRoute } from "@/views/route-map"

export default async function ModuleRoutePage({
  params,
}: {
  params: Promise<{ module_slug: string; route_slug: string }>
}) {
  const { module_slug, route_slug } = await params

  if (module_slug === "api" || module_slug.startsWith("_")) {
    return null
  }

  const Component = getViewForRoute(module_slug, route_slug)

  if (!Component) {
    notFound()
  }

  return <Component />
}

