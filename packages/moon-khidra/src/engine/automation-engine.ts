import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import type IrAutomation from '../models/ir-automation.ts'
import type IrWebhook from '../models/ir-webhook.ts'
import type IrWebhookLog from '../models/ir-webhook-log.ts'

export async function evaluateAutomations(
  modelName: string,
  triggerType: 'on_create' | 'on_update' | 'on_time',
  record: any
): Promise<number> {
  const IrAutomationModel = getModel('ir.automation') as typeof IrAutomation
  if (!IrAutomationModel) return 0

  const env = createCtx(SUPERUSER_ID, {}, getModel as any)
  let executedCount = 0

  try {
    const rules = await IrAutomationModel.query(env)
      .where('model', modelName)
      .where('trigger', triggerType)
      .where('active', true)
      .fetch()

    for (const rule of rules) {
      // Check optional domain criteria
      if (rule.domain) {
        try {
          const filter = JSON.parse(rule.domain)
          let match = true
          for (const [k, v] of Object.entries(filter)) {
            let actualVal = record[k]
            if (typeof actualVal === 'object' && actualVal !== null) actualVal = actualVal.id
            if (String(actualVal) !== String(v)) {
              match = false
              break
            }
          }
          if (!match) continue
        } catch {
          // If domain parse fails, proceed
        }
      }

      // Execute Action
      await executeAutomationAction(rule, record, env)
      executedCount++
    }
  } catch (err) {
    console.error(`[AutomationEngine] Error evaluating rules for ${modelName}:`, err)
  }

  return executedCount
}

async function executeAutomationAction(rule: any, record: any, env: any): Promise<void> {
  let actionData: any = {}
  try {
    if (rule.actionData) actionData = JSON.parse(rule.actionData)
  } catch {
    actionData = {}
  }

  // 1. Create Scheduled Activity in @moon/mail
  if (rule.actionType === 'create_activity') {
    const MailActivity = getModel('mail.activity')
    if (MailActivity) {
      await (MailActivity as any).spawn(MailActivity, env, {
        resModel: rule.model,
        resId: record.id,
        summary: actionData.summary || `Automated: ${rule.name}`,
        dateDue: actionData.dateDue || new Date().toISOString().slice(0, 10),
        status: 'planned',
      })
    }
  }

  // 2. Enqueue Worker Queue Job in @moon/cron
  if (rule.actionType === 'enqueue_job') {
    const IrQueueJob = getModel('ir.queue.job')
    if (IrQueueJob) {
      await (IrQueueJob as any).spawn(IrQueueJob, env, {
        name: actionData.jobName || `AutoJob: ${rule.name} on #${record.id}`,
        queueName: actionData.queueName || 'automations',
        status: 'waiting',
        priority: actionData.priority || 5,
        payload: JSON.stringify({ model: rule.model, recordId: record.id, ...actionData }),
        nextRunAt: new Date(),
      })
    }
  }

  // 3. Auto-Mutate Record Fields
  if (rule.actionType === 'update_fields' && actionData.updates) {
    const TargetModel = getModel(rule.model)
    if (TargetModel && record.id) {
      await (TargetModel as any).morph(TargetModel, env, record.id, actionData.updates)
    }
  }

  // 4. Dispatch Webhook
  if (rule.actionType === 'webhook' && actionData.webhookId) {
    const IrWebhookModel = getModel('ir.webhook') as typeof IrWebhook
    const IrWebhookLogModel = getModel('ir.webhook.log') as typeof IrWebhookLog
    if (IrWebhookModel && IrWebhookLogModel) {
      const webhook = await IrWebhookModel.query(env).where('id', actionData.webhookId).first()
      if (webhook && webhook.active) {
        const startTime = Date.now()
        let status: 'success' | 'failed' = 'success'
        let responseCode = 200
        let errorMsg: string | undefined

        try {
          const res = await fetch(webhook.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Moon-Event': `record.${rule.trigger}`,
              'X-Moon-Model': rule.model,
            },
            body: JSON.stringify({ event: `record.${rule.trigger}`, model: rule.model, record }),
          })
          responseCode = res.status
          if (!res.ok) status = 'failed'
        } catch (err: any) {
          status = 'failed'
          errorMsg = err?.message || String(err)
          responseCode = 0
        }

        await IrWebhookLogModel.spawn(IrWebhookLogModel, env, {
          webhookId: webhook.id,
          event: `record.${rule.trigger}`,
          status,
          responseCode,
          durationMs: Date.now() - startTime,
          payload: JSON.stringify({ event: `record.${rule.trigger}`, recordId: record.id }),
          error: errorMsg,
        })
      }
    }
  }
}
