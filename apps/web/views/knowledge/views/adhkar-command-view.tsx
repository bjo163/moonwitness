"use client"

import { useEffect, useState } from "react"
import { useToast, useAchievementStore } from "@workspace/state"
import {
  AdhkarCommandPresentation,
  type Adhkar,
} from "./adhkar-command-presentation"

export function AdhkarCommandView() {
  const [data, setData] = useState<Adhkar[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("Pagi/Petang")
  const { toast, success } = useToast()
  const unlockAchievement = useAchievementStore(
    (state) => state.unlockAchievement
  )

  const [activeDzikir, setActiveDzikir] = useState<Adhkar | null>(null)
  const [count, setCount] = useState(0)
  const targetCount = 33

  useEffect(() => {
    fetchAdhkar(activeCategory)
  }, [activeCategory])

  const fetchAdhkar = async (category: string) => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/adhkar?timing=${category === "Semua" ? "" : category}`
      )
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      } else {
        toast({ variant: "error", title: "API Fault", description: json.error })
      }
    } catch {
      toast({
        variant: "error",
        title: "Network Fault",
        description: "Failed to load adhkar",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTap = () => {
    if (count < targetCount) {
      setCount((current) => current + 1)
      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        window.navigator.vibrate(50)
      }
      if (count + 1 === targetCount) {
        success("DZIKIR COMPLETE", "Target reached. May Allah accept it.")
        unlockAchievement("dzikir_master", toast)
      }
    }
  }

  return (
    <AdhkarCommandPresentation
      data={data}
      loading={loading}
      activeCategory={activeCategory}
      activeDzikir={activeDzikir}
      count={count}
      targetCount={targetCount}
      onCategoryChange={setActiveCategory}
      onCloseDzikir={() => {
        setActiveDzikir(null)
        setCount(0)
      }}
      onTap={handleTap}
      onStartDzikir={setActiveDzikir}
    />
  )
}
