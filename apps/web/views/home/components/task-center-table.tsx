"use client"

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui"
import { TASK_CENTER_TABLE_ROWS } from "./task-center-table-data"
import { TaskCenterTableRow } from "./task-center-table-row"

export function TaskCenterTable() {
  return (
    <div className="flex flex-1 flex-col rounded-xl border border-border bg-background p-4">
      <div className="mb-4 flex gap-4 border-b border-border px-2 text-[9px] font-bold tracking-widest text-primary uppercase">
        {[
          "All Tasks",
          "High Priority",
          "Due Today",
          "This Week",
          "Overdue",
        ].map((label, index) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="sm"
            className={
              index === 0
                ? "border-b-2 border-primary py-2 text-primary"
                : "py-2 transition-colors"
            }
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-2 border-b border-border px-2 pb-2 text-[8px] font-black tracking-widest text-primary uppercase">
        <div className="col-span-4 flex gap-2">
          <div className="h-4 w-4 rounded-sm border border-border" /> TASK
        </div>
        <div className="col-span-2">PROJECT</div>
        <div className="col-span-2">ASSIGNEE</div>
        <div className="col-span-1 text-center">PRIORITY</div>
        <div className="col-span-1 text-center">STATUS</div>
        <div className="col-span-1 text-center">DUE DATE</div>
        <div className="col-span-1 text-right">PROGRESS</div>
      </div>

      <div className="hide-scrollbar mt-2 flex-1 space-y-1 overflow-y-auto">
        {TASK_CENTER_TABLE_ROWS.map((row) => (
          <TaskCenterTableRow key={row.t} row={row} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[9px] text-primary">
        <div>Showing 1 to 8 of 238 tasks</div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon-xs">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            className="border-primary/50 bg-primary/20 text-primary"
          >
            1
          </Button>
          <Button type="button" variant="ghost" size="icon-xs">
            2
          </Button>
          <Button type="button" variant="ghost" size="icon-xs">
            3
          </Button>
          <span>...</span>
          <Button type="button" variant="ghost" size="icon-xs">
            30
          </Button>
          <Button type="button" variant="ghost" size="icon-xs">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-background text-foreground"
          >
            10 <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
