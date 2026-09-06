import { PROPHETIC_EVENTS_PART1 } from "./prophetic-events/part-1"
import { PROPHETIC_EVENTS_PART2 } from "./prophetic-events/part-2"
import { PROPHETIC_EVENTS_PART3 } from "./prophetic-events/part-3"
import { PROPHETIC_EVENTS_PART4 } from "./prophetic-events/part-4"
export type { PropheticEvent } from "./prophetic-events/types"

export const PROPHETIC_EVENTS = [
  ...PROPHETIC_EVENTS_PART1,
  ...PROPHETIC_EVENTS_PART2,
  ...PROPHETIC_EVENTS_PART3,
  ...PROPHETIC_EVENTS_PART4,
]
