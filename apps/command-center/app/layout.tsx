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
  description: "Tactical Governance and Administrative Operations Terminal",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${jetBrainsMono.variable} ${geist.variable} dark`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#030508] font-sans text-white antialiased selection:bg-cyber-purple/30 selection:text-white"
        suppressHydrationWarning
      >
        <MoonProvider>
          <CommandCenterShell>{children}</CommandCenterShell>
        </MoonProvider>
      </body>
    </html>
  )
}