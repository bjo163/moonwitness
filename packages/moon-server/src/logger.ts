import fs from 'node:fs'
import path from 'node:path'

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m'
}

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

class Logger {
  private logFile: string

  constructor() {
    this.logFile = path.resolve(process.cwd(), 'moonwitness.log')
  }

  private writeToFile(message: string, rawData: { level: string, context: string, message: string }) {
    // Append to file, remove ANSI color codes before writing
    const cleanMessage = message.replace(/\x1b\[[0-9;]*m/g, '') + '\n'
    fs.appendFileSync(this.logFile, cleanMessage)
    
    // Broadcast via global emitter if available
    if ((globalThis as any).moonEmitter) {
      (globalThis as any).moonEmitter.emit('moon_event', {
        topic: 'system_logs',
        payload: {
          level: rawData.level,
          context: rawData.context,
          text: cleanMessage.trim(),
          timestamp: new Date().toISOString()
        }
      })
    }
  }

  private formatMessage(level: LogLevel, context: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    let color = COLORS.reset
    switch (level) {
      case 'INFO': color = COLORS.green; break;
      case 'WARN': color = COLORS.yellow; break;
      case 'ERROR': color = COLORS.red; break;
      case 'DEBUG': color = COLORS.gray; break;
    }

    let output = `${COLORS.gray}[${timestamp}]${COLORS.reset} ${color}[${level}]${COLORS.reset} ${COLORS.cyan}${context}:${COLORS.reset} ${message}`
    if (data) {
      const dataStr = typeof data === 'object' ? JSON.stringify(data) : String(data)
      output += ` ${COLORS.gray}${dataStr}${COLORS.reset}`
    }
    return output
  }

  info(context: string, message: string, data?: any) {
    const msg = this.formatMessage('INFO', context, message, data)
    console.log(msg)
    this.writeToFile(msg, { level: 'INFO', context, message })
  }

  warn(context: string, message: string, data?: any) {
    const msg = this.formatMessage('WARN', context, message, data)
    console.warn(msg)
    this.writeToFile(msg, { level: 'WARN', context, message })
  }

  error(context: string, message: string, data?: any) {
    const msg = this.formatMessage('ERROR', context, message, data)
    console.error(msg)
    this.writeToFile(msg, { level: 'ERROR', context, message })
  }

  debug(context: string, message: string, data?: any) {
    if (process.env.DEBUG === 'true') {
      const msg = this.formatMessage('DEBUG', context, message, data)
      console.debug(msg)
      this.writeToFile(msg, { level: 'DEBUG', context, message })
    }
  }
}

export const logger = new Logger()
