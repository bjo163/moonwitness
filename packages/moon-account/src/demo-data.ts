import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

export async function loadDemoData() {
  const Account = getModel('account.account')
  const Journal = getModel('account.journal')

  if (!Account || !Journal) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  // ── Chart of Accounts ──
  const accountSeeds = [
    { code: '101000', name: 'Kas Utama / Petty Cash', accountType: 'asset_cash' },
    { code: '102000', name: 'Bank Syariah Operasional', accountType: 'asset_cash' },
    { code: '110000', name: 'Piutang Donasi / Penjualan', accountType: 'asset_receivable' },
    { code: '210000', name: 'Hutang Operasional', accountType: 'liability_payable' },
    { code: '215000', name: 'Titipan Dana Zakat / Infaq', accountType: 'liability_current' },
    { code: '300000', name: 'Modal Awal Yayasan', accountType: 'equity' },
    { code: '401000', name: 'Pendapatan Donasi & Hibah Riset', accountType: 'income' },
    { code: '501000', name: 'Beban Riset & Observasi Hilal', accountType: 'expense' },
    { code: '502000', name: 'Beban Infrastruktur Server & Cloud', accountType: 'expense' }
  ]

  for (const a of accountSeeds) {
    const rows = await Account.fetch(Account, env, [['code', '=', a.code]])
    if (!rows.length) {
      await Account.spawn(Account, env, a)
    }
  }

  // ── Financial Journals ──
  const journalSeeds = [
    { code: 'BNK1', name: 'Bank Syariah Utama', type: 'bank' },
    { code: 'CSH1', name: 'Kas Tunai Observatorium', type: 'cash' },
    { code: 'ZKT', name: 'Jurnal Khusus Zakat & Infaq', type: 'general' },
    { code: 'GEN', name: 'Jurnal Umum Operasional', type: 'general' }
  ]

  for (const j of journalSeeds) {
    const rows = await Journal.fetch(Journal, env, [['code', '=', j.code]])
    if (!rows.length) {
      await Journal.spawn(Journal, env, j)
    }
  }

  console.log('[moon-account] Demo data loaded: 9 accounts, 4 journals')
}
