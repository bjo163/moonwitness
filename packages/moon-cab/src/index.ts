import CabChange from './models/cab-change.js'
import CabMeeting from './models/cab-meeting.js'
import CabDecision from './models/cab-decision.js'

export { registerCabRoutes } from './routes.js'
export { loadDemoData } from './demo-data.js'
export { views } from './views.js'
export { CabChange, CabMeeting, CabDecision }

export default {
  name: 'cab',
  description: 'Change Advisory Board governance, RFC review, and decision records',
  depends: ['base', 'project'],
  models: [CabChange, CabMeeting, CabDecision]
}
