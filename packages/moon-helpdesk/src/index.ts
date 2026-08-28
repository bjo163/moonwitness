import HdTeam from './models/hd-team.ts'
import HdStage from './models/hd-stage.ts'
import HdTicket from './models/hd-ticket.ts'
import HdSla from './models/hd-sla.ts'
import HdTag from './models/hd-tag.ts'

export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
export { HdTeam, HdStage, HdTicket, HdSla, HdTag }

export default {
  name: 'helpdesk',
  description: 'Support ticketing, SLA tracking, and helpdesk team management',
  depends: ['base', 'project'],
  models: [HdTeam, HdStage, HdTicket, HdSla, HdTag]
}
