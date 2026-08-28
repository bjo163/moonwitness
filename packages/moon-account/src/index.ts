import AccountAccount from './account-account.ts'
import AccountJournal from './account-journal.ts'
import AccountMove from './account-move.ts'
import AccountMoveLine from './account-move-line.ts'

export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
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
