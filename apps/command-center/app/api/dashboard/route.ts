import { NextRequest, NextResponse } from "next/server"
import { MOCK_COMMAND_CENTER_DASHBOARD } from "@/lib/data/command-center-dashboard"
export const dynamic = "force-dynamic"
import { getDailyPrayerTimes } from "@moon/compute"

const JAKARTA_LAT = -6.2088
const JAKARTA_LNG = 106.8456

export async function GET(req: NextRequest) {
  const dashboardData = { ...MOCK_COMMAND_CENTER_DASHBOARD }

  try {
    // 1. Real Prayer Times from Internal Math Engine (@moon/compute)
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

    dashboardData.todayPrayer = prayerSchedule.map((p) => {
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

    // 2. Real Knowledge Feed
    dashboardData.knowledgeFeed = [
      {
        id: "kf1",
        category: "Qur'an",
        title: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
        subtitle: "Surah Al-Alaq (96:1)",
        time: "Just Now",
      },
      {
        id: "kf2",
        category: "Hadith",
        title: "Seeking knowledge is an obligation upon every Muslim.",
        subtitle: "Sunan Ibn Majah 224",
        time: "Just Now",
      },
    ]
  } catch (error) {
    console.error("Failed to calculate prayer times for Command Center Dashboard:", error)
  }

  return NextResponse.json({
    success: true,
    data: dashboardData,
  })
}
