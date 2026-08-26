import MailActivityType from './mail-activity-type.js'
import MailActivity from './mail-activity.js'
import { MailMessage, FxMsgAlias } from './mail-message.js'
import { MailTrackingValue, FxTrackAlias } from './mail-tracking-value.js'

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
