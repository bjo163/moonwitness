"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import {
  apiGet,
  sourceFailureMeta,
  summarizeSourceStatus,
  type SourceMeta,
  type SourceStatus,
} from "@moon/client"

type MarketAsset = {
  symbol: string
  name: string
}

type MarketQuote = MarketAsset & {
  price: number
  change24h: number
}

const ASSETS: readonly MarketAsset[] = [
  { symbol: "BTCUSDT", name: "Bitcoin" },
  { symbol: "ETHUSDT", name: "Ethereum" },
  { symbol: "SOLUSDT", name: "Solana" },
  { symbol: "BNBUSDT", name: "BNB" },
  { symbol: "XRPUSDT", name: "XRP" },
]

const STATUS_CLASSES: Record<SourceStatus, string> = {
  LIVE: "border-success/30 bg-success/10 text-success",
  CACHED: "border-info/30 bg-info/10 text-info",
  STALE: "border-warning/30 bg-warning/10 text-warning",
  UNAVAILABLE: "border-destructive/30 bg-destructive/10 text-destructive",
  SIMULATED: "border-secondary/30 bg-secondary/10 text-secondary",
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function FinancialMarketsWidget({
  onSourceMeta,
}: {
  onSourceMeta?: (source: SourceMeta) => void
}) {
  const [quotesBySymbol, setQuotesBySymbol] = useState<
    Record<string, MarketQuote>
  >({})
  const [sourceMeta, setSourceMeta] = useState<SourceMeta[]>([])
  const successfulAt = useRef(new Map<string, number>())

  useEffect(() => {
    let isMounted = true
    const updateSource = (metadata: SourceMeta) => {
      if (!isMounted) return
      setSourceMeta((current) => [
        ...current.filter((entry) => entry.source !== metadata.source),
        metadata,
      ])
      onSourceMeta?.(metadata)
    }

    const loadQuote = async (asset: MarketAsset) => {
      const source = `market-${asset.symbol.toLowerCase()}`
      try {
        const payload = await apiGet<unknown>(
          `/api/external/binance/ticker?symbol=${asset.symbol}`
        )
        if (!isRecord(payload)) {
          throw new Error("Market response is not an object")
        }
        const price = Number(payload.lastPrice)
        const change24h = Number(payload.priceChangePercent)
        if (!Number.isFinite(price) || !Number.isFinite(change24h)) {
          throw new Error("Market response contains invalid quote values")
        }

        const timestamp = Date.now()
        successfulAt.current.set(source, timestamp)
        setQuotesBySymbol((current) => ({
          ...current,
          [asset.symbol]: { ...asset, price, change24h },
        }))
        updateSource({
          source,
          status: "LIVE",
          timestamp,
          checkedAt: timestamp,
        })
      } catch (error) {
        updateSource(
          sourceFailureMeta(
            source,
            successfulAt.current.get(source),
            error instanceof Error ? error.message : String(error),
            Date.now()
          )
        )
      }
    }

    const refresh = () => Promise.all(ASSETS.map(loadQuote))
    for (const asset of ASSETS) {
      updateSource({
        source: `market-${asset.symbol.toLowerCase()}`,
        status: "UNAVAILABLE",
        timestamp: Date.now(),
        error: "No successful source response has been received",
      })
    }
    void refresh()
    const interval = window.setInterval(() => void refresh(), 10 * 1000)

    return () => {
      isMounted = false
      window.clearInterval(interval)
    }
  }, [onSourceMeta])

  const summary = summarizeSourceStatus(sourceMeta)

  return (
    <section className="flex h-full flex-col rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <DollarSign className="size-4 text-muted-foreground" aria-hidden="true" />
          <h2>Financial markets · Binance</h2>
        </div>
        <span
          className={`rounded-md border px-2 py-1 text-xs ${STATUS_CLASSES[summary.status]}`}
        >
          {summary.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 border-b border-border pb-2 text-xs font-medium text-muted-foreground">
        <span>Asset</span>
        <span className="text-right">Price (USDT)</span>
        <span className="text-right">24-hour change</span>
      </div>

      <ul className="flex-1 divide-y divide-border">
        {ASSETS.map((asset) => {
          const quote = quotesBySymbol[asset.symbol]
          const source = sourceMeta.find(
            (entry) =>
              entry.source === `market-${asset.symbol.toLowerCase()}`
          )
          const status = source?.status ?? "UNAVAILABLE"

          return (
            <li
              key={asset.symbol}
              className="grid grid-cols-3 items-center gap-3 py-3 text-xs"
            >
              <span className="font-medium">
                {asset.name}
                <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
                  {asset.symbol.replace("USDT", "")} · {status}
                </span>
              </span>
              <span className="text-right font-mono">
                {quote
                  ? quote.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })
                  : "—"}
              </span>
              <span className="flex items-center justify-end gap-1 font-mono">
                {quote ? (
                  <>
                    {quote.change24h >= 0 ? (
                      <TrendingUp
                        className="size-3 text-success"
                        aria-hidden="true"
                      />
                    ) : (
                      <TrendingDown
                        className="size-3 text-destructive"
                        aria-hidden="true"
                      />
                    )}
                    {quote.change24h.toFixed(2)}%
                  </>
                ) : (
                  "—"
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
