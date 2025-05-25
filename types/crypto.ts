export interface CryptoCurrency {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  total_volume: number
  last_updated: string
}

export interface CryptoApiResponse {
  data: CryptoCurrency[]
  error?: string
}
