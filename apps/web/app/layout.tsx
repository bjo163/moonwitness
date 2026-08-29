import { Suspense } from "react"
import { JetBrains_Mono, Geist, Amiri } from "next/font/google"

import "@workspace/ui/globals.css"
import { Navbar, Taskbar, PwaRegister } from "../components/shell"
import { MoonProvider } from "@workspace/state"
import {
  OnboardingWizard,
  GlobalTickerWidget,
  CommandPalette,
} from "@workspace/ui"
import { cn } from "@workspace/ui/lib/utils"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
})

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata = {
  title: "MoonWitness — Unified Sacred Knowledge & Celestial Observatory",
  description:
    "MoonWitness: Global Platform for Tauhid, Divine Scriptures (Al-Qur'an 114 Surah, Tajwid, Audio), and Celestial Calculations.",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        geist.variable,
        jetBrainsMono.variable,
        amiri.variable,
        "font-sans"
      )}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-background text-foreground relative min-h-screen pb-[44px]">
        {/* Accessible Skip Navigation */}
        <a
          href="#main-content"
          className="sr-only z-[999999] rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 shadow-md"
        >
          Skip to content
        </a>
        <MoonProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <Suspense fallback={null}>
            <GlobalTickerWidget />
          </Suspense>
          <main id="main-content" className="h-full w-full flex-1">
            {children}
          </main>
          <Suspense fallback={null}>
            <Taskbar />
          </Suspense>
          <Suspense fallback={null}>
            <OnboardingWizard />
          </Suspense>
          <PwaRegister />
        </MoonProvider>
        <CommandPalette />
      </body>
    </html>
  )
}
