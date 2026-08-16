import CabProject from './models/cab-project.js'
import CabTask from './models/cab-task.js'
import CabChange from './models/cab-change.js'
import CabMeeting from './models/cab-meeting.js'
import CabDecision from './models/cab-decision.js'

export { registerCabRoutes } from './routes.js'
export { CabProject, CabTask, CabChange, CabMeeting, CabDecision }

export default {
  name: 'cab',
  description: 'Change Advisory Board project, task, and change governance addon',
  depends: ['base'],
  models: [CabProject, CabTask, CabChange, CabMeeting, CabDecision]
}