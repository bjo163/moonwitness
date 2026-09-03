import AccountAccount from './account-account.js'
import AccountJournal from './account-journal.js'
import AccountMove from './account-move.js'
import AccountMoveLine from './account-move-line.js'

export { loadDemoData } from './demo-data.js'
export { views } from './views.js'
export { ExactLedger, normalizeLedgerDraft } from './exact-ledger.js'
export { createPostgresLedgerStore } from './exact-ledger-postgres.js'
export type {
  LedgerScope, LedgerLine, LedgerDraft, PostedEntry, LedgerTransaction,
  LedgerStore, LedgerAuthorization,
} from './exact-ledger.js'
export {
  AccountAccount,
  AccountJournal,
  AccountMove,
  AccountMoveLine
}

export default {
  name: 'account',
  description: 'Double-entry accounting and financial ledger',
  depends: ['base'],
  models: [
    AccountAccount,
    AccountJournal,
    AccountMove,
    AccountMoveLine
  ]
}
