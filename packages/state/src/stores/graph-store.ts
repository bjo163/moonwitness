import { create } from "zustand"

export type GraphState = {
  selectedEntityId: string | null
  zoomLevel: number
  activeFilters: string[]
  setSelectedEntity: (id: string | null) => void
  setZoomLevel: (level: number) => void
  toggleFilter: (filter: string) => void
}

const MIN_ZOOM_LEVEL = 10
const MAX_ZOOM_LEVEL = 300

export const useGraphStore = create<GraphState>((set) => ({
  selectedEntityId: "ibrahim",
  zoomLevel: 100,
  activeFilters: [],
  setSelectedEntity: (id) => set({ selectedEntityId: id }),
  setZoomLevel: (level) =>
    set({
      zoomLevel: Math.max(MIN_ZOOM_LEVEL, Math.min(level, MAX_ZOOM_LEVEL)),
    }),
  toggleFilter: (filter) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(filter)
        ? state.activeFilters.filter((f) => f !== filter)
        : [...state.activeFilters, filter],
    })),
}))
