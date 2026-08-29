import { Orbitron, JetBrains_Mono, Geist } from "next/font/google"
import "@workspace/ui/globals.css"
import { MoonProvider } from "@workspace/state"
import { CommandCenterShell } from "@/components/shell"

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata = {
  title: "MoonWitness OS — Command Center",
  description: "Governance and Administrative Operations Console",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${jetBrainsMono.variable} ${geist.variable} font-sans antialiased`}
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