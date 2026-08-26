import React from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getViewForRoute } from "@/views/route-map"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module_slug: string; route_slug: string }>
}): Promise<Metadata> {
  const { module_slug, route_slug } = await params
  const formatSlug = (s: string) =>
    s
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")

  const title = `${formatSlug(route_slug)} • ${formatSlug(module_slug).toUpperCase()} — MoonWitness OS`
  const description = `Access ${formatSlug(route_slug)} celestial telemetry, scriptures, and divine protocols on MoonWitness OS.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "MoonWitness OS",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

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

