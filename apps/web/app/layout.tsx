import { Suspense } from "react"
import { Orbitron, JetBrains_Mono, Geist, Amiri } from "next/font/google"

import "@workspace/ui/globals.css"
import { Taskbar, PwaRegister, Cosmic3DBackground } from "@core/shell"
import { LanguageProvider, AudioProvider, ToastProvider } from "@core/contexts"
import {
  FlyingPropheticAIWidget,
  OnboardingWizard,
  GlobalTickerWidget,
} from "@core/widgets"
import { TacticalToastContainer } from "@core/ui"
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
      <body className="bg-space relative min-h-screen pb-[44px]">
        <Cosmic3DBackground />

        {/* Accessible Skip Navigation */}
        <a
          href="#main-content"
          className="text-space sr-only z-[999999] bg-primary px-4 py-2 font-black tracking-widest uppercase focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <LanguageProvider>
          <ToastProvider>
            <AudioProvider>
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
            </AudioProvider>
          </ToastProvider>
        </LanguageProvider>
        <TacticalToastContainer />
      </body>
    </html>
  )
}
