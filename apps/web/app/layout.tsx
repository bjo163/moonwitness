import { Suspense } from "react"
import { JetBrains_Mono, Geist, Amiri } from "next/font/google"

import "@workspace/ui/globals.css"
import { Navbar, Taskbar, PwaRegister } from "../components/shell"
import { MoonProvider } from "@workspace/state"
import {
  FlyingPropheticAIWidget,
  OnboardingWizard,
  GlobalTickerWidget,
  CommandPalette,
  AudioToggle,
} from "@workspace/ui"
import { cn } from "@workspace/ui/lib/utils"

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
  width: "device-width",
  initialScale: 1,
}

export const metadata = {
  title: "MoonWitness — Knowledge Platform",
  description:
    "MoonWitness is a source-aware platform for exploring scripture, traditions, references, and research with transparent provenance.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        jetBrainsMono.variable,
        "font-sans",
        geist.variable,
        amiri.variable
      )}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-background pb-[44px] font-sans text-foreground">
        {/* Accessible Skip Navigation */}
        <a
          href="#main-content"
          className="sr-only z-[999999] bg-primary px-4 py-2 font-semibold text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
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
        <div className="fixed right-4 bottom-14 z-40 hidden sm:block">
          <AudioToggle />
        </div>
      </body>
    </html>
  )
}
