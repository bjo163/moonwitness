import { defineModule } from "@modules/define-module"
import { DailyTransmissionView } from "./views/daily-transmission-view"
import { GlobalMonitoringView } from "./views/global-monitoring-view"
import { LunarCalendarView } from "./views/lunar-calendar-view"
import { EclipseTrackerView } from "./views/eclipse-tracker-view"
import { QiblaArView } from "./views/qibla-ar-view"
import { AtmosphericRadarView } from "./views/atmospheric-radar-view"
import { CelestialStarMapView } from "./views/celestial-star-map-view"

/**
 * Observatory Module — MoonWitness OS
 *
 * Pusat observasi astronomi dan pemantauan langit.
 * Semua rute, navigasi, dan komponen didaftarkan dari satu file ini.
 *
 * Untuk menambah halaman baru:
 * 1. Buat view di ./views/nama-view.tsx
 * 2. Tambahkan 1 baris ke array `routes` di bawah
 * 3. Selesai — menu dan URL otomatis tersedia.
 */
export default defineModule({
  id: "observatory",
  label: "OBSERVATORY",
  icon: "Telescope",
  type: "APP",
  navPlacement: "OS_DOCK",
  basePath: "/observatory",
  defaultRoute: "daily-transmission",
  routes: [
    { slug: "daily-transmission", label: "Daily Transmission", icon: "Radio",    component: DailyTransmissionView },
    { slug: "global-monitoring",  label: "Global Monitoring",  icon: "Globe",    component: GlobalMonitoringView },
    { slug: "lunar-calendar",     label: "Lunar Calendar",     icon: "Moon",     component: LunarCalendarView },
    { slug: "eclipse-tracker",    label: "Eclipse Tracker",    icon: "Eclipse",  component: EclipseTrackerView },
    { slug: "qibla-ar",           label: "Qibla AR",           icon: "Compass",  component: QiblaArView },
    { slug: "atmospheric-radar",  label: "Atmospheric Radar",  icon: "Radio",    component: AtmosphericRadarView },
    { slug: "celestial-star-map", label: "Celestial Star Map", icon: "Sparkles", component: CelestialStarMapView },
  ],
})

