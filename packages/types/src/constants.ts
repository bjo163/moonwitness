// Global Constants & Enums for MoonWitness OS

export const STORAGE_KEYS = {
  THEME: "mw_theme_mode",
  SESSION: "mw_session_token",
  USER_DATA: "mw_user_profile",
  VERSES: "mw_erp_quran_verses_data",
  HADITHS: "mw_erp_hadiths_data",
  ASMAUL_HUSNA: "mw_asmaul_husna_data",
  SETTINGS: "mw_settings",
  RAMADAN_MODE: "mw_ramadan_mode_active",
} as const

export const APP_PORTS = {
  PUBLIC_PORTAL: 3000,
  COMMAND_CENTER: 3001,
  API_BACKEND: 4000,
} as const

export const DEFAULT_COORDINATES = {
  MAKKAH_KAABA: {
    latitude: 21.4225,
    longitude: 39.8262,
    name: "Ka'bah, Makkah Al-Mukarramah",
  },
  JAKARTA_ISTIQLAL: {
    latitude: -6.1702,
    longitude: 106.8315,
    name: "Masjid Istiqlal, Jakarta",
  },
} as const

export const SYSTEM_CONSTANTS = {
  OS_VERSION: "MoonWitness OS V10.0",
  OS_CODENAME: "ENTERPRISE UNIFIED OBSERVATORY PLATFORM",
  MAX_PAGE_ANIMATIONS: 5,
  MAX_BLUR_ELEMENTS: 2,
  SESSION_COOKIE_NAME: "mw_session",

  // Geolocation
  QIBLA_BEARING: 295.14,
  KAABA_LAT: 21.4225,
  KAABA_LNG: 39.8262,
  JAKARTA_LAT: -6.2088,
  JAKARTA_LNG: 106.8456,
  EARTH_RADIUS_KM: 6371,

  // Time (in ms unless specified)
  SECOND: 1000,
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000,
  REFRESH_INTERVAL: 5000,
  POLL_INTERVAL: 10000,
  DEBOUNCE_MS: 300,

  // Telemetry Defaults
  DEFAULT_KNOWLEDGE_NODES: 1842,
  TOTAL_KNOWLEDGE_NODES: 5000,
  DEFAULT_ACTIVE_USERS: 128000,
  DEFAULT_OBSERVATIONS: 7342,
  UPTIME_HOURS: 3221,
} as const
