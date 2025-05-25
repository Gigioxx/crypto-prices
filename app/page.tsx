import { Suspense } from "react"
import { fetchCryptoPrices } from "@/lib/coingecko"
import { CryptoTable } from "@/components/crypto-table"
import { CryptoSkeleton } from "@/components/crypto-skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DemoBanner } from "@/components/demo-banner"
import { ErrorBoundary } from "@/components/error-boundary"

// Import messages directly for server component
import enMessages from "@/messages/en.json"

export async function generateMetadata() {
  return {
    title: "Crypto Price Tracker - Real-time Cryptocurrency Prices",
    description: "Track real-time cryptocurrency prices and market data with our mobile-first crypto price tracker.",
    keywords: "cryptocurrency, crypto prices, bitcoin, ethereum, market data, real-time",
    openGraph: {
      title: "Crypto Price Tracker",
      description: "Real-time cryptocurrency prices and market data",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Crypto Price Tracker",
      description: "Real-time cryptocurrency prices and market data",
    },
  }
}

async function CryptoData() {
  try {
    const initialData = await fetchCryptoPrices("USD", 20)
    return <CryptoTable initialData={initialData} messages={enMessages} />
  } catch (error) {
    console.error("Failed to fetch initial crypto data:", error)
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">Failed to load cryptocurrency data</p>
      </div>
    )
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header messages={enMessages} />

      <main className="container mx-auto px-4 py-6 flex-1">
        <DemoBanner />
        <ErrorBoundary>
          <Suspense fallback={<CryptoSkeleton />}>
            <CryptoData />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer messages={enMessages} />
    </div>
  )
}
