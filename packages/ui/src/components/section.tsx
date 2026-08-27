import React from "react"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string
  borderColor?: string
  className?: string
  children?: React.ReactNode
}

export function Section({
  id,
  borderColor = "cyan",
  className = "",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative rounded-2xl border border-primary/20 bg-slate-950/40 p-6 backdrop-blur-md ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

export interface SectionBadgeProps {
  number?: string | number
  label: string
  className?: string
}

export function SectionBadge({ number, label, className = "" }: SectionBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] tracking-widest text-primary uppercase ${className}`}
    >
      {number && <span className="font-bold text-white">[{number}]</span>}
      <span>{label}</span>
    </div>
  )
}
