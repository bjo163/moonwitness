import { HomeCelestialFeedWidget } from "./home-celestial-feed-widget"
import { HomeGlobalCoordinatesWidget } from "./home-global-coordinates-widget"
import { HomeHeroTitleWidget } from "./home-hero-title-widget"
import { HomePlanetaryTelemetryWidget } from "./home-planetary-telemetry-widget"
import { HomeTelemetrySidebarWidget } from "./home-telemetry-sidebar-widget"
import { RandomWarpGenerator } from "./random-warp-generator"
import type { DailyTransmissionData } from "./hero/home-hero-constants"

export function HomeHeroContent({
  dailyData,
  onDecodeTransmission,
}: {
  dailyData: DailyTransmissionData | null
  onDecodeTransmission: () => void
}) {
  return (
    <>
      <main className="relative z-20 mx-auto my-8 flex w-full max-w-7xl flex-1 flex-col justify-center px-6 sm:my-16 sm:px-10">
        <div className="mb-4">
          <h2 className="font-mono text-[10px] font-black tracking-[0.3em] text-primary/50 uppercase">
            [ SECTION 01 : HERO COMMAND ]
          </h2>
        </div>
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <HomeHeroTitleWidget
              dailyData={dailyData ?? undefined}
              onDecodeTransmission={onDecodeTransmission}
            />
            <div className="flex justify-start">
              <RandomWarpGenerator />
            </div>
          </div>
          <div className="hidden flex-col items-end justify-center lg:col-span-4 lg:flex">
            <HomeTelemetrySidebarWidget />
          </div>
        </div>
      </main>
      <footer className="relative z-20 mx-auto mt-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 pb-10 sm:px-10 lg:grid-cols-12">
        <HomePlanetaryTelemetryWidget />
        <div className="flex h-full flex-col gap-5 lg:col-span-5">
          <HomeCelestialFeedWidget />
        </div>
        <HomeGlobalCoordinatesWidget />
      </footer>
    </>
  )
}
