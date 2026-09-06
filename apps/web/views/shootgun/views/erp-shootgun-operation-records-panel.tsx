"use client"

import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react"
import {
  Button,
  Panel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui"
import type { Operation } from "./erp-shootgun-types"

type OperationRecordsPanelProps = {
  operations: Operation[]
  error: string | null
  onCreate: () => void
  onEdit: (operation: Operation) => void
  onRemove: (id: number) => void
}

export function ERPShootgunOperationRecordsPanel({
  operations,
  error,
  onCreate,
  onEdit,
  onRemove,
}: OperationRecordsPanelProps) {
  return (
    <Panel padding="none">
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-foreground">
            OPERATION RECORDS
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {operations.length} record(s) visible in the public archive.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={onCreate}
          className="inline-flex h-9 items-center justify-center gap-2 bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary"
        >
          <Plus className="size-4" /> ADD OPERATION
        </Button>
      </div>

      {error && (
        <p className="border-b border-destructive/30 bg-red-950/30 px-4 py-3 text-xs text-red-200">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <Table className="w-full min-w-[760px] text-left text-xs">
          <TableHeader className="border-b border-border text-muted-foreground">
            <TableRow>
              <TableHead className="px-4 py-3 font-medium">NAME</TableHead>
              <TableHead className="px-4 py-3 font-medium">ARGUMENT</TableHead>
              <TableHead className="px-4 py-3 font-medium">
                VERSE REFERENCES
              </TableHead>
              <TableHead className="px-4 py-3 text-right font-medium">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operations.map((operation) => (
              <TableRow
                key={operation.id}
                className="border-b border-border text-foreground"
              >
                <TableCell className="px-4 py-3 font-medium text-foreground">
                  {operation.name}
                </TableCell>
                <TableCell className="max-w-80 px-4 py-3 leading-5">
                  {operation.argument || "-"}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {operation.verseIds?.length ?? 0} selected
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {operation.targetUrl && (
                      <a
                        href={operation.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-muted-foreground hover:text-primary"
                        title="Open target"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onEdit(operation)}
                      className="p-1.5 text-muted-foreground hover:text-primary"
                      title="Edit operation"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onRemove(operation.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-300"
                      title="Delete operation"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {operations.length === 0 && !error && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No operation records yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Panel>
  )
}
