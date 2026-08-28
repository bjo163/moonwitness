import CabChange from './models/cab-change.ts'
import CabMeeting from './models/cab-meeting.ts'
import CabDecision from './models/cab-decision.ts'

export { registerCabRoutes } from './routes.ts'
export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
export { CabChange, CabMeeting, CabDecision }

export default {
  name: 'cab',
  description: 'Change Advisory Board governance, RFC review, and decision records',
  depends: ['base', 'project'],
  models: [CabChange, CabMeeting, CabDecision]
}
