import KhConversation from './models/kh-conversation.js'
import KhMessage from './models/kh-message.js'
import IrAutomation from './models/ir-automation.js'
import IrWebhook from './models/ir-webhook.js'
import IrWebhookLog from './models/ir-webhook-log.js'

export { KhidraEngine, type KhidraConfig } from './engine.js'
export { evaluateAutomations } from './engine/automation-engine.js'
export { GARDEN_BRAINSTORM_PROMPT, SYSTEM_PROMPT } from './prompt.js'
export { loadDemoData } from './demo-data.js'
export { views } from './views.js'
export { KhConversation, KhMessage, IrAutomation, IrWebhook, IrWebhookLog }

export default {
  name: 'khidra',
  description: 'Prophetic AI Engine, Event-Driven Automations, and Webhook Mesh',
  depends: ['witness'],
  models: [KhConversation, KhMessage, IrAutomation, IrWebhook, IrWebhookLog]
}
