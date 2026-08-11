import MzCase from './models/mz-case.js'
import MzAssessment from './models/mz-assessment.js'
import MzFilter from './models/mz-filter.js'
import MzReference from './models/mz-reference.js'

import { chooseMethod, PRIMARY_FILTERS } from './engine.js'

export { chooseMethod, PRIMARY_FILTERS }
export type { AssessmentMethod, MethodDecision, MethodInput } from './engine.js'
export { MzCase, MzAssessment, MzFilter, MzReference }

export default {
  name: 'mizan',
  description: 'Internal weighted assessment and learning library',
  depends: ['base', 'witness'],
  models: [MzCase, MzAssessment, MzFilter, MzReference]
}
