import { Geist } from "next/font/google"
import "@workspace/ui/globals.css"
import { MoonProvider } from "@workspace/state"
import { CommandCenterShell } from "@/components/shell"

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
      className={`${geist.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-slate-50 font-sans text-slate-900 antialiased"
        suppressHydrationWarning
      >
        <MoonProvider>
          <CommandCenterShell>{children}</CommandCenterShell>
        </MoonProvider>
      </body>
    </html>
  )
}
