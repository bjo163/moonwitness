import Link from "next/link"

const links = [
  ["/auth/profile", "Profile"],
  ["/auth/account", "Account"],
  ["/auth/settings", "Settings"],
  ["/auth/preferences", "Preferences"],
  ["/auth/notifications", "Notifications"],
] as const

export function AccountNavigation({ active }: { active: string }) {
  return (
    <nav aria-label="Account navigation" className="flex flex-wrap gap-2">
      {links.map(([href, label]) => (
        <Link key={href} href={href} aria-current={active === label ? "page" : undefined} className={`clip-btn border px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyber-cyan ${active === label ? "border-cyber-cyan bg-cyber-cyan text-cyber-dark" : "border-cyber-cyan/25 text-cyber-cyan hover:bg-cyber-cyan/10"}`}>
          {label}
        </Link>
      ))}
    </nav>
  )
}
