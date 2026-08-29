"use client"

import { useState } from "react"
import { Globe, Send } from "lucide-react"

type PrayerSignal = {
  id: string
  name: string
  location: string
  message: string
  timeAgo: string
}

const INITIAL_PRAYERS: PrayerSignal[] = [
  {
    id: "p1",
    name: "Hamba Allah",
    location: "Jakarta, Indonesia",
    message:
      "Semoga kedamaian dan rahmat Allah menaungi seluruh bangsa di bumi.",
    timeAgo: "2m ago",
  },
  {
    id: "p2",
    name: "Ahmad",
    location: "Kairo, Mesir",
    message:
      "Ya Allah persatukanlah hati umat manusia dalam keadilan dan kebenaran.",
    timeAgo: "5m ago",
  },
  {
    id: "p3",
    name: "Sophia",
    location: "London, UK",
    message: "May universal peace and divine compassion bless all souls.",
    timeAgo: "12m ago",
  },
]

const INITIAL_LIGHT_COUNT = 89420

export function GlobalPrayerWallWidget() {
  const [prayers, setPrayers] = useState<PrayerSignal[]>(INITIAL_PRAYERS)
  const [inputMsg, setInputMsg] = useState("")
  const [lightCount, setLightCount] = useState(INITIAL_LIGHT_COUNT)

  function handleSendPrayer() {
    if (!inputMsg.trim()) return
    const newP: PrayerSignal = {
      id: String(Date.now()),
      name: "Jamaah MoonWitness",
      location: "Indonesia",
      message: inputMsg,
      timeAgo: "Just now",
    }
    setPrayers([newP, ...prayers])
    setInputMsg("")
    setLightCount((prev) => prev + 1)
  }

  return (
    <div className="panel-box border-success/40 bg-space/95 space-y-4 border p-6 font-mono shadow-[0_0_30px_rgba(0,255,102,0.15)]">
      <div className="border-success/20 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-2">
          <Globe className="text-success h-4 w-4 animate-pulse" />
          <span className="font-display text-success text-xs font-black tracking-widest uppercase">
            // DINDING DOA KEDAMAIAN & TELEMETRI CAHAYA GLOBAL
          </span>
        </div>
        <span className="clip-tag border border-cyber-green/40 bg-cyber-green/10 text-cyber-green px-2 py-0.5 font-mono text-[9px] font-bold">
          ⚡ {lightCount.toLocaleString("en-US")} SINYAL DOA AKTIF
        </span>
      </div>

      {/* Input Send Prayer */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Kirimkan doa kedamaian & persaudaraan kemanusiaan..."
          className="bg-card/90 border-border/40 tag-clip w-full border p-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-cyber-green focus:outline-none"
        />
        <button
          onClick={handleSendPrayer}
          className="btn-primary flex shrink-0 items-center gap-1.5 px-4 py-2.5 text-xs font-bold btn-clip"
          style={{
            color: "#00FF66",
            borderColor: "rgba(0,255,102,0.5)",
            background: "rgba(0,255,102,0.1)",
          }}
        >
          <Send className="h-3.5 w-3.5" />
          <span>KIRIM</span>
        </button>
      </div>

      {/* Prayer Feed Cards */}
      <div className="theme-scrollbar max-h-56 space-y-2.5 overflow-y-auto pr-1">
        {prayers.map((p) => (
          <div
            key={p.id}
            className="bg-space border-success/20 tag-clip space-y-1 border p-3 text-xs"
          >
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-success font-bold">
                ◈ {p.name} • {p.location}
              </span>
              <span className="text-primary">{p.timeAgo}</span>
            </div>
            <p className="leading-relaxed text-foreground">
              &ldquo;{p.message}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
