"use client"

import { useEffect, useState } from "react"
import { useToast } from "@core/contexts"

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
]

export function useKonami() {
  const [sequence, setSequence] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key

      setSequence((prev) => {
        const newSequence = [...prev, key]
        if (newSequence.length > KONAMI_CODE.length) {
          newSequence.shift()
        }

        if (newSequence.join(",") === KONAMI_CODE.join(",")) {
          // Trigger Easter Egg
          toast({
            variant: "success",
            title: "SECRET OVERRIDE",
            description: "Admin clearance granted. Welcome, Operator.",
          })
          
          // Confetti effect or CSS Matrix glow
          document.body.classList.add("theme-matrix")
          setTimeout(() => {
            document.body.classList.remove("theme-matrix")
          }, 5000)
          
          return []
        }

        return newSequence
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toast])
}
