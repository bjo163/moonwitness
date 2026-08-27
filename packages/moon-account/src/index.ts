import AccountAccount from './account-account.js'
import AccountJournal from './account-journal.js'
import AccountMove from './account-move.js'
import AccountMoveLine from './account-move-line.js'

export { loadDemoData } from './demo-data.js'
export { views } from './views.js'
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
