import { Clock, Download, MonitorPlay, Shield, Users } from "lucide-react"
import {
  Button,
  MetricCard,
  PropertyList,
  PropertyRow,
  SkeletonCard,
} from "@workspace/ui"

export function UserSummaryWidgets({
  activeUsers,
  averageLevel,
  totalUsers,
  twoFactorUsers,
  usersLoading,
}: {
  activeUsers: number
  averageLevel: number
  totalUsers: number
  twoFactorUsers: number
  usersLoading: boolean
}) {
  if (usersLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard title="Total Users" value={String(totalUsers)} detail={totalUsers > 0 ? `${activeUsers} active` : "No data"} icon={<Users className="h-4 w-4" />} />
      <MetricCard title="Active Users" value={String(activeUsers)} detail={totalUsers > 0 ? `${Math.round((activeUsers / totalUsers) * 100)}% of total` : "No data"} icon={<MonitorPlay className="h-4 w-4" />} variant="success" />
      <MetricCard title="2FA Enabled" value={String(twoFactorUsers)} detail={totalUsers > 0 ? `${Math.round((twoFactorUsers / totalUsers) * 100)}% of total` : "No data"} icon={<Shield className="h-4 w-4" />} />
      <MetricCard title="Avg Level" value={String(averageLevel)} detail="Average user level" icon={<Clock className="h-4 w-4" />} variant="warning" />
    </div>
  )
}

export function UserStatusWidget({ activeUsers, totalUsers, twoFactorUsers }: { activeUsers: number; totalUsers: number; twoFactorUsers: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-4 shadow-xs">
      <h3 className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold uppercase tracking-wider text-primary">
        <MonitorPlay className="h-4 w-4" /> User Status
      </h3>
      <PropertyList>
        <PropertyRow label="Total" value={<span className="font-semibold text-foreground">{totalUsers}</span>} />
        <PropertyRow label="Active" value={<span className="font-semibold text-success">{activeUsers}</span>} />
        <PropertyRow label="2FA Enabled" value={<span className="font-semibold text-primary">{twoFactorUsers}</span>} />
      </PropertyList>
    </div>
  )
}

export function UserExportAction() {
  return (
    <Button type="button" variant="secondary" size="sm" className="text-[10px] font-semibold uppercase tracking-wider">
      <Download className="h-3.5 w-3.5" /> Export
    </Button>
  )
}
