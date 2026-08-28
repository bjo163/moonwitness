import { GoogleGenAI } from '@google/genai'
import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import { SYSTEM_PROMPT } from './prompt.ts'
import { toolDeclarations, toolHandlers } from './tools.ts'

export interface KhidraConfig {
  apiKeys: string[]
  model?: string
  systemPrompt?: string
}

function env() {
  return createCtx(SUPERUSER_ID, {}, getModel as any)
}

export class KhidraEngine {
  private apiKeys: string[]
  private modelId: string
  private systemPrompt: string
  private rateLimitMap: Map<string, { count: number, resetAt: number }> = new Map()
  
  // Prep limit: 10 requests per minute
  private MAX_REQUESTS_PER_MINUTE = 10

  constructor(config: KhidraConfig) {
    this.apiKeys = config.apiKeys
    this.modelId = config.model || 'gemini-2.5-flash'
    this.systemPrompt = config.systemPrompt || SYSTEM_PROMPT
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

  private checkRateLimit(key: string) {
    const now = Date.now()
    const record = this.rateLimitMap.get(key)
    
    if (!record || now > record.resetAt) {
      this.rateLimitMap.set(key, { count: 1, resetAt: now + 60000 })
      return
    }
    
    if (record.count >= this.MAX_REQUESTS_PER_MINUTE) {
      throw new Error(`Rate limit exceeded for Khidra AI. Please wait before sending more messages.`)
    }
    
    record.count++
  }

  async *chat(sessionId: string, userMessage: string, userId?: number): AsyncGenerator<string> {
    const rateKey = userId ? `user_${userId}` : `session_${sessionId}`
    this.checkRateLimit(rateKey)
    
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
        systemInstruction: this.systemPrompt,
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
          systemInstruction: this.systemPrompt,
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
