"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 font-mono data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-md border border-border bg-muted p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 border-none bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 font-sans text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-active:border-border data-active:bg-card data-active:text-foreground data-active:shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 pt-2 font-mono text-xs outline-none", className)}
      {...props}
    />
  )
}

export type TabItem = {
  id: string
  label: string
  count?: number
  icon?: React.ComponentType<{ className?: string }>
}

export function SimpleTabs({
  tabs,
  activeTab,
  onChange,
  accentColor = "cyan",
  className,
}: {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  accentColor?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-1 border-b border-primary/20 pb-2",
        className
      )}
    >
      {tabs.map((t) => {
        const isActive = t.id === activeTab
        const Icon = t.icon
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs font-bold tracking-wider uppercase transition-all",
              isActive
                ? "border-primary bg-primary/20 text-white shadow-sm"
                : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            {Icon && <Icon className="size-3.5" />}
            <span>{t.label}</span>
            {typeof t.count === "number" && (
              <span className="rounded bg-black/40 px-1 py-0.5 text-[9px] text-primary">
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
