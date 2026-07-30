"use client"

import React, { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"

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
  { symbol: "XRPUSDT", name: "Ripple" }
]

export function FinancialMarketsWidget() {
  const [markets, setMarkets] = useState<CryptoAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchMarkets = async () => {
      try {
        const promises = ASSETS.map(async (asset) => {
          const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${asset.symbol}`)
          if (!res.ok) throw new Error("Failed to fetch")
          const data = await res.json()
          return {
            symbol: asset.symbol,
            name: asset.name,
            price: parseFloat(data.lastPrice),
            change24h: parseFloat(data.priceChangePercent)
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
    <div className="bg-space border-yellow-500/30 flex flex-col rounded-xl border p-4 lg:col-span-12 xl:col-span-4 h-full">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="text-[10px] font-black tracking-widest text-yellow-400 uppercase flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          FINANCIAL MARKETS
          <span className="bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded-[2px] text-[8px] border border-yellow-400/50">LIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 text-[8px] font-bold text-white/50 tracking-widest mb-2 border-b border-white/5 pb-2">
          <div className="col-span-4">ASSET</div>
          <div className="col-span-4 text-right">PRICE (USD)</div>
          <div className="col-span-4 text-right">24H CHANGE</div>
        </div>

        <div className="hide-scrollbar flex flex-col space-y-1 h-[250px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-yellow-400/50 text-[10px] py-10 font-mono flex flex-col items-center gap-2">
              <Activity className="h-6 w-6 animate-pulse" />
              Connecting to global exchanges...
            </div>
          ) : (
            markets.map((asset, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-4 text-[9px] items-center py-2 px-2 bg-white/5 hover:bg-white/10 border border-transparent hover:border-yellow-500/30 rounded transition-colors group"
              >
                <div className="col-span-4 font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {asset.name}
                  <div className="text-[7px] text-white/40">{asset.symbol.replace('USDT', '')}</div>
                </div>
                <div className="col-span-4 text-right font-mono text-white/90 font-bold">
                  ${asset.price > 1000 ? asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : asset.price.toPrecision(4)}
                </div>
                <div className="col-span-4 text-right font-mono flex items-center justify-end gap-1">
                  <span className={`px-2 py-0.5 font-black rounded-sm flex items-center gap-1 ${asset.change24h >= 0 ? 'bg-success/20 text-success' : 'bg-red-500/20 text-red-400'}`}>
                    {asset.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
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
