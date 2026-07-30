export const API_ENDPOINTS = {
  SYSTEM: {
    TELEMETRY: "/api/mock/system/telemetry",
    GLOBAL_STATUS: "/api/mock/system/status",
    MISSION_ALERTS: "/api/mock/system/alerts",
  },
  KNOWLEDGE: {
    GRAPH: "/api/mock/knowledge/graph",
    SIGNALS: "/api/mock/knowledge/signals",
    RECOMMENDATIONS: "/api/mock/knowledge/recommendations",
  },
  ISLAMIC: {
    PRAYER_TIMES: "https://api.aladhan.com/v1/timingsByCity",
    QURAN: "https://api.alquran.cloud/v1",
    HADITH: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1",
  },
  ASTRONOMY: {
    MOON_PHASE: "/api/mock/astronomy/moon-phase",
    ECLIPSES: "/api/mock/astronomy/eclipses",
  },
} as const
