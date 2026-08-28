import KhConversation from './models/kh-conversation.ts'
import KhMessage from './models/kh-message.ts'
import IrAutomation from './models/ir-automation.ts'
import IrWebhook from './models/ir-webhook.ts'
import IrWebhookLog from './models/ir-webhook-log.ts'

export { KhidraEngine, type KhidraConfig } from './engine.ts'
export { evaluateAutomations } from './engine/automation-engine.ts'
export { GARDEN_BRAINSTORM_PROMPT, SYSTEM_PROMPT } from './prompt.ts'
export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
export { KhConversation, KhMessage, IrAutomation, IrWebhook, IrWebhookLog }

export default {
  name: 'khidra',
  description: 'Prophetic AI Engine, Event-Driven Automations, and Webhook Mesh',
  depends: ['witness'],
  models: [KhConversation, KhMessage, IrAutomation, IrWebhook, IrWebhookLog]
}
