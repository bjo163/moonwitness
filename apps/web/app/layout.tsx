import { Suspense } from "react"
import { Orbitron, JetBrains_Mono, Geist, Amiri } from "next/font/google"

import "@workspace/ui/globals.css"
import { Navbar, Taskbar, PwaRegister, Cosmic3DBackground } from "../components/shell"
import { MoonProvider } from "@workspace/state"
import {
  FlyingPropheticAIWidget,
  OnboardingWizard,
  GlobalTickerWidget,
  CommandPalette,
  CosmicAudioToggle,
} from "@workspace/ui"
import { cn } from "@workspace/ui/lib/utils"

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
})

export const viewport = {
  themeColor: "#05070A",
  width: "device-width",
  initialScale: 1,
}

export const metadata = {
  title: "MoonWitness — When the Moon Witness, We Share messages.",
  description:
    "MoonWitness: When the Moon Witness, We Share messages. Global Platform for Tauhid & Divine Scriptures (Al-Qur'an 114 Surah, Tajwid Warna, & Audio).",
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
        "dark antialiased",
        orbitron.variable,
        jetBrainsMono.variable,
        "font-sans",
        geist.variable,
        amiri.variable
      )}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#05070A" />
      </head>
      <body className="min-h-screen bg-cyber-dark pb-[44px] font-sans text-foreground">
        <Cosmic3DBackground />

        {/* Accessible Skip Navigation */}
        <a
          href="#main-content"
          className="text-primary-foreground sr-only z-[999999] bg-primary px-4 py-2 font-semibold focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
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
            <FlyingPropheticAIWidget />
          </Suspense>
          <Suspense fallback={null}>
            <OnboardingWizard />
          </Suspense>
          <PwaRegister />
        </MoonProvider>
        <CommandPalette />
        <div className="fixed bottom-14 right-4 z-40 hidden sm:block">
          <CosmicAudioToggle />
        </div>
      </body>
    </html>
  )
}
