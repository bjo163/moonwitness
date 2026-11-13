import { UserIdentity } from "@workspace/ui"
import type { CrudColumn } from "@workspace/ui"

export function createUserColumns(): CrudColumn[] {
  return [
    {
      name: "name",
      label: "User",
      type: "text",
      required: true,
      render: (val, row) => {
        const displayName = row.nickname || row.login || "Unavailable"
        return (
          <UserIdentity
            name={displayName}
            subtitle={row.login || row.email || "Unavailable"}
            avatarUrl={row.avatarUrl || row.avatar}
            fallbackText={displayName.charAt(0).toUpperCase()}
            size="default"
          />
        )
      },
    },
    {
      name: "login",
      label: "Login",
      type: "text",
      required: true,
      hideInTable: true,
    },
    {
      name: "level",
      label: "Level",
      type: "number",
      render: (_, row) => <span className="text-xs text-muted-foreground">{row.level ?? "Unavailable"}</span>,
    },
    {
      name: "twoFactorEnabled",
      label: "2FA",
      hideInForm: true,
      render: (_, row) => {
        const enabled = row.two_factor_enabled || row.twoFactorEnabled
        return (
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${enabled ? "bg-success" : "bg-muted-foreground"} shadow-sm`} />
            <span className={`text-xs ${enabled ? "text-success" : "text-muted-foreground"}`}>
              {enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        )
      },
    },
    {
      name: "lastLogin",
      label: "Last Login",
      hideInForm: true,
      render: (_, row) => {
        const lastLogin = row.last_login || row.lastLogin
        if (!lastLogin) return <span className="text-xs text-muted-foreground">Never</span>
        return <span className="text-xs font-mono text-muted-foreground">{new Date(lastLogin).toLocaleString()}</span>
      },
    },
    {
      name: "groupsId",
      label: "Roles",
      hideInForm: true,
      render: (_, row) => {
        const groups = row.groupsId || row.groups_id
        if (!groups || !Array.isArray(groups) || groups.length === 0) {
          return <span className="text-xs text-muted-foreground">No roles assigned</span>
        }
        const roleNames = groups
          .map((group: any) => group.name || group)
          .filter(Boolean)
          .map((role: string | number) => String(role))
        return (
          <div className="flex flex-wrap gap-1">
            {roleNames.slice(0, 3).map((role: string, index: number) => (
              <span key={index} className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-foreground">
                {role}
              </span>
            ))}
            {roleNames.length > 3 && <span className="text-[10px] font-mono text-muted-foreground">+{roleNames.length - 3}</span>}
          </div>
        )
      },
    },
  ]
}
