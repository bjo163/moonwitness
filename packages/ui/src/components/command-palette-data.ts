import { NAVIGATION_MESH } from "@workspace/types"

export type CommandPaletteItemData = {
  label: string
  href: string
  category: string
  isExternal?: boolean
}

const scriptures: CommandPaletteItemData[] = [
  { label: "Surah Al-Fatihah (1:1-7)", href: "/knowledge/kitab?surah=1", category: "Scripture Hub" },
  { label: "Surah Al-Baqarah — Ayat Kursi (2:255)", href: "/knowledge/kitab?surah=2&ayah=255", category: "Scripture Hub" },
  { label: "Surah Yasin (36:1-83)", href: "/knowledge/kitab?surah=36", category: "Scripture Hub" },
  { label: "Surah Al-Kahf (18:1-110)", href: "/knowledge/kitab?surah=18", category: "Scripture Hub" },
  { label: "Surah Al-Mulk (67:1-30)", href: "/knowledge/kitab?surah=67", category: "Scripture Hub" },
]

const matrixModels: CommandPaletteItemData[] = [
  ["Tasks & Backlog", "pj.task"], ["Projects & Milestones", "pj.project"], ["Support Tickets", "hd.ticket"],
  ["CAB RFC Governance", "cab.change"], ["Background Scheduled Jobs", "ir.cron"], ["Worker Queue & Jobs", "ir.queue.job"],
  ["Cron Execution Logs", "ir.cron.log"], ["CRM Outreach Leads", "crm.lead"], ["Product Catalog", "product.template"],
  ["Warehouses", "stock.warehouse"], ["Inventory Moves", "stock.move"], ["Financial Ledger", "account.account"],
  ["Ethical Cases", "mz.case"], ["AI Conversations", "kh.conversation"], ["Operations Log", "sg.operation"],
  ["System Telemetry & Requests", "px.request"], ["Observatory Cities", "geo.city"], ["Automation Rules", "ir.automation"],
  ["Outbound Webhooks", "ir.webhook"], ["Webhook Dispatch Logs", "ir.webhook.log"], ["Report Templates", "ir.report"],
  ["Dashboard Widgets", "ir.dashboard.widget"],
].map(([label, model]) => ({ label: `${label} (${model})`, href: `/matrix/${model}`, category: "Matrix Workspace" }))

const hadiths: CommandPaletteItemData[] = [
  { label: "Shahih Al-Bukhari (7,563 Hadiths)", href: "/knowledge/hadits?book=bukhari", category: "Hadith Compendiums" },
  { label: "Shahih Muslim (3,033 Hadiths)", href: "/knowledge/hadits?book=muslim", category: "Hadith Compendiums" },
  { label: "Sunan Abu Dawud", href: "/knowledge/hadits?book=abudawud", category: "Hadith Compendiums" },
  { label: "Jami' At-Tirmidzi", href: "/knowledge/hadits?book=tirmidzi", category: "Hadith Compendiums" },
]

export function getCommandPaletteItems(commandCenterUrl?: string): CommandPaletteItemData[] {
  const portalLinks = NAVIGATION_MESH.portal.flatMap((portal) => {
    const subLinks = "subLinks" in portal ? portal.subLinks : []
    return [
      { label: portal.label, href: portal.href, category: "Public Portal" },
      ...subLinks.map((link) => ({ label: link.label, href: link.href, category: portal.label })),
    ]
  })
  const commandCenterLinks =
    commandCenterUrl === undefined
      ? []
      : NAVIGATION_MESH.commandCenter.map((command) => ({
          label: command.label,
          href: commandCenterUrl
            ? `${commandCenterUrl}${command.href}`
            : command.href,
          category: "Command Center (Admin)",
          isExternal: Boolean(commandCenterUrl),
        }))
  return [...portalLinks, ...commandCenterLinks, ...matrixModels, ...scriptures, ...hadiths]
}
