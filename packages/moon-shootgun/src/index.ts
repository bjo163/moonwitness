import SgOperation from './models/sg-operation.ts'

export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
export { SgOperation }

export default {
  name: 'shootgun',
  description: 'Operation records with cross-scripture references',
  depends: ['base', 'witness'],
  models: [SgOperation]
}
