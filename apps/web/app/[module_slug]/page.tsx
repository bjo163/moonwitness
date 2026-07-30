import React from "react"
import { notFound, redirect } from "next/navigation"
import { getModule } from "@modules/index"

export default async function ModuleIndexPage({
  params,
}: {
  params: Promise<{ module_slug: string }>
}) {
  const { module_slug } = await params
  
  if (module_slug === "api" || module_slug.startsWith("_")) {
    return null
  }

  const moduleDef = getModule(module_slug)

  if (!moduleDef) {
    notFound()
  }

  const defaultRoute = moduleDef.defaultRoute
  const routeDef = moduleDef.routes.find((r) => r.slug === defaultRoute)
  
  if (!routeDef || !routeDef.component) {
    notFound()
  }

  const Component = routeDef.component

  return <Component />
}
