"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipValueType } from "recharts"

import { cn } from "../lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const
const INITIAL_DIMENSION = { width: 320, height: 200 } as const
type TooltipNameType = number | string
type ChartThemeName = "light" | "dark"

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<ChartThemeName, string> }
  )
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  initialDimension?: {
    width: number
    height: number
  }
}

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function useChartContainerController(id?: string) {
  const uniqueId = React.useId()
  return { chartId: `chart-${id ?? uniqueId.replace(/:/g, "")}` }
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, item]) => item.theme ?? item.color)
  if (!colorConfig.length) return null
  // Sanitized dynamic chart style definition
  return <style dangerouslySetInnerHTML={{ __html: Object.entries(THEMES).map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
  const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color
  return color ? `  --color-${key}: ${color};` : null
}).join("\n")}
}
`).join("\n") }} />
}

function ChartContainerPresentation({
  chartId,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: ChartContainerProps & { chartId: string }) {


  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function ChartContainer({ id, ...props }: ChartContainerProps) {
  const { chartId } = useChartContainerController(id)
  return <ChartContainerPresentation chartId={chartId} {...props} />
}

const ChartTooltip = RechartsPrimitive.Tooltip

type ChartTooltipContentProps =
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >

type ChartTooltipPayloadItem = NonNullable<
  ChartTooltipContentProps["payload"]
>[number]

function useChartTooltipController({
  config,
  payload,
  hideLabel,
  label,
  labelFormatter,
  labelClassName,
  labelKey,
  indicator,
}: Pick<
  ChartTooltipContentProps,
  | "payload"
  | "hideLabel"
  | "label"
  | "labelFormatter"
  | "labelClassName"
  | "labelKey"
  | "indicator"
> & { config: ChartConfig }) {
  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  return {
    tooltipLabel,
    nestLabel: payload?.length === 1 && indicator !== "dot",
  }
}

type ChartTooltipItemProps = {
  item: ChartTooltipPayloadItem
  index: number
  config: ChartConfig
  color?: string
  formatter?: ChartTooltipContentProps["formatter"]
  hideIndicator: boolean
  indicator: "line" | "dot" | "dashed"
  nameKey?: string
  nestLabel: boolean
  tooltipLabel: React.ReactNode
}

function ChartTooltipItem(props: ChartTooltipItemProps) {
  const { item, index, config, color, formatter, hideIndicator, indicator, nameKey, nestLabel, tooltipLabel } = props
  const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
  const itemConfig = getPayloadConfigFromPayload(config, item, key)
  const indicatorColor = color ?? item.payload?.fill ?? item.color

  if (formatter && item?.value !== undefined && item.name) return formatter(item.value, item.name, item, index, item.payload)
  return <ChartTooltipItemContent item={item} itemConfig={itemConfig} indicatorColor={indicatorColor} indicator={indicator} hideIndicator={hideIndicator} nestLabel={nestLabel} tooltipLabel={tooltipLabel} />
}

function ChartTooltipItemContent({ item, itemConfig, indicatorColor, indicator, hideIndicator, nestLabel, tooltipLabel }: {
  item: ChartTooltipPayloadItem
  itemConfig?: ChartConfig[string]
  indicatorColor?: string
  indicator: "line" | "dot" | "dashed"
  hideIndicator: boolean
  nestLabel: boolean
  tooltipLabel: React.ReactNode
}) {
  return <div className={cn("flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground", indicator === "dot" && "items-center")}>
    <ChartTooltipIndicator icon={itemConfig?.icon} color={indicatorColor} indicator={indicator} hide={hideIndicator} nested={nestLabel} />
    <div className={cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center")}>
      <div className="grid gap-1.5">{nestLabel ? tooltipLabel : null}<span className="text-muted-foreground">{itemConfig?.label ?? item.name}</span></div>
      <ChartTooltipValue value={item.value} />
    </div>
  </div>
}

function ChartTooltipValue({ value }: { value: unknown }) {
  if (value == null) return null
  return <span className="font-mono font-medium text-foreground tabular-nums">{typeof value === "number" ? value.toLocaleString() : String(value)}</span>
}

function ChartTooltipIndicator({
  icon: Icon,
  color,
  indicator,
  hide,
  nested,
}: {
  icon?: React.ComponentType
  color?: string
  indicator: "line" | "dot" | "dashed"
  hide: boolean
  nested: boolean
}) {
  if (Icon) return <Icon />
  if (hide) return null

  return (
    <div
      className={cn(
        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
        {
          "h-2.5 w-2.5": indicator === "dot",
          "w-1": indicator === "line",
          "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
          "my-0.5": nested && indicator === "dashed",
        }
      )}
      style={{
        "--color-bg": color,
        "--color-border": color,
      } as React.CSSProperties}
    />
  )
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart()
  const { tooltipLabel, nestLabel } = useChartTooltipController({
    config,
    payload,
    hideLabel,
    label,
    labelFormatter,
    labelClassName,
    labelKey,
    indicator,
  })

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            return (
              <ChartTooltipItem
                key={index}
                item={item}
                index={index}
                config={config}
                color={color}
                formatter={formatter}
                hideIndicator={hideIndicator}
                indicator={indicator}
                nameKey={nameKey}
                nestLabel={nestLabel}
                tooltipLabel={tooltipLabel}
              />
            )
          })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean
  nameKey?: string
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
    </div>
  )
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export type MetricChartDatum = {
  label: string
  value: number
}

export function MetricChart({
  title,
  subtitle,
  data,
  accentColor = "cyan",
  height = 128,
  className,
}: {
  title?: string
  subtitle?: string
  data: MetricChartDatum[]
  accentColor?: string
  height?: number | string
  className?: string
}) {
  const maxVal = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className={cn("rounded-xl border border-border/40 bg-card border border-primary/20 p-4 font-mono", className)}>
      {title && <div className="text-xs font-bold tracking-wider text-primary uppercase">{title}</div>}
      {subtitle && <div className="text-[10px] text-slate-400">{subtitle}</div>}
      <div className="mt-3 flex items-end gap-2" style={{ height: typeof height === "number" ? `${height}px` : undefined }}>
        {data.map((item, idx) => {
          const pct = Math.min(100, Math.round((item.value / maxVal) * 100))
          return (
            <div key={idx} className="flex flex-1 flex-col items-center gap-1">
              <div className="text-[8px] text-slate-400">{item.value}</div>
              <div className="w-full rounded-t bg-primary/20 hover:bg-primary/40 transition-all" style={{ height: `${pct}%` }} />
              <div className="text-[8px] tracking-widest text-primary truncate max-w-full">{item.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
