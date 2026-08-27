"use client"

import { useEffect, useState } from "react"

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

export function useKonami(onTrigger?: () => void) {
  const [sequence, setSequence] = useState<string[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key

      setSequence((prev) => {
        const newSequence = [...prev, key]
        if (newSequence.length > KONAMI_CODE.length) {
          newSequence.shift()
        }

        if (newSequence.join(",") === KONAMI_CODE.join(",")) {
          if (onTrigger) {
            onTrigger()
          } else {
            document.body.classList.add("theme-matrix")
            setTimeout(() => {
              document.body.classList.remove("theme-matrix")
            }, 5000)
          }
          return []
        }

        return newSequence
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onTrigger])
}
