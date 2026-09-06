import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const Account = getModel('account.account')
  const Journal = getModel('account.journal')
  const Move = getModel('account.move')
  const MoveLine = getModel('account.move.line')
  const Org = getModel('vx.org')

  if (!Account || !Journal) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  let mainCompanyId: number | undefined
  if (Org) {
    const compRows = await Org.fetch(Org, env, [['name', '=', 'MoonWitness']])
    if (compRows.length) mainCompanyId = compRows[0].id as number
  }

  const jsonSeed = loadJsonSeed<{
    accounts?: { code: string; name: string; accountType: string }[]
    journals?: { code: string; name: string; type: string }[]
  }>('account')

  // ── Chart of Accounts ──
  const accountSeeds = jsonSeed?.accounts || [
    { code: '101000', name: 'Kas Utama / Petty Cash', accountType: 'asset_cash' },
    { code: '102000', name: 'Bank Syariah Operasional', accountType: 'asset_cash' },
    { code: '110000', name: 'Piutang Donasi / Penjualan', accountType: 'asset_receivable' },
    { code: '112000', name: 'Perlengkapan & Suku Cadang Observatorium', accountType: 'asset_current' },
    { code: '150000', name: 'Aset Tetap Teleskop & Kubah Pengamat', accountType: 'asset_non_current' },
    { code: '210000', name: 'Hutang Operasional', accountType: 'liability_payable' },
    { code: '215000', name: 'Titipan Dana Zakat / Infaq', accountType: 'liability_current' },
    { code: '250000', name: 'Dana Abadi Riset Langit (Endowment)', accountType: 'liability_non_current' },
    { code: '300000', name: 'Modal Awal Yayasan', accountType: 'equity' },
    { code: '401000', name: 'Pendapatan Donasi & Hibah Riset', accountType: 'income' },
    { code: '402000', name: 'Pendapatan Lisensi Data & API Telemetri', accountType: 'income' },
    { code: '501000', name: 'Beban Riset & Observasi Hilal', accountType: 'expense' },
    { code: '502000', name: 'Beban Infrastruktur Server & Cloud', accountType: 'expense' },
    { code: '503000', name: 'Beban Perawatan Perangkat Optik & Sensor', accountType: 'expense' }
  ]

  const accIds: Record<string, number> = {}
  for (const a of accountSeeds) {
    const rows = await Account.fetch(Account, env, [['code', '=', a.code]])
    if (!rows.length) {
      const row = await Account.spawn(Account, env, {
        ...a,
        companyId: mainCompanyId
      })
      accIds[a.code] = row.id as number
    } else {
      accIds[a.code] = rows[0].id as number
      if (mainCompanyId && !rows[0].companyId) {
        await Account.morph(Account, env, rows[0].id as number, { companyId: mainCompanyId })
      }
    }
  }

  // ── Financial Journals ──
  const journalSeeds = jsonSeed?.journals || [
    { code: 'BNK1', name: 'Bank Syariah Utama', type: 'bank' },
    { code: 'CSH1', name: 'Kas Tunai Observatorium', type: 'cash' },
    { code: 'ZKT', name: 'Jurnal Khusus Zakat & Infaq', type: 'general' },
    { code: 'GEN', name: 'Jurnal Umum Operasional', type: 'general' },
    { code: 'AST', name: 'Jurnal Penyesuaian Aset & Optik', type: 'general' }
  ]

  const journalIds: Record<string, number> = {}
  for (const j of journalSeeds) {
    const rows = await Journal.fetch(Journal, env, [['code', '=', j.code]])
    if (!rows.length) {
      const row = await Journal.spawn(Journal, env, {
        ...j,
        companyId: mainCompanyId
      })
      journalIds[j.code] = row.id as number
    } else {
      journalIds[j.code] = rows[0].id as number
    }
  }

  console.log(`[moon-account] Demo data enriched: ${accountSeeds.length} accounts (chart of accounts), ${journalSeeds.length} financial journals seeded successfully`)
}
