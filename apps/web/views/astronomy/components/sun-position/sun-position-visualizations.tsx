"use client"

import { SunPositionVisualizationPanels } from "./sun-position-visualization-renderers"

export function SunPositionVisualizations() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
      <SunPositionVisualizationPanels />
    </div>
  )
}
