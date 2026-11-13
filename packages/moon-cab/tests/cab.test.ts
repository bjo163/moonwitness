import { describe, expect, it } from 'vitest'
import CabChange from '../src/models/cab-change.js'
import CabDecision from '../src/models/cab-decision.js'
import CabMeeting from '../src/models/cab-meeting.js'
describe('@moon/cab addon', () => {
  it('defines its governance models', () => {
    expect([CabChange._name, CabMeeting._name, CabDecision._name]).toEqual(['cab.change', 'cab.meeting', 'cab.decision'])
  })
})
