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
        <Link
          key={href}
          href={href}
          aria-current={active === label ? "page" : undefined}
          className={`rounded-md border px-3.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
            active === label
              ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm"
              : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
