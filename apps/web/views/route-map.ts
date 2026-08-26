import type { ComponentType } from "react"
import * as Views from "./index"

export const ROUTE_MAP: Record<string, ComponentType<any>> = {
  // Observatory
  "observatory/daily-transmission": Views.DailyTransmissionView,
  "observatory/global-monitoring": Views.GlobalMonitoringView,
  "observatory/lunar-calendar": Views.LunarCalendarView,
  "observatory/eclipse-tracker": Views.EclipseTrackerView,
  "observatory/qibla-ar": Views.QiblaArView,
  "observatory/atmospheric-radar": Views.AtmosphericRadarView,
  "observatory/celestial-star-map": Views.CelestialStarMapView,

  // Knowledge
  "knowledge/hub": Views.KnowledgeHubView,
  "knowledge/signals": Views.KnowledgeSignalsView,
  "knowledge/graph": Views.IntelligenceGraphView,
  "knowledge/asmaul-husna": Views.AsmaulHusnaView,
  "knowledge/doa-harian": Views.DoaHarianView,
  "knowledge/hadits": Views.HaditsPortalView,
  "knowledge/kitab": Views.KitabPortalView,
  "knowledge/matriks-kitab": Views.MatriksKitabView,
  "knowledge/sanad-keilmuan": Views.SanadKeilmuanView,
  "knowledge/tasbih": Views.TasbihView,
  "knowledge/tauhid": Views.TauhidPortalView,
  "knowledge/kamus-akar-kata": Views.KamusAkarKataView,
  "knowledge/kalkulator-zakat": Views.KalkulatorZakatView,
  "knowledge/adhkar": Views.AdhkarCommandView,
  "knowledge/universal-reader": Views.UniversalReaderView,

  // Astronomy
  "astronomy/divine-astronomy": Views.DivineAstronomyView,
  "astronomy/celestial-events": Views.CelestialEventsView,
  "astronomy/sun-position": Views.SunPositionView,

  // History
  "history/sejarah-sirah": Views.SejarahSirahView,
  "history/history-timeline": Views.HistoryTimelineView,
  "history/mukjizat-sains": Views.MukjizatSainsView,
  "history/nubuat-peradaban": Views.NubuatPeradabanView,

  // Analytics
  "analytics/analisis-tren": Views.AnalisisTrenView,
  "analytics/analytics-telemetry": Views.AnalyticsTelemetryView,
  "analytics/diagnostik-hikmah": Views.DiagnostikHikmahView,
  "analytics/mizan-assessment": Views.MizanAssessmentView,
  "analytics/psikologi-jiwa": Views.PsikologiJiwaView,

  // Mission
  "mission/diplomasi-profetik": Views.DiplomasiProfetikView,
  "mission/garden-brainstorm": Views.GardenBrainstormView,
  "mission/law-justice": Views.LawJusticeView,
  "mission/mission-control": Views.MissionControlView,
  "mission/persatuan-umat": Views.PersatuanUmatView,
  "mission/piagam-peradaban": Views.PiagamPeradabanView,
  "mission/sertifikat-piagam": Views.SertifikatPiagamView,
  "mission/toolkit-rasulullah": Views.ToolkitRasulullahView,

  // Auth
  "auth/login": Views.LoginView,
  "auth/profile": Views.ProfileView,

  // Seismix & Shootgun
  "seismix/quake-archive": Views.QuakeArchiveView,
  "seismix/seismic-forge": Views.SeismicForgeView,
  "seismix/tectonic-map": Views.TectonicMapView,
  "seismix/waveform-lab": Views.WaveformLabView,
  "shootgun/public": Views.ShootgunPublicView,
}

export function getViewForRoute(moduleSlug: string, routeSlug?: string): ComponentType<any> | null {
  if (!routeSlug) {
    const defaults: Record<string, string> = {
      observatory: "daily-transmission",
      knowledge: "hub",
      astronomy: "divine-astronomy",
      history: "sejarah-sirah",
      analytics: "analytics-telemetry",
      mission: "mission-control",
      auth: "login",
      seismix: "quake-archive",
      shootgun: "public",
    }
    routeSlug = defaults[moduleSlug] || "default"
  }
  const key = `${moduleSlug}/${routeSlug}`
  return ROUTE_MAP[key] || null
}