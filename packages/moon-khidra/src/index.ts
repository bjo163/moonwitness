import KhConversation from './models/kh-conversation.js'
import KhMessage from './models/kh-message.js'

export { KhidraEngine, type KhidraConfig } from './engine.js'
export { GARDEN_BRAINSTORM_PROMPT, SYSTEM_PROMPT } from './prompt.js'
export { KhConversation, KhMessage }

export default {
  name: 'khidra',
  description: 'Prophetic AI Engine with ORM-native tool calling',
  depends: ['witness'],
  models: [KhConversation, KhMessage]
}
