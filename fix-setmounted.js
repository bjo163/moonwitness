const fs = require('fs')
const path = require('path')

const files = [
"apps/web/@core/shell/taskbar.tsx",
"apps/web/@core/widgets/erp/ramadan-mode-widget.tsx",
"apps/web/@core/widgets/gamification/quest-widget.tsx",
"apps/web/@core/widgets/home/home-telemetry-sidebar-widget.tsx",
"apps/web/@core/widgets/modals/bookmark-manager-modal.tsx",
"apps/web/@core/widgets/modals/keyboard-shortcuts-modal.tsx",
"apps/web/@core/widgets/search/global-search-modal.tsx",
"apps/web/@core/widgets/adhan-notification-widget.tsx",
"apps/web/@core/widgets/orbit-orrery-widget.tsx",
"apps/web/@core/widgets/qibla-map-widget.tsx",
"apps/web/@core/widgets/qibla-radar-widget.tsx"
]

const basePath = "x:/REPO/moonwitness/moonwitness"

files.forEach(file => {
  const fullPath = path.join(basePath, file)
  if (!fs.existsSync(fullPath)) return
  let content = fs.readFileSync(fullPath, 'utf8')
  
  // This time, I will just remove the entire `setTimeout(() => setMounted(true), 0)` line if it exists
  content = content.replace(/[ \t]*setTimeout\(\(\)\s*=>\s*setMounted\(true\),\s*0\)\n?/g, "")
  content = content.replace(/[ \t]*setMounted\(true\)\n?/g, "")
  
  // If there's an empty useEffect left, remove it
  content = content.replace(/[ \t]*useEffect\(\(\)\s*=>\s*{\s*}\s*,\s*\[\]\)\n?/g, "")
  
  fs.writeFileSync(fullPath, content)
})
