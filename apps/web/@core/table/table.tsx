"use client"

import React from "react"
import { THEME_TOKENS, ThemeAccentColor } from "@core/tokens/theme-tokens"

export function Table({
  headers,
  rows,
  accentColor = "system",
}: {
  headers: string[]
  rows: (React.ReactNode | string)[][]
  accentColor?: ThemeAccentColor
}) {
  const _colorHex = THEME_TOKENS.colors[accentColor]
  return (
    <div className="theme-scrollbar bg-space card-clip w-full overflow-x-auto border border-primary/20">
      <table className="w-full text-left font-mono text-[10px] sm:text-xs">
        <thead className="bg-panel border-b border-primary/30 text-primary">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 font-bold tracking-widest whitespace-nowrap uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10 text-foreground">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-8 text-center text-primary"
              >
                NO DATA FOUND
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="hover:bg-panel/60 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
