const fs = require('fs')
const path = require('path')

const files = [
  "apps/web/@core/contexts/toast-provider.tsx",
  "apps/web/@core/shell/footer-console.tsx",
  "apps/web/@core/shell/taskbar.tsx",
  "apps/web/@core/ui/command-palette-trigger.tsx",
  "apps/web/@core/widgets/erp/ramadan-mode-widget.tsx",
  "apps/web/@core/widgets/erp/spiritual-report-widget.tsx",
  "apps/web/@core/widgets/erp/tactical-settings-widget.tsx",
  "apps/web/@core/widgets/gamification/achievement-widget.tsx",
  "apps/web/@core/widgets/gamification/guild-leaderboard-widget.tsx",
  "apps/web/@core/widgets/gamification/quest-widget.tsx",
  "apps/web/@core/widgets/home/home-telemetry-sidebar-widget.tsx",
  "apps/web/@core/widgets/modals/bookmark-manager-modal.tsx",
  "apps/web/@core/widgets/modals/keyboard-shortcuts-modal.tsx",
  "apps/web/@core/widgets/modals/share-card-generator-modal.tsx",
  "apps/web/@core/widgets/monitoring/map/leaflet-map.tsx",
  "apps/web/@core/widgets/onboarding/onboarding-wizard.tsx",
  "apps/web/@core/widgets/search/global-search-modal.tsx",
  "apps/web/@core/widgets/adhan-notification-widget.tsx",
  "apps/web/@core/widgets/flying-prophetic-ai-widget.tsx",
  "apps/web/@core/widgets/orbit-orrery-widget.tsx",
  "apps/web/@core/widgets/qibla-map-widget.tsx",
  "apps/web/@core/widgets/qibla-radar-widget.tsx"
]

const basePath = "x:/REPO/moonwitness/moonwitness"

files.forEach(file => {
  const fullPath = path.join(basePath, file)
  if (!fs.existsSync(fullPath)) return
  let content = fs.readFileSync(fullPath, 'utf8')
  
  if (content.includes('useMounted') && !content.includes('useMounted } from')) {
     if (content.includes('from "@core/hooks"')) {
         content = content.replace(/(import\s*{[^}]*)(}\s*from\s*"@core\/hooks")/, "$1, useMounted $2")
     } else {
         // insert right after the first import or "use client"
         content = content.replace(/("use client"|'use client')\n?/, "$1\nimport { useMounted } from \"@core/hooks\"\n")
         if (!content.includes('import { useMounted }')) {
             content = `import { useMounted } from "@core/hooks"\n` + content
         }
     }
     fs.writeFileSync(fullPath, content)
     console.log("Added import to:", file)
  }
})
