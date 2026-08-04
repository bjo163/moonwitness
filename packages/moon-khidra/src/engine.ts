import { GoogleGenAI } from '@google/genai'
import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import { SYSTEM_PROMPT } from './prompt.js'
import { toolDeclarations, toolHandlers } from './tools.js'

export interface KhidraConfig {
  apiKeys: string[]
  model?: string
}

function env() {
  return createCtx(SUPERUSER_ID, {}, getModel as any)
}

export class KhidraEngine {
  private apiKeys: string[]
  private modelId: string

  constructor(config: KhidraConfig) {
    this.apiKeys = config.apiKeys
    this.modelId = config.model || 'gemini-2.5-flash'
  }

  private getClient(): GoogleGenAI {
    if (this.apiKeys.length === 0) throw new Error("No Gemini API keys provided")
    const key = this.apiKeys[Math.floor(Math.random() * this.apiKeys.length)]
    return new GoogleGenAI({ apiKey: key })
  }

  private async getOrCreateConversation(sessionId: string, userId?: number) {
    const KhConv = getModel('kh.conversation')
    const [existing] = await (KhConv as any).fetch(KhConv, env(), [['sessionId', '=', sessionId]])
    if (existing) return existing

    return await (KhConv as any).create(KhConv, env(), [{
      sessionId,
      userId: userId || null,
      title: "New Conversation",
      lastActivityAt: new Date()
    }])
  }

  private async saveMessage(convId: number, role: string, content: string, toolName?: string, toolResult?: string) {
    const KhMsg = getModel('kh.message')
    await (KhMsg as any).create(KhMsg, env(), [{
      conversationId: convId,
      role,
      content,
      toolName,
      toolResult
    }])
  }

  async *chat(sessionId: string, userMessage: string, userId?: number): AsyncGenerator<string> {
    const conv = await this.getOrCreateConversation(sessionId, userId)
    await this.saveMessage(conv.id, 'user', userMessage)

    // Retrieve history
    const KhMsg = getModel('kh.message')
    const history = await (KhMsg as any).fetch(KhMsg, env(), [['conversationId', '=', conv.id]], undefined, { order: 'id ASC' })
    
    const contents = history.map((msg: any) => {
      if (msg.role === 'function') {
        return { role: 'user', parts: [{ functionResponse: { name: msg.toolName, response: { result: msg.toolResult } } }] }
      }
      if (msg.toolName && msg.role === 'model') {
        return { role: 'model', parts: [{ functionCall: { name: msg.toolName, args: JSON.parse(msg.content || '{}') } }] }
      }
      return { role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] }
    })

    const client = this.getClient()
    
    // First pass
    const responseStream = await client.models.generateContentStream({
      model: this.modelId,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: toolDeclarations as any }],
      }
    })

    let fullText = ""
    let functionCall: any = null

    for await (const chunk of responseStream) {
      if (chunk.functionCalls && chunk.functionCalls.length > 0) {
        functionCall = chunk.functionCalls[0]
        break // Model wants to call a tool
      }
      if (chunk.text) {
        fullText += chunk.text
        yield chunk.text
      }
    }

    if (functionCall) {
      // Execute tool locally
      const toolName = functionCall.name
      const args = functionCall.args || {}
      
      await this.saveMessage(conv.id, 'model', JSON.stringify(args), toolName)

      const handler = toolHandlers[toolName]
      let toolResult = "Tool not found"
      if (handler) {
        toolResult = await handler(args)
      }

      await this.saveMessage(conv.id, 'function', '', toolName, toolResult)

      contents.push({ role: 'model', parts: [{ functionCall: { name: toolName, args } }] })
      contents.push({ role: 'user', parts: [{ functionResponse: { name: toolName, response: { result: toolResult } } }] })

      // Second pass with tool result
      const followUpStream = await client.models.generateContentStream({
        model: this.modelId,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ functionDeclarations: toolDeclarations as any }],
        }
      })

      for await (const chunk of followUpStream) {
        if (chunk.text) {
          fullText += chunk.text
          yield chunk.text
        }
      }
    }

    if (fullText) {
      await this.saveMessage(conv.id, 'model', fullText)
    }
    
    const KhConv = getModel('kh.conversation')
    await (KhConv as any).update(KhConv, env(), [['id', '=', conv.id]], { lastActivityAt: new Date() })
  }
}
