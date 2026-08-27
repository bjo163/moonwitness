import HdTeam from './models/hd-team.js'
import HdStage from './models/hd-stage.js'
import HdTicket from './models/hd-ticket.js'
import HdSla from './models/hd-sla.js'
import HdTag from './models/hd-tag.js'

export { loadDemoData } from './demo-data.js'
export { views } from './views.js'
export { HdTeam, HdStage, HdTicket, HdSla, HdTag }

export default {
  name: 'helpdesk',
  description: 'Support ticketing, SLA tracking, and helpdesk team management',
  depends: ['base', 'project'],
  models: [HdTeam, HdStage, HdTicket, HdSla, HdTag]
}
