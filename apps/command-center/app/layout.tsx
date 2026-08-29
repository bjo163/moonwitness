import { JetBrains_Mono, Geist } from "next/font/google"
import "@workspace/ui/globals.css"
import { MoonProvider } from "@workspace/state"
import { CommandCenterShell } from "@/components/shell"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "MoonWitness — Command Center",
  description: "Governance and Administrative Operations Console",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

// The command center depends on operator session state and client-only runtime data.
// Keep the protected terminal out of build-time static page generation.
export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jetBrainsMono.variable} font-sans antialiased`}
      suppressHydrationWarning
    >
      <body
        className="bg-background font-sans text-foreground antialiased selection:bg-primary/30 selection:text-foreground"
        suppressHydrationWarning
      >
        <MoonProvider>
          <CommandCenterShell>{children}</CommandCenterShell>
        </MoonProvider>
      </body>
    </html>
  )
}
