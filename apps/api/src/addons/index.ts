import baseAddons, {
  seedBaseData,
  loadBaseData,
  views as baseViews,
  loadDemoData as loadBaseDemoData,
} from "@moon/base"
import performanceAddons, {
  performanceMiddleware,
  views as performanceViews,
  loadDemoData as loadPerformanceDemoData,
} from "@moon/performance"
import witnessAddons, {
  registerWitnessRoutes,
  seedWitnessGraphCore,
  views as witnessViews,
  loadDemoData as loadWitnessDemoData,
} from "@moon/witness"
import khidraAddons, {
  views as khidraViews,
  loadDemoData as loadKhidraDemoData,
} from "@moon/khidra"
import mizanAddons, {
  registerMizanRoutes,
  views as mizanViews,
  loadDemoData as loadMizanDemoData,
} from "@moon/mizan"
import shootgunAddons, {
  views as shootgunViews,
  loadDemoData as loadShootgunDemoData,
} from "@moon/shootgun"
import cabAddons, {
  registerCabRoutes,
  views as cabViews,
  loadDemoData as loadCabDemoData,
} from "@moon/cab"
import projectAddons, {
  views as projectViews,
  loadDemoData as loadProjectDemoData,
} from "@moon/project"
import helpdeskAddons, {
  views as helpdeskViews,
  loadDemoData as loadHelpdeskDemoData,
} from "@moon/helpdesk"
import productAddons, {
  views as productViews,
  loadDemoData as loadProductDemoData,
} from "@moon/product"
import stockAddons, {
  views as stockViews,
  loadDemoData as loadStockDemoData,
} from "@moon/stock"
import accountAddons, {
  views as accountViews,
  loadDemoData as loadAccountDemoData,
} from "@moon/account"
import crmAddons, {
  views as crmViews,
  loadDemoData as loadCrmDemoData,
} from "@moon/crm"
import mailAddons, {
  views as mailViews,
  loadDemoData as loadMailDemoData,
} from "@moon/mail"
import geoAddons, {
  views as geoViews,
  loadDemoData as loadGeoDemoData,
} from "@moon/geo"
import cronAddons, {
  views as cronViews,
  globalCronRunner,
  loadDemoData as loadCronDemoData,
} from "@moon/cron"

export {
  performanceMiddleware,
  globalCronRunner,
  seedBaseData,
  loadBaseData,
  seedWitnessGraphCore,
}

export const allAddonModels = [
  ...baseAddons.models,
  ...performanceAddons.models,
  ...witnessAddons.models,
  ...projectAddons.models,
  ...helpdeskAddons.models,
  ...khidraAddons.models,
  ...mizanAddons.models,
  ...shootgunAddons.models,
  ...cabAddons.models,
  ...productAddons.models,
  ...stockAddons.models,
  ...accountAddons.models,
  ...crmAddons.models,
  ...mailAddons.models,
  ...geoAddons.models,
  ...cronAddons.models,
]

export const allAddonViews = {
  ...baseViews,
  ...performanceViews,
  ...witnessViews,
  ...projectViews,
  ...helpdeskViews,
  ...khidraViews,
  ...mizanViews,
  ...shootgunViews,
  ...cabViews,
  ...productViews,
  ...stockViews,
  ...accountViews,
  ...crmViews,
  ...mailViews,
  ...geoViews,
  ...cronViews,
}

export const allDemoLoaders = [
  { name: "base", fn: loadBaseDemoData },
  { name: "performance", fn: loadPerformanceDemoData },
  { name: "witness", fn: loadWitnessDemoData },
  { name: "project", fn: loadProjectDemoData },
  { name: "helpdesk", fn: loadHelpdeskDemoData },
  { name: "khidra", fn: loadKhidraDemoData },
  { name: "mizan", fn: loadMizanDemoData },
  { name: "shootgun", fn: loadShootgunDemoData },
  { name: "cab", fn: loadCabDemoData },
  { name: "product", fn: loadProductDemoData },
  { name: "stock", fn: loadStockDemoData },
  { name: "account", fn: loadAccountDemoData },
  { name: "crm", fn: loadCrmDemoData },
  { name: "mail", fn: loadMailDemoData },
  { name: "geo", fn: loadGeoDemoData },
  { name: "cron", fn: loadCronDemoData },
]

export function initAddonRoutes(): void {
  registerWitnessRoutes()
  registerMizanRoutes()
  registerCabRoutes()
}
