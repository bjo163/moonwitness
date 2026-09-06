import { MoreHorizontal, User } from "lucide-react"
import { resolveSemanticColor } from "@workspace/ui"
import type { TaskCenterTableRowData } from "./task-center-table-data"

export function TaskCenterTableRow({ row }: { row: TaskCenterTableRowData }) {
  return (
    <div className="group grid cursor-pointer grid-cols-12 items-center gap-2 rounded border border-transparent p-2 text-[9px] transition-colors hover:border-border hover:bg-muted/30">
      <div className="col-span-4 flex items-center gap-2">
        <div className="h-3.5 w-3.5 shrink-0 rounded-sm border border-border" />
        <div>
          <div className="truncate font-bold text-foreground transition-colors group-hover:text-primary">
            {row.t}
          </div>
          <div className="mt-0.5 inline-block rounded border border-border bg-primary px-1.5 py-[1px] text-[6px] text-primary">
            {row.tag}
          </div>
        </div>
      </div>
      <div className="col-span-2 truncate text-primary">{row.proj}</div>
      <div className="col-span-2 flex items-center gap-1.5 truncate text-primary">
        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-2.5 w-2.5 text-primary" />
        </div>
        {row.asg}
      </div>
      <div className="col-span-1 flex justify-center">
        <span
          className="text-[8px] font-bold"
          style={{ color: resolveSemanticColor(row.prioC) }}
        >
          {row.prio}
        </span>
      </div>
      <div className="col-span-1 flex justify-center">
        <span
          className="rounded border px-1.5 py-0.5 text-[8px] whitespace-nowrap"
          style={{
            borderColor: resolveSemanticColor(row.statC),
            color: resolveSemanticColor(row.statC),
          }}
        >
          {row.stat}
        </span>
      </div>
      <div className="col-span-1 text-center font-mono text-primary">
        {row.date}
      </div>
      <div className="col-span-1 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full"
            style={{
              width: `${row.prog}%`,
              backgroundColor: resolveSemanticColor(row.statC),
            }}
          />
        </div>
        <span className="w-5 text-right font-mono text-primary">
          {row.prog}%
        </span>
        <MoreHorizontal className="h-3.5 w-3.5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  )
}
