"use client"

import React, { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import { apiGet } from "@moon/client"

type CryptoAsset = {
  symbol: string
  name: string
  price: number
  change24h: number
}

const ASSETS = [
  { symbol: "BTCUSDT", name: "Bitcoin" },
  { symbol: "ETHUSDT", name: "Ethereum" },
  { symbol: "SOLUSDT", name: "Solana" },
  { symbol: "BNBUSDT", name: "Binance Coin" },
  { symbol: "XRPUSDT", name: "Ripple" },
]

export function FinancialMarketsWidget() {
  const [markets, setMarkets] = useState<CryptoAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchMarkets = async () => {
      try {
        const promises = ASSETS.map(async (asset) => {
          const data = await apiGet<any>(
            `/api/external/binance/ticker?symbol=${asset.symbol}`
          )
          return {
            symbol: asset.symbol,
            name: asset.name,
            price: parseFloat(data.lastPrice),
            change24h: parseFloat(data.priceChangePercent),
          }
        })

        const results = await Promise.all(promises)
        if (isMounted) {
          setMarkets(results)
          setIsLoading(false)
        }
      } catch (e) {
        console.error("Failed to fetch market data", e)
      }
    }

    fetchMarkets()
    const interval = setInterval(fetchMarkets, 10000) // Update every 10 seconds

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="bg-background flex h-full flex-col rounded-xl border border-yellow-500/30 p-4 lg:col-span-12 xl:col-span-4">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-warning uppercase">
          <DollarSign className="h-4 w-4" />
          FINANCIAL MARKETS
          <span className="rounded-[2px] border border-yellow-400/50 bg-yellow-400/20 px-1.5 py-0.5 text-[8px] text-warning">
            LIVE
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="mb-2 grid grid-cols-12 gap-4 border-b border-border pb-2 text-[8px] font-bold tracking-widest text-foreground/50">
          <div className="col-span-4">ASSET</div>
          <div className="col-span-4 text-right">PRICE (USD)</div>
          <div className="col-span-4 text-right">24H CHANGE</div>
        </div>

        <div className="hide-scrollbar flex h-[250px] flex-col space-y-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center font-mono text-[10px] text-warning/50">
              <Activity className="h-6 w-6 animate-pulse" />
              Connecting to global exchanges...
            </div>
          ) : (
            markets.map((asset, idx) => (
              <div
                key={idx}
                className="group grid grid-cols-12 items-center gap-4 rounded border border-transparent bg-muted/30 px-2 py-2 text-[9px] transition-colors hover:border-yellow-500/30 hover:bg-muted/30"
              >
                <div className="col-span-4 font-bold text-foreground transition-colors group-hover:text-warning">
                  {asset.name}
                  <div className="text-[7px] text-foreground/40">
                    {asset.symbol.replace("USDT", "")}
                  </div>
                </div>
                <div className="col-span-4 text-right font-mono font-bold text-foreground">
                  $
                  {asset.price > 1000
                    ? asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : asset.price.toPrecision(4)}
                </div>
                <div className="col-span-4 flex items-center justify-end gap-1 text-right font-mono">
                  <span
                    className={`flex items-center gap-1 rounded-sm px-2 py-0.5 font-black ${asset.change24h >= 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}
                  >
                    {asset.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(asset.change24h).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
