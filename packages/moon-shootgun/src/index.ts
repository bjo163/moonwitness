import SgOperation from './models/sg-operation.js'

export { SgOperation }

export default {
  name: 'shootgun',
  description: 'Operation records with cross-scripture references',
  depends: ['base', 'witness'],
  models: [SgOperation]
}