import { create } from "zustand"
import { SYSTEM_CONSTANTS } from "../tokens/constants"
import type { SystemStatus } from "../types"

type OSStoreState = {
  // Global System State
  systemStatus: SystemStatus
  activeMissions: number
  connectedNodes: number
  totalObservations: number
  uptimeHours: number

  // Clock & Sync
  clockWIB: string
  lastSyncTime: string

  // Theme & Layout
  radarEnabled: boolean
  scanlineEnabled: boolean

  // Actions
  setSystemStatus: (status: SystemStatus) => void
  updateTelemetry: (
    telemetry: Partial<
      Pick<
        OSStoreState,
        | "activeMissions"
        | "connectedNodes"
        | "totalObservations"
        | "uptimeHours"
      >
    >
  ) => void
  tickClock: (timeString: string) => void
  setLastSyncTime: (timeString: string) => void
  toggleRadar: (enabled?: boolean) => void
  toggleScanline: (enabled?: boolean) => void
}

export const useOSStore = create<OSStoreState>((set) => ({
  // Initial State
  systemStatus: "ONLINE",
  activeMissions: 5,
  connectedNodes: SYSTEM_CONSTANTS.DEFAULT_KNOWLEDGE_NODES,
  totalObservations: SYSTEM_CONSTANTS.DEFAULT_OBSERVATIONS,
  uptimeHours: SYSTEM_CONSTANTS.UPTIME_HOURS,

  clockWIB: "00:00:00 WIB",
  lastSyncTime: "00:00:00 WIB",

  radarEnabled: true,
  scanlineEnabled: true,

  // Actions
  setSystemStatus: (status) => set({ systemStatus: status }),

  updateTelemetry: (telemetry) => set((state) => ({ ...state, ...telemetry })),

  tickClock: (timeString) => set({ clockWIB: timeString }),

  setLastSyncTime: (timeString) => set({ lastSyncTime: timeString }),

  toggleRadar: (enabled) =>
    set((state) => ({
      radarEnabled: enabled !== undefined ? enabled : !state.radarEnabled,
    })),

  toggleScanline: (enabled) =>
    set((state) => ({
      scanlineEnabled: enabled !== undefined ? enabled : !state.scanlineEnabled,
    })),
}))
