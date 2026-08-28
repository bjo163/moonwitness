import PjProject from './models/pj-project.ts'
import PjStage from './models/pj-stage.ts'
import PjTask from './models/pj-task.ts'
import PjMilestone from './models/pj-milestone.ts'
import PjSprint from './models/pj-sprint.ts'
import PjTag from './models/pj-tag.ts'

export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
export { PjProject, PjStage, PjTask, PjMilestone, PjSprint, PjTag }

export default {
  name: 'project',
  description: 'Project management, task tracking, sprints, milestones and kanban stages',
  depends: ['base'],
  models: [PjProject, PjStage, PjTask, PjMilestone, PjSprint, PjTag]
}
