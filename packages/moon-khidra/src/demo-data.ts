import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const Conversation = getModel('kh.conversation')
  const Message = getModel('kh.message')
  const IrAutomation = getModel('ir.automation')
  const IrWebhook = getModel('ir.webhook')
  const IrWebhookLog = getModel('ir.webhook.log')

  if (!Conversation || !Message) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const jsonSeed = loadJsonSeed<{
    conversations?: { sessionId: string; title: string; messages: { role: string; content: string }[] }[]
    automations?: { name: string; model: string; trigger: string; domain: string; actionType: string; actionData: string; active?: boolean }[]
    webhooks?: { name: string; url: string; eventTrigger: string; active?: boolean; logs?: { event: string; status: string; responseCode: number; durationMs: number; payload: string; responseBody: string }[] }[]
  }>('khidra')

  const demoConversations = jsonSeed?.conversations || [
    {
      sessionId: 'demo-session-spiritual-routine',
      title: 'Balancing Spiritual Routine with High-Tempo Space Research',
      messages: [
        {
          role: 'user',
          content: 'Bagaimana cara menjaga konsistensi wirid harian dan shalat malam saat jadwal observasi hilal dan riset astronomi berlangsung padat di malam hari?'
        },
        {
          role: 'model',
          content: 'Observasi keteraturan ciptaan Allah di langit malam itu sendiri adalah bentuk tafakkur yang bernilai ibadah agung (QS Ali Imran: 190-191). Anda dapat menggabungkan dzikir lisan saat mengamati instrumen, dan membagi waktu istirahat secara proporsional agar qiyamul lail tetap terlaksana walau dua rakaat ringkas.'
        }
      ]
    },
    {
      sessionId: 'demo-session-prophetic-diplomacy',
      title: 'Prophetic Diplomacy: Insights from Treaty of Hudaybiyyah',
      messages: [
        {
          role: 'user',
          content: 'Pelajaran apa yang dapat diambil dari Perjanjian Hudaibiyah terkait resolusi konflik dan negosiasi strategis?'
        },
        {
          role: 'model',
          content: 'Perjanjian Hudaibiyah mengajarkan pentingnya visi jangka panjang (strategic patience), fleksibilitas dalam klausul redaksional demi maslahat substansial, serta komitmen penuh terhadap perdamaian (Fathan Mubina).'
        }
      ]
    }
  ]

  for (const c of demoConversations) {
    const convRows = await Conversation.fetch(Conversation, env, [['sessionId', '=', c.sessionId]])
    let convId: number
    if (!convRows.length) {
      const row = await Conversation.spawn(Conversation, env, {
        sessionId: c.sessionId,
        title: c.title,
        messageCount: c.messages.length,
        lastActivityAt: new Date().toISOString()
      })
      convId = row.id as number
    } else {
      convId = convRows[0].id as number
    }

    const msgRows = await Message.fetch(Message, env, [['conversationId', '=', convId]])
    if (!msgRows.length) {
      for (const m of c.messages) {
        await Message.spawn(Message, env, {
          conversationId: convId,
          role: m.role,
          content: m.content,
          tokenCount: Math.round(m.content.length / 4)
        })
      }
    }
  }

  // Seed sample automation rules
  if (IrAutomation) {
    const automations = jsonSeed?.automations || [
      {
        name: 'Auto-Schedule SLA Review on Critical Ticket',
        model: 'hd.ticket',
        trigger: 'on_create',
        domain: JSON.stringify({ priority: 'critical' }),
        actionType: 'create_activity',
        actionData: JSON.stringify({ summary: 'Emergency SLA Triage Required (2h window)' }),
        active: true,
      },
      {
        name: 'Broadcast CAB RFC Approval to Outbound Mesh',
        model: 'cab.change',
        trigger: 'on_update',
        domain: JSON.stringify({ status: 'approved' }),
        actionType: 'enqueue_job',
        actionData: JSON.stringify({ jobName: 'Dispatch RFC Approved Webhook', queueName: 'automations' }),
        active: true,
      }
    ]

    for (const a of automations) {
      const existing = await (IrAutomation as any).fetch(IrAutomation, env, [['name', '=', a.name]])
      if (!existing.length) {
        await (IrAutomation as any).spawn(IrAutomation, env, a)
      }
    }
  }

  // Seed sample webhook & log
  if (IrWebhook && IrWebhookLog) {
    const webhooks = jsonSeed?.webhooks || [
      {
        name: 'Cosmic Council Security Dispatcher',
        url: 'https://security.moonwitness.org/api/hooks/telemetry',
        eventTrigger: 'record.created',
        active: true,
        logs: [
          {
            event: 'ticket.created',
            status: 'success',
            responseCode: 200,
            durationMs: 38.4,
            payload: JSON.stringify({ event: 'ticket.created', id: 104, priority: 'high' }),
            responseBody: '{"acknowledged": true, "receiptId": "MW-SEC-991"}'
          }
        ]
      }
    ]

    for (const w of webhooks) {
      let hookId: number
      const existing = await (IrWebhook as any).fetch(IrWebhook, env, [['name', '=', w.name]])
      if (!existing.length) {
        const hook = await (IrWebhook as any).spawn(IrWebhook, env, {
          name: w.name,
          url: w.url,
          eventTrigger: w.eventTrigger,
          active: w.active ?? true,
        })
        hookId = hook.id
      } else {
        hookId = existing[0].id
      }

      if (w.logs) {
        for (const l of w.logs) {
          const logExisting = await (IrWebhookLog as any).fetch(IrWebhookLog, env, [
            ['webhookId', '=', hookId],
            ['event', '=', l.event]
          ])
          if (!logExisting.length) {
            await (IrWebhookLog as any).spawn(IrWebhookLog, env, {
              webhookId: hookId,
              ...l
            })
          }
        }
      }
    }
  }

  console.log(`[moon-khidra] Demo data loaded: ${demoConversations.length} conversations, automations, and webhook logs`)
}
