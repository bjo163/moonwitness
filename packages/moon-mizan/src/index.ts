import MzCase from './models/mz-case.js'
import MzAssessment from './models/mz-assessment.js'
import MzFilter from './models/mz-filter.js'
import MzReference from './models/mz-reference.js'

import { chooseMethod, PRIMARY_FILTERS, SECONDARY_FILTERS, validateAssessment } from './engine.js'
export { registerMizanRoutes } from './routes.js'
export { loadDemoData } from './demo-data.js'
export { views } from './views.js'

export { chooseMethod, PRIMARY_FILTERS, SECONDARY_FILTERS, validateAssessment }
export type { AssessmentDecision, AssessmentInput, AssessmentMethod, MethodDecision, MethodInput } from './engine.js'
export { MzCase, MzAssessment, MzFilter, MzReference }

export default {
  name: 'mizan',
  description: 'Internal weighted assessment and learning library',
  depends: ['base', 'witness'],
  models: [MzCase, MzAssessment, MzFilter, MzReference]
}
