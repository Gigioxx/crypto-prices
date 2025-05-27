export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  last_updated: string;
}

export interface CryptoApiResponse {
  data: CryptoCurrency[];
  error?: string;
}

// Extended types for coin detail page
export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: Record<string, number>;
    ath_change_percentage: Record<string, number>;
    ath_date: Record<string, string>;
    atl: Record<string, number>;
    atl_change_percentage: Record<string, number>;
    atl_date: Record<string, string>;
  };
  last_updated: string;
}

export interface MarketChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface ChartDataPoint {
  timestamp: number;
  price: number;
  market_cap: number;
  volume: number;
  date: string;
}

export type TimeFrame = '1' | '7' | '30' | '365';

export interface CoinDetailPageProps {
  params: {
    id: string;
  };
  searchParams: {
    currency?: string;
    days?: TimeFrame;
    locale?: string;
  };
}
