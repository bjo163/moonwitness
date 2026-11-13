"use client"

import {
  CellularPhotonAbsorption,
  ElectromagneticSpectrum,
  QiblaSolarAlignment,
} from "./sun-position-advanced-renderers"

export function SunPositionAdvanced() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
      <QiblaSolarAlignment />
      <ElectromagneticSpectrum />
      <CellularPhotonAbsorption />
    </div>
  )
}
