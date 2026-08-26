import { Suspense } from "react"
import { Orbitron, JetBrains_Mono, Geist } from "next/font/google"
import "@workspace/ui/globals.css"
import { Sidebar, Topbar, CommandPalette } from "@workspace/ui"

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
    >
      <body className="bg-[#030508] font-sans text-white antialiased selection:bg-cyber-purple/30 selection:text-white">
        <div className="flex min-h-screen">
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
          <div className="flex flex-1 flex-col pl-64">
            <Suspense fallback={null}>
              <Topbar />
            </Suspense>
            <main className="flex-1 overflow-x-hidden p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
        <CommandPalette />
      </body>
    </html>
  )
}