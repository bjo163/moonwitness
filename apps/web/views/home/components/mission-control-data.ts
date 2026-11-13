export const MISSION_PILLARS = [
  { label: "Observe the Universe", sub: "See the Signs", color: "#00F0FF" },
  { label: "Understand the Truth", sub: "Reveal the Meaning", color: "#10B981" },
  { label: "Reflect with Wisdom", sub: "Transform into Light", color: "#FBBF24" },
] as const

export const KNOWLEDGE_NODES = {
  left: [
    { label: "QUR'AN", value: "• 6,236 Ayat", color: "#00F0FF" },
    { label: "HADITH", value: "• 75,000+", color: "#A0B0C0" },
    { label: "HISTORY", value: "• Timelines", color: "#FBBF24" },
    { label: "ASTRONOMY", value: "• Celestial", color: "#10B981" },
  ],
  right: [
    { label: "HUMANITY", value: "One Family •", color: "#10B981" },
    { label: "CREATION", value: "Signs •", color: "#00F0FF" },
    { label: "WISDOM", value: "Reflection •", color: "#FBBF24" },
    { label: "FUTURE", value: "Guidance •", color: "#3B82F6" },
  ],
} as const

export const DIAGNOSTIC_CARDS = [
  { title: "SYSTEM ONLINE", value: "100%", sub: "OPERATIONAL", color: "#10B981" },
  { title: "KNOWLEDGE CORE", value: "2.7K+", sub: "DATA POINTS", color: "#A855F7" },
  { title: "GLOBAL USERS", value: "4.8K+", sub: "ACTIVE NOW", color: "#00F0FF" },
] as const

export const ACTIVITY_LOGS = [
  { title: "New Observation", time: "2m ago", color: "#00F0FF" },
  { title: "Lunar Transit", time: "14m ago", color: "#10B981" },
  { title: "New Knowledge", time: "23m ago", color: "#A855F7" },
  { title: "Scripture Update", time: "35m ago", color: "#FBBF24" },
  { title: "Historical Event", time: "1h ago", color: "#FF3355" },
] as const
