// ◈ MOONWITNESS OS — CANONICAL SYSTEM LABELS
// Conforming to Design Bible §11 (Terminology & Writing Conventions)

export const OS_TERMINOLOGY = {
  LOADING: "SYNCHRONIZING...",
  SUCCESS: "OPERATION COMPLETE",
  ERROR: "SYSTEM FAULT",
  OFFLINE: "SIGNAL LOST",
  STANDBY: "SYSTEM STANDBY",
  QUERY: "QUERY DATABASE",
  COMMAND_GROUPS: "COMMAND GROUPS",
  TERMINATE_SESSION: "TERMINATE SESSION",
  TRANSMISSION: "TRANSMISSION",
  ACKNOWLEDGE: "ACKNOWLEDGE",
  BROADCAST: "BROADCAST",
} as const

export const MATRIX_LABELS = {
  en: {
    TABLE: "Table Grid",
    KANBAN: "Kanban Board",
    PIVOT: "Analytical Pivot",
    IMPORT_CSV: "Import CSV Dataset",
    PRINT_BRIEFING: "Print Briefing Memorandum",
    EXPORT_CSV: "Export CSV",
    EXPORT_JSON: "Export JSON",
    NEW_ENTRY: "New Instance",
    COMMIT_MORPH: "Commit Record Morph",
    MUTATION_AUDIT: "Mutation Audit Trail",
    AUTOMATIONS: "Automated Workflow Rules",
    WEBHOOKS: "Outbound Webhook Gateway",
    TWO_FACTOR_AUTH: "Two-Factor Authentication",
  },
  id: {
    TABLE: "Tabel Matriks",
    KANBAN: "Papan Kanban",
    PIVOT: "Pivot Analitikal",
    IMPORT_CSV: "Impor Data CSV",
    PRINT_BRIEFING: "Cetak Nota Ringkasan",
    EXPORT_CSV: "Ekspor CSV",
    EXPORT_JSON: "Ekspor JSON",
    NEW_ENTRY: "Entri Baru",
    COMMIT_MORPH: "Simpan Perubahan",
    MUTATION_AUDIT: "Jejak Audit Mutasi",
    AUTOMATIONS: "Aturan Otomatisasi Alur",
    WEBHOOKS: "Gerbang Webhook Keluar",
    TWO_FACTOR_AUTH: "Autentikasi Dua-Faktor",
  },
  ar: {
    TABLE: "جدول المصفوفة",
    KANBAN: "لوحة كانبان",
    PIVOT: "المصفوفة التحليلية",
    IMPORT_CSV: "استيراد ملف CSV",
    PRINT_BRIEFING: "طباعة المذكرة التنفيذية",
    EXPORT_CSV: "تصدير CSV",
    EXPORT_JSON: "تصدير JSON",
    NEW_ENTRY: "إدخال جديد",
    COMMIT_MORPH: "حفظ التعديلات",
    MUTATION_AUDIT: "سجل التدقيق والتعديل",
    AUTOMATIONS: "قواعد الأتمتة التلقائية",
    WEBHOOKS: "بوابة ويب هوك الخارجية",
    TWO_FACTOR_AUTH: "المصادقة الثنائية",
  },
} as const

export const HIJRI_MONTHS = {
  en: [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Ula", "Jumada al-Akhirah", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qa'dah", "Dhu al-Hijjah",
  ],
  id: [
    "Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir",
    "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
    "Ramadan", "Syawal", "Zulqa'dah", "Zulhijjah",
  ],
  ar: [
    "مُحَرَّم", "صَفَر", "رَبِيع الأَوَّل", "رَبِيع الآخِر",
    "جُمَادَى الأُولَى", "جُمَادَى الآخِرَة", "رَجَب", "شَعْبَان",
    "رَمَضَان", "شَوَّال", "ذُو القَعْدَة", "ذُو الحِجَّة",
  ],
} as const
