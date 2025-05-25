"use client"

import { useState, useEffect, useCallback } from "react"
import useSWR from "swr"
import type { CryptoCurrency } from "@/types/crypto"
import { useSettings } from "@/components/settings-provider"
import { formatCurrency, formatPercentage, formatMarketCap, debounce } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react"

interface CryptoTableProps {
  initialData: CryptoCurrency[]
  messages: any
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded")
    }
    throw new Error("Failed to fetch")
  }
  return response.json()
}

export function CryptoTable({ initialData, messages }: CryptoTableProps) {
  const { currency, locale } = useSettings()
  const [debouncedCurrency, setDebouncedCurrency] = useState(currency)

  const debouncedSetCurrency = useCallback(
    debounce((newCurrency: string) => {
      setDebouncedCurrency(newCurrency as any)
    }, 1000), // Increased debounce time
    [],
  )

  useEffect(() => {
    debouncedSetCurrency(currency)
  }, [currency, debouncedSetCurrency])

  const { data, error, isLoading, mutate } = useSWR(`/api/crypto?currency=${debouncedCurrency}`, fetcher, {
    fallbackData: initialData,
    refreshInterval: 60000, // Increased to 60 seconds to reduce API calls
    revalidateOnFocus: false, // Disable to reduce API calls
    revalidateOnReconnect: true,
    errorRetryCount: 2,
    errorRetryInterval: 5000,
    onError: (error) => {
      console.warn("SWR Error:", error.message)
    },
  })

  const handleRetry = () => {
    mutate()
  }

  if (error) {
    const isRateLimit = error.message.includes("Rate limit")
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-destructive mb-2">{isRateLimit ? "Rate limit exceeded" : messages.crypto.fetchError}</p>
        <p className="text-sm text-muted-foreground mb-4">
          {isRateLimit
            ? "Please wait a moment before refreshing. Showing cached data below."
            : "Showing fallback data. Please try again later."}
        </p>
        <Button onClick={handleRetry} variant="outline" disabled={isRateLimit}>
          <RefreshCw className="w-4 h-4 mr-2" />
          {isRateLimit ? "Please wait..." : messages.common.retry}
        </Button>
      </div>
    )
  }

  const cryptoData = data || initialData

  if (!cryptoData || cryptoData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">{messages.crypto.noData}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Mobile view */}
      <div className="block md:hidden space-y-4" role="list" aria-label={messages.crypto.title}>
        {cryptoData.map((crypto) => (
          <div
            key={crypto.id}
            className="bg-card border border-border rounded-lg p-4 space-y-3 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer transition-colors hover:bg-muted/50"
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                // Future: Navigate to crypto detail page
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={crypto.image || "/placeholder.svg"}
                  alt={crypto.name}
                  className="w-8 h-8 rounded-full"
                  loading="lazy"
                />
                <div>
                  <h3 className="font-semibold text-sm">{crypto.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(crypto.current_price, currency, locale)}</p>
                <div
                  className={`flex items-center text-xs ${
                    crypto.price_change_percentage_24h >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {formatPercentage(crypto.price_change_percentage_24h, locale)}
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {messages.crypto.rank}: #{crypto.market_cap_rank}
              </span>
              <span>
                {messages.crypto.marketCap}: {formatMarketCap(crypto.market_cap, locale)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label={messages.crypto.title}>
            <thead role="rowgroup">
              <tr role="row" className="border-b border-border">
                <th role="columnheader" className="text-left py-3 px-4 font-medium text-muted-foreground">
                  {messages.crypto.rank}
                </th>
                <th role="columnheader" className="text-left py-3 px-4 font-medium text-muted-foreground">
                  {messages.crypto.name}
                </th>
                <th role="columnheader" className="text-right py-3 px-4 font-medium text-muted-foreground">
                  {messages.crypto.price}
                </th>
                <th role="columnheader" className="text-right py-3 px-4 font-medium text-muted-foreground">
                  {messages.crypto.change24h}
                </th>
                <th role="columnheader" className="text-right py-3 px-4 font-medium text-muted-foreground">
                  {messages.crypto.marketCap}
                </th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((crypto) => (
                <tr
                  key={crypto.id}
                  className="border-b border-border hover:bg-muted/50 focus-within:bg-muted/50 transition-colors"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      // Future: Navigate to crypto detail page
                    }
                  }}
                >
                  <td className="py-4 px-4">
                    <span className="text-muted-foreground">#{crypto.market_cap_rank}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={crypto.image || "/placeholder.svg"}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                        loading="lazy"
                      />
                      <div>
                        <div className="font-semibold">{crypto.name}</div>
                        <div className="text-sm text-muted-foreground uppercase">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold">
                    {formatCurrency(crypto.current_price, currency, locale)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div
                      className={`flex items-center justify-end ${
                        crypto.price_change_percentage_24h >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {formatPercentage(crypto.price_change_percentage_24h, locale)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">{formatMarketCap(crypto.market_cap, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">{messages.common.loading}</span>
        </div>
      )}
    </div>
  )
}
