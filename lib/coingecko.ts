import type { CryptoCurrency } from "@/types/crypto"
import type { Currency } from "@/i18n/config"

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"

// Fallback data for when API is unavailable
const FALLBACK_DATA: CryptoCurrency[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 43250,
    market_cap: 847000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
    total_volume: 25000000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 2650,
    market_cap: 318000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: 1.8,
    total_volume: 15000000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.0,
    market_cap: 95000000000,
    market_cap_rank: 3,
    price_change_percentage_24h: 0.1,
    total_volume: 45000000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 315,
    market_cap: 47000000000,
    market_cap_rank: 4,
    price_change_percentage_24h: -0.5,
    total_volume: 1200000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 98,
    market_cap: 43000000000,
    market_cap_rank: 5,
    price_change_percentage_24h: 3.2,
    total_volume: 2800000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.52,
    market_cap: 28000000000,
    market_cap_rank: 6,
    price_change_percentage_24h: 1.1,
    total_volume: 1500000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: "usd-coin",
    symbol: "usdc",
    name: "USDC",
    image: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    current_price: 1.0,
    market_cap: 25000000000,
    market_cap_rank: 7,
    price_change_percentage_24h: 0.0,
    total_volume: 5000000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: "staked-ether",
    symbol: "steth",
    name: "Lido Staked Ether",
    image: "https://assets.coingecko.com/coins/images/13442/large/steth_logo.png",
    current_price: 2645,
    market_cap: 24000000000,
    market_cap_rank: 8,
    price_change_percentage_24h: 1.7,
    total_volume: 85000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.45,
    market_cap: 16000000000,
    market_cap_rank: 9,
    price_change_percentage_24h: 2.8,
    total_volume: 450000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.085,
    market_cap: 12000000000,
    market_cap_rank: 10,
    price_change_percentage_24h: 4.2,
    total_volume: 800000000,
    last_updated: new Date().toISOString(),
  },
]

export async function fetchCryptoPrices(currency: Currency = "USD", limit = 20): Promise<CryptoCurrency[]> {
  try {
    // Add delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100))

    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`,
      {
        next: { revalidate: 300 }, // Increased to 5 minutes to reduce API calls
        headers: {
          Accept: "application/json",
          "User-Agent": "CryptoTracker/1.0",
        },
      },
    )

    if (!response.ok) {
      if (response.status === 429) {
        console.warn("Rate limit exceeded, using fallback data")
        return adjustPricesForCurrency(FALLBACK_DATA, currency)
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching crypto prices:", error)
    console.log("Using fallback data due to API error")
    return adjustPricesForCurrency(FALLBACK_DATA, currency)
  }
}

// Helper function to adjust fallback prices based on currency
function adjustPricesForCurrency(data: CryptoCurrency[], currency: Currency): CryptoCurrency[] {
  const multipliers = {
    USD: 1,
    EUR: 0.85, // Approximate EUR/USD rate
    CLP: 850, // Approximate CLP/USD rate
  }

  const multiplier = multipliers[currency] || 1

  return data.map((crypto) => ({
    ...crypto,
    current_price: crypto.current_price * multiplier,
    market_cap: crypto.market_cap * multiplier,
  }))
}
