import React from "react"

const maxWidthMap = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-7xl",
} as const

type ContentWrapperProps = {
  children: React.ReactNode
  maxWidth?: keyof typeof maxWidthMap
  className?: string
}

export function ContentWrapper({
  children,
  maxWidth = "lg",
  className,
}: ContentWrapperProps) {
  return (
    <div
      className={`mx-auto ${maxWidthMap[maxWidth]} px-4 sm:px-6 ${className ?? ""}`}
    >
      {children}
    </div>
  )
}
