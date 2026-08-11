import React from "react"
import { SunPositionView } from "@modules/astronomy/views/sun-position-view"

export function HomeAstronomySection() {
  return (
    <section id="astronomy" className="relative w-full">
      <SunPositionView />
    </section>
  )
}
