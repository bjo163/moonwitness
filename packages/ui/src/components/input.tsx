import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@workspace/ui/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "rounded-md bg-background/80 h-9 w-full min-w-0 border border-primary/30 px-3 py-1 font-mono text-xs text-foreground transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-bold file:text-primary placeholder:text-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
