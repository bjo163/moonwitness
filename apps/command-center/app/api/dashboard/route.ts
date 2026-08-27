import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { getDailyPrayerTimes } from "@moon/compute"

const JAKARTA_LAT = -6.2088
const JAKARTA_LNG = 106.8456

type PrayerItem = { name: string; time: string; status: string; countdown?: string }

export type DashboardResponse = {
  success: boolean
  data: {
    missionStatus: Record<string, any> | null
    todayMission: any[] | null
    todayPrayer: PrayerItem[] | null
    aiBriefing: any[] | null
    knowledgeFeed: any[] | null
    activeProjects: any[] | null
    tasksOverview: any | null
    moonObservatory: Record<string, any> | null
    globalMonitoring: any[] | null
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<DashboardResponse>> {
  const data: DashboardResponse["data"] = {
    missionStatus: null,
    todayMission: null,
    todayPrayer: null,
    aiBriefing: null,
    knowledgeFeed: null,
    activeProjects: null,
    tasksOverview: null,
    moonObservatory: null,
    globalMonitoring: null,
  }

  try {
    const now = new Date()
    const todayPrayers = getDailyPrayerTimes(JAKARTA_LAT, JAKARTA_LNG, now)

    const formatTime = (d: Date) =>
      `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`

    const currentMins = now.getHours() * 60 + now.getMinutes()
    const getMins = (d: Date) => d.getHours() * 60 + d.getMinutes()

    const prayerSchedule = [
      { name: "Fajr", timeObj: todayPrayers.fajr },
      { name: "Dhuhr", timeObj: todayPrayers.dhuhr },
      { name: "Asr", timeObj: todayPrayers.asr },
      { name: "Maghrib", timeObj: todayPrayers.maghrib },
      { name: "Isha", timeObj: todayPrayers.isha },
    ]

    data.todayPrayer = prayerSchedule.map((p) => {
      const pmins = getMins(p.timeObj)
      let status = "pending"
      if (currentMins >= pmins) status = "done"
      if (
        status === "pending" &&
        prayerSchedule.find((x) => getMins(x.timeObj) > currentMins)?.name ===
          p.name
      ) {
        status = "next"
      }
      return {
        name: p.name,
        time: formatTime(p.timeObj),
        status,
        countdown: status === "next" ? "LIVE" : undefined,
      }
    })
  } catch (error) {
    console.error("Failed to calculate prayer times for Command Center Dashboard:", error)
  }

  return NextResponse.json({
    success: true,
    data,
  })
}
