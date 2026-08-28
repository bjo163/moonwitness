import MzCase from './models/mz-case.ts'
import MzAssessment from './models/mz-assessment.ts'
import MzFilter from './models/mz-filter.ts'
import MzReference from './models/mz-reference.ts'

import { chooseMethod, PRIMARY_FILTERS, SECONDARY_FILTERS, validateAssessment } from './engine.ts'
export { registerMizanRoutes } from './routes.ts'
export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'

export { chooseMethod, PRIMARY_FILTERS, SECONDARY_FILTERS, validateAssessment }
export type { AssessmentDecision, AssessmentInput, AssessmentMethod, MethodDecision, MethodInput } from './engine.ts'
export { MzCase, MzAssessment, MzFilter, MzReference }

export default {
  name: 'mizan',
  description: 'Internal weighted assessment and learning library',
  depends: ['base', 'witness'],
  models: [MzCase, MzAssessment, MzFilter, MzReference]
}
