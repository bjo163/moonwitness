import dynamic from "next/dynamic"
import { defineModule } from "@modules/define-module"

const DailyTransmissionView = dynamic(() =>
  import("./views/daily-transmission-view").then((m) => m.DailyTransmissionView)
)
const GlobalMonitoringView = dynamic(() =>
  import("./views/global-monitoring-view").then((m) => m.GlobalMonitoringView)
)
const LunarCalendarView = dynamic(() =>
  import("./views/lunar-calendar-view").then((m) => m.LunarCalendarView)
)
const EclipseTrackerView = dynamic(() =>
  import("./views/eclipse-tracker-view").then((m) => m.EclipseTrackerView)
)
const QiblaArView = dynamic(() =>
  import("./views/qibla-ar-view").then((m) => m.QiblaArView)
)
const AtmosphericRadarView = dynamic(() =>
  import("./views/atmospheric-radar-view").then((m) => m.AtmosphericRadarView)
)
const CelestialStarMapView = dynamic(() =>
  import("./views/celestial-star-map-view").then((m) => m.CelestialStarMapView)
)

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
    {
      slug: "daily-transmission",
      label: "Daily Transmission",
      icon: "Radio",
      component: DailyTransmissionView,
    },
    {
      slug: "global-monitoring",
      label: "Global Monitoring",
      icon: "Globe",
      component: GlobalMonitoringView,
    },
    {
      slug: "lunar-calendar",
      label: "Lunar Calendar",
      icon: "Moon",
      component: LunarCalendarView,
    },
    {
      slug: "eclipse-tracker",
      label: "Eclipse Tracker",
      icon: "Eclipse",
      component: EclipseTrackerView,
    },
    {
      slug: "qibla-ar",
      label: "Qibla AR",
      icon: "Compass",
      component: QiblaArView,
    },
    {
      slug: "atmospheric-radar",
      label: "Atmospheric Radar",
      icon: "Radio",
      component: AtmosphericRadarView,
    },
    {
      slug: "celestial-star-map",
      label: "Celestial Star Map",
      icon: "Sparkles",
      component: CelestialStarMapView,
    },
  ],
})
