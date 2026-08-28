import MailActivityType from './mail-activity-type.ts'
import MailActivity from './mail-activity.ts'
import { MailMessage, FxMsgAlias } from './mail-message.ts'
import { MailTrackingValue, FxTrackAlias } from './mail-tracking-value.ts'

export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
export {
  MailActivityType,
  MailActivity,
  MailMessage,
  MailTrackingValue,
  FxMsgAlias,
  FxTrackAlias
}

export default {
  name: 'mail',
  description: 'Activity, chatter, and messaging engine',
  depends: ['base'],
  models: [
    MailActivityType,
    MailActivity,
    MailMessage,
    MailTrackingValue,
    FxMsgAlias,
    FxTrackAlias
  ]
}
