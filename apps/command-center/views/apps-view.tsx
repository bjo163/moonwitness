"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@moon/client"
import { AddonsGrid } from "./apps/addons-grid"
import { AddonsHeader } from "./apps/addons-header"
import { CATEGORIES, CATEGORY_MAP } from "./apps/addon-catalog"
import type { ApiAddonManifest } from "./apps/types"

export type { ApiAddonManifest, ApiAddonModel } from "./apps/types"

export function AppsView() {
  const [addons, setAddons] = useState<ApiAddonManifest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [seedingId, setSeedingId] = useState<string | null>(null)
  const [seedingSuccess, setSeedingSuccess] = useState<string | null>(null)

  const fetchAddonsFromApi = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get<{ count: number; addons: ApiAddonManifest[] }>("/api/meta/addons")
      if (res.data?.addons) setAddons(res.data.addons)
    } catch (err) {
      console.error("Failed to load addons from API:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddonsFromApi()
  }, [])

  const filteredModules = addons.filter((addon) => {
    const category = CATEGORY_MAP[addon.id] || "Enterprise Operations"
    const matchesCategory = selectedCategory === "All" || category === selectedCategory
    const query = search.toLowerCase()
    const matchesSearch =
      addon.name.toLowerCase().includes(query) ||
      addon.description.toLowerCase().includes(query) ||
      addon.packageName.toLowerCase().includes(query) ||
      (addon.models || []).some((model) => model.name.toLowerCase().includes(query))
    return matchesCategory && matchesSearch
  })

  const handleSeedPackage = async (packageId: string) => {
    try {
      setSeedingId(packageId)
      setSeedingSuccess(null)
      const res = await apiClient.post<{ success: boolean; message: string }>("/api/system/demo-seed", {
        package: packageId || undefined,
      })
      if (res.data?.success) {
        setSeedingSuccess(packageId ? `Successfully seeded demo data for ${packageId}!` : "Successfully seeded demo data for all modules!")
        setTimeout(() => setSeedingSuccess(null), 4000)
      }
    } catch (err: any) {
      alert(`Seed failed: ${err?.message || err}`)
    } finally {
      setSeedingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <AddonsHeader
        categories={CATEGORIES}
        loading={loading}
        onSeedAll={() => handleSeedPackage("")}
        onSearchChange={setSearch}
        onSelectCategory={setSelectedCategory}
        onSync={fetchAddonsFromApi}
        search={search}
        seeding={seedingId !== null}
        seedingAll={seedingId === ""}
        seedingSuccess={seedingSuccess}
        selectedCategory={selectedCategory}
      />
      <AddonsGrid addons={filteredModules} loading={loading} onSeed={handleSeedPackage} seedingId={seedingId} />
    </div>
  )
}

export { AppsView as AppCenterView }
