import React from "react"
import { notFound } from "next/navigation"
import { getModule } from "@modules/index"

export default async function ModuleRoutePage({
  params,
}: {
  params: Promise<{ module_slug: string; route_slug: string }>
}) {
  const { module_slug, route_slug } = await params

  if (module_slug === "api" || module_slug.startsWith("_")) {
    return null
  }

  const moduleDef = getModule(module_slug)

  if (!moduleDef) {
    notFound()
  }

  // Support deeply nested routes by joining rest of array if route_slug is an array
  // Wait, route_slug is a string here, but if we used [...route_slug] it would be an array.
  // Since we use [route_slug], it's just one level deep. This fits our architecture.

  const routeDef = moduleDef.routes.find((r) => r.slug === route_slug)

  if (!routeDef || !routeDef.component) {
    notFound()
  }

  const Component = routeDef.component

  return <Component />
}
