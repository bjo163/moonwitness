import { createCtx, getDb, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'
import bcrypt from 'bcryptjs'

const BCRYPT_ROUNDS = 10

export async function loadDemoData() {
  const User = getModel('vx.user')
  const Partner = getModel('vx.node')
  const Company = getModel('vx.org')
  const Groups = getModel('vx.role')
  if (!User || !Partner || !Company || !Groups) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)
  const db = getDb()
  const conn = env.trx || db

  const jsonSeed = loadJsonSeed<{
    operators?: { name: string; email: string; password: string; isAdmin: boolean }[]
    stations?: { name: string; email: string; is_company: boolean }[]
    reportTemplates?: any[]
  }>('base')

  // Find admin group
  let adminGroupId: number | undefined
  const groupRows = await Groups.fetch(Groups, env, [['name', '=', 'Admin']])
  if (groupRows.length) {
    adminGroupId = groupRows[0].id as number
  }

  // Get or find main company
  let mainCompanyId: number | undefined
  const compRows = await Company.fetch(Company, env, [['name', '=', 'MoonWitness']])
  if (compRows.length) {
    mainCompanyId = compRows[0].id as number
  }

  // ── Demo Operators ──
  const demoUsers = jsonSeed?.operators || [
    {
      name: 'Tariq Ibn Ziyad',
      email: 'tariq@moonwitness.os',
      password: 'password123',
      isAdmin: false
    },
    {
      name: 'Fatima Al-Fihri',
      email: 'fatima@moonwitness.os',
      password: 'password123',
      isAdmin: true
    },
    {
      name: 'Hassan Ibn Al-Haytham',
      email: 'hassan@moonwitness.os',
      password: 'password123',
      isAdmin: false
    },
    {
      name: 'Maryam Mirzakhani',
      email: 'maryam@moonwitness.os',
      password: 'password123',
      isAdmin: false
    },
    {
      name: 'Abu Raihan Al-Biruni',
      email: 'biruni@moonwitness.os',
      password: 'password123',
      isAdmin: true
    },
    {
      name: 'Ulugh Beg',
      email: 'ulughbeg@moonwitness.os',
      password: 'password123',
      isAdmin: false
    }
  ]

  for (const u of demoUsers) {
    const existingPartner = await conn('vx_node').where({ email: u.email }).first()
    let partnerId: number
    if (!existingPartner) {
      const [inserted] = await conn('vx_node').insert({
        name: u.name,
        is_company: false,
        email: u.email,
        company_id: mainCompanyId,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*')
      partnerId = inserted.id
    } else {
      partnerId = existingPartner.id
    }

    const existingUser = await conn('vx_user').where({ login: u.email }).first()
    const hashedPassword = await bcrypt.hash(u.password, BCRYPT_ROUNDS)
    let userId: number
    if (!existingUser) {
      const [inserted] = await conn('vx_user').insert({
        login: u.email,
        password: hashedPassword,
        partner_id: partnerId,
        company_id: mainCompanyId,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*')
      userId = inserted.id
    } else {
      userId = existingUser.id
      await conn('vx_user').where({ id: userId }).update({
        password: hashedPassword,
        login: u.email
      })
    }

    if (u.isAdmin && adminGroupId) {
      const exists = await conn('vx_user_vx_role_rel')
        .where({ vx_user_id: userId, vx_role_id: adminGroupId })
        .first()
      if (!exists) {
        await conn('vx_user_vx_role_rel').insert({
          vx_user_id: userId,
          vx_role_id: adminGroupId
        })
      }
    }
  }

  // ── Demo Partner Stations / Observatories ──
  const demoBranches = jsonSeed?.stations || [
    { name: 'MoonWitness Observatory - Alexandria', email: 'alexandria@moonwitness.os', is_company: true },
    { name: 'MoonWitness Lunar Station - Granada', email: 'granada@moonwitness.os', is_company: true },
    { name: 'MoonWitness Observatorium Bosscha - Lembang', email: 'bosscha@moonwitness.os', is_company: true },
    { name: 'MoonWitness Samarkand Planetary Station', email: 'samarkand@moonwitness.os', is_company: true }
  ]
  for (const b of demoBranches) {
    const existingBranch = await conn('vx_node').where({ email: b.email }).first()
    if (!existingBranch) {
      await conn('vx_node').insert({
        name: b.name,
        email: b.email,
        is_company: true,
        company_id: mainCompanyId,
        created_at: new Date(),
        updated_at: new Date()
      })
    }
  }

  // ── Demo Report Templates ──
  const IrReport = getModel('ir.report')
  if (IrReport) {
    const demoReports = jsonSeed?.reportTemplates || [
      {
        name: 'Project Milestone Status Briefing',
        model: 'pj.project',
        reportType: 'briefing',
        orientation: 'portrait',
        headerTitle: 'COSMIC MISSION EXECUTION BRIEFING',
        footerNotice: 'CONFIDENTIAL // FOR INTERNAL OBSERVATORY GOVERNANCE ONLY',
        showQrCode: true,
        active: true,
      },
      {
        name: 'Support SLA Compliance Audit',
        model: 'hd.ticket',
        reportType: 'audit',
        orientation: 'portrait',
        headerTitle: 'INCIDENT & SLA AUDIT CERTIFICATION',
        footerNotice: 'OFFICIAL SYSTEM COMPLIANCE VERIFICATION RECORD',
        showQrCode: true,
        active: true,
      },
      {
        name: 'CAB RFC Decision Memorandum',
        model: 'cab.change',
        reportType: 'briefing',
        orientation: 'portrait',
        headerTitle: 'CIVILIZATION ARCHITECTURE BOARD // RFC MEMO',
        footerNotice: 'CONSENSUS RATIFIED UNDER CONSTITUTIONAL LAW',
        showQrCode: true,
        active: true,
      },
      {
        name: 'Financial Ledger & Zakat Disbursement Summary',
        model: 'account.move',
        reportType: 'audit',
        orientation: 'landscape',
        headerTitle: 'FINANCIAL INTEGRITY & ZAKAT DISTRIBUTION REPORT',
        footerNotice: 'VERIFIED AGAINST DOUBLE-ENTRY LEDGER CONSTRAINTS',
        showQrCode: true,
        active: true,
      },
      {
        name: 'Astronomical Ru’yah Observation Registry',
        model: 'geo.city',
        reportType: 'briefing',
        orientation: 'portrait',
        headerTitle: 'NATIONAL RU\'YATUL HILAL OBSERVATION REGISTRY',
        footerNotice: 'AUTHENTICATED UNDER IMKANUR RUKYAT MABIMS CRITERIA',
        showQrCode: true,
        active: true,
      }
    ]

    for (const r of demoReports) {
      const existingRep = await (IrReport as any).fetch(IrReport, env, [['name', '=', r.name]])
      if (!existingRep.length) {
        await (IrReport as any).spawn(IrReport, env, r)
      }
    }
  }

  console.log(`[moon-base] Demo data loaded: ${demoUsers.length} operators, ${demoBranches.length} observatory stations, report templates initialized`)
}
