import CrmStage from './crm-stage.ts'
import CrmTeam from './crm-team.ts'
import CrmLead from './crm-lead.ts'

export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
export {
  CrmStage,
  CrmTeam,
  CrmLead
}

export default {
  name: 'crm',
  description: 'Customer Relationship Management and Lead Pipeline',
  depends: ['base', 'mail'],
  models: [
    CrmStage,
    CrmTeam,
    CrmLead
  ]
}
