import PjProject from './models/pj-project.js'
import PjStage from './models/pj-stage.js'
import PjTask from './models/pj-task.js'
import PjMilestone from './models/pj-milestone.js'
import PjSprint from './models/pj-sprint.js'
import PjTag from './models/pj-tag.js'

export { loadDemoData } from './demo-data.js'
export { views } from './views.js'
export { PjProject, PjStage, PjTask, PjMilestone, PjSprint, PjTag }

export default {
  name: 'project',
  description: 'Project management, task tracking, sprints, milestones and kanban stages',
  depends: ['base'],
  models: [PjProject, PjStage, PjTask, PjMilestone, PjSprint, PjTag]
}
