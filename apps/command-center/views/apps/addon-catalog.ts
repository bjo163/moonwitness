export const CATEGORIES = [
  "All",
  "Enterprise Operations",
  "Celestial & Knowledge",
  "System Services",
  "Core",
] as const

export const CATEGORY_MAP: Record<string, string> = {
  project: "Enterprise Operations",
  helpdesk: "Enterprise Operations",
  cab: "Enterprise Operations",
  crm: "Enterprise Operations",
  product: "Enterprise Operations",
  stock: "Enterprise Operations",
  account: "Enterprise Operations",
  witness: "Celestial & Knowledge",
  khidra: "Celestial & Knowledge",
  mizan: "Celestial & Knowledge",
  geo: "Celestial & Knowledge",
  mail: "System Services",
  cron: "System Services",
  performance: "System Services",
  shootgun: "System Services",
  base: "Core",
}
