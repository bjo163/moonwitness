import CrmStage from './crm-stage.js'
import CrmTeam from './crm-team.js'
import CrmLead from './crm-lead.js'

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
