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
  if (!fs.existsSync(fullPath)) {
    console.log("Not found:", fullPath)
    return
  }
  let content = fs.readFileSync(fullPath, 'utf8')
  
  // Replace: const [mounted, setMounted] = useState(false)
  // With: const mounted = useMounted()
  if (content.includes('const [mounted, setMounted] = useState(false)')) {
    content = content.replace(/const \[mounted,\s*setMounted\] = useState\(false\)/, "const mounted = useMounted()")
    
    // Attempt to add import if not present
    if (!content.includes('useMounted')) {
       // Since it's from @core/hooks we can add it to the imports
       // First look for @core/hooks
       if (content.includes('from "@core/hooks"')) {
         content = content.replace(/(import\s*{[^}]*)(}\s*from\s*"@core\/hooks")/, "$1, useMounted $2")
       } else {
         content = `import { useMounted } from "@core/hooks"\n` + content
       }
    }

    // Attempt to remove simple useEffects containing ONLY setMounted
    content = content.replace(/useEffect\(\(\)\s*=>\s*{\s*(?:setTimeout\(\(\)\s*=>\s*)?setMounted\(true\)(?:,\s*0\))?\s*}\s*,\s*\[\]\)\n?/g, "")
    // Remove if there's no brackets around setTimeout
    content = content.replace(/useEffect\(\(\)\s*=>\s*setTimeout\(\(\)\s*=>\s*setMounted\(true\),\s*0\)\s*,\s*\[\]\)\n?/g, "")
    
    // There might be some manual cleanups needed for complex useEffects, we will leave those to be safe and manually fix them if compilation fails.
    
    fs.writeFileSync(fullPath, content)
    console.log("Updated:", file)
  }
})
