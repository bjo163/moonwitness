import KhConversation from './models/kh-conversation.js'
import KhMessage from './models/kh-message.js'

export { KhidraEngine, type KhidraConfig } from './engine.js'
export { KhConversation, KhMessage }

export default {
  name: 'khidra',
  description: 'Prophetic AI Engine with ORM-native tool calling',
  depends: ['witness'],
  models: [KhConversation, KhMessage]
}
