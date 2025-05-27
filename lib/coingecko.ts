import type { Currency } from '@/i18n/config';
import type {
  ChartDataPoint,
  CoinDetail,
  CryptoCurrency,
  MarketChartData,
  TimeFrame,
} from '@/types/crypto';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Fallback data for when API is unavailable
const FALLBACK_DATA: CryptoCurrency[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 43250,
    market_cap: 847000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
    total_volume: 25000000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 2650,
    market_cap: 318000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: 1.8,
    total_volume: 15000000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
    current_price: 1.0,
    market_cap: 95000000000,
    market_cap_rank: 3,
    price_change_percentage_24h: 0.1,
    total_volume: 45000000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 315,
    market_cap: 47000000000,
    market_cap_rank: 4,
    price_change_percentage_24h: -0.5,
    total_volume: 1200000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 98,
    market_cap: 43000000000,
    market_cap_rank: 5,
    price_change_percentage_24h: 3.2,
    total_volume: 2800000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    current_price: 0.52,
    market_cap: 28000000000,
    market_cap_rank: 6,
    price_change_percentage_24h: 1.1,
    total_volume: 1500000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'usd-coin',
    symbol: 'usdc',
    name: 'USDC',
    image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    current_price: 1.0,
    market_cap: 25000000000,
    market_cap_rank: 7,
    price_change_percentage_24h: 0.0,
    total_volume: 5000000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'staked-ether',
    symbol: 'steth',
    name: 'Lido Staked Ether',
    image: 'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png',
    current_price: 2645,
    market_cap: 24000000000,
    market_cap_rank: 8,
    price_change_percentage_24h: 1.7,
    total_volume: 85000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.45,
    market_cap: 16000000000,
    market_cap_rank: 9,
    price_change_percentage_24h: 2.8,
    total_volume: 450000000,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    current_price: 0.085,
    market_cap: 12000000000,
    market_cap_rank: 10,
    price_change_percentage_24h: 4.2,
    total_volume: 800000000,
    last_updated: new Date().toISOString(),
  },
];

export async function fetchCryptoPrices(
  currency: Currency = 'USD',
  limit = 20,
): Promise<CryptoCurrency[]> {
  try {
    // Add delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`,
      {
        next: { revalidate: 300 }, // Increased to 5 minutes to reduce API calls
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CryptoPrices/1.0',
        },
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Rate limit exceeded, using fallback data');

        return adjustPricesForCurrency(FALLBACK_DATA, currency);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    console.log('Using fallback data due to API error');

    return adjustPricesForCurrency(FALLBACK_DATA, currency);
  }
}

// Helper function to adjust fallback prices based on currency
function adjustPricesForCurrency(data: CryptoCurrency[], currency: Currency): CryptoCurrency[] {
  const multipliers = {
    USD: 1,
    EUR: 0.85, // Approximate EUR/USD rate
    CLP: 850, // Approximate CLP/USD rate
  };

  const multiplier = multipliers[currency] || 1;

  return data.map((crypto) => ({
    ...crypto,
    current_price: crypto.current_price * multiplier,
    market_cap: crypto.market_cap * multiplier,
  }));
}

// Fallback coin detail data for when API is unavailable
const FALLBACK_COIN_DETAILS: Record<string, Partial<CoinDetail>> = {
  bitcoin: {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    description: {
      en: 'Bitcoin is the first successful internet money based on peer-to-peer technology.',
    },
    image: {
      thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
      small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    },
    market_cap_rank: 1,
  },
  ethereum: {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    description: { en: 'Ethereum is a decentralized platform that runs smart contracts.' },
    image: {
      thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
      small: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      large: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    },
    market_cap_rank: 2,
  },
  ripple: {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    description: { en: 'XRP is a digital asset built for payments.' },
    image: {
      thumb: 'https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png',
      small: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
      large: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    },
    market_cap_rank: 6,
  },
  binancecoin: {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    description: { en: 'BNB is the native cryptocurrency of the Binance ecosystem.' },
    image: {
      thumb: 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png',
      small: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
      large: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    },
    market_cap_rank: 4,
  },
  solana: {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    description: {
      en: 'Solana is a high-performance blockchain supporting builders around the world.',
    },
    image: {
      thumb: 'https://assets.coingecko.com/coins/images/4128/thumb/solana.png',
      small: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
      large: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    },
    market_cap_rank: 5,
  },
  cardano: {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    description: {
      en: 'Cardano is a blockchain platform for changemakers, innovators, and visionaries.',
    },
    image: {
      thumb: 'https://assets.coingecko.com/coins/images/975/thumb/cardano.png',
      small: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
      large: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    },
    market_cap_rank: 9,
  },
};

/**
 * Generate fallback coin detail data
 */
function generateFallbackCoinDetail(coinId: string, currency: Currency): CoinDetail {
  const fallbackBase = FALLBACK_COIN_DETAILS[coinId];
  const fallbackCrypto = FALLBACK_DATA.find((crypto) => crypto.id === coinId);

  if (!fallbackBase || !fallbackCrypto) {
    throw new Error('Coin not found');
  }

  // Currency multipliers
  const multipliers = {
    USD: 1,
    EUR: 0.85,
    CLP: 850,
  };

  const multiplier = multipliers[currency] || 1;
  const currencyKey = currency.toLowerCase();

  // Generate market data with currency conversion
  const marketData = {
    current_price: { [currencyKey]: fallbackCrypto.current_price * multiplier },
    market_cap: { [currencyKey]: fallbackCrypto.market_cap * multiplier },
    total_volume: { [currencyKey]: fallbackCrypto.total_volume * multiplier },
    price_change_percentage_24h: fallbackCrypto.price_change_percentage_24h,
    price_change_percentage_7d: 0,
    price_change_percentage_30d: 0,
    price_change_percentage_1y: 0,
    circulating_supply: 50000000000, // Default value
    total_supply: 100000000000, // Default value
    max_supply: 100000000000, // Default value
    ath: { [currencyKey]: fallbackCrypto.current_price * multiplier * 2 },
    ath_change_percentage: { [currencyKey]: -50 },
    ath_date: { [currencyKey]: '2021-11-10T14:24:11.849Z' },
    atl: { [currencyKey]: fallbackCrypto.current_price * multiplier * 0.1 },
    atl_change_percentage: { [currencyKey]: 900 },
    atl_date: { [currencyKey]: '2020-03-13T02:31:55.607Z' },
  };

  return {
    ...fallbackBase,
    market_data: marketData,
    last_updated: new Date().toISOString(),
  } as CoinDetail;
}

/**
 * Fetch detailed information for a specific coin
 */
export async function fetchCoinDetail(
  coinId: string,
  currency: Currency = 'USD',
): Promise<CoinDetail> {
  try {
    // Add delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      {
        next: { revalidate: 300 }, // 5 minutes cache
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CryptoPrices/1.0',
        },
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Rate limit exceeded for coin detail, using fallback data');

        return generateFallbackCoinDetail(coinId, currency);
      }
      if (response.status === 404) {
        throw new Error('Coin not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // If the requested currency is not USD and not available in the response,
    // we need to handle currency conversion or fallback
    if (currency !== 'USD' && data.market_data) {
      const currencyKey = currency.toLowerCase();

      // Check if the currency data exists in the response
      if (!data.market_data.current_price[currencyKey]) {
        console.warn(`Currency ${currency} not available for ${coinId}, using fallback conversion`);

        // Apply currency conversion using our multipliers
        const multipliers = {
          USD: 1,
          EUR: 0.85,
          CLP: 850,
        };

        const multiplier = multipliers[currency] || 1;
        const usdPrice = data.market_data.current_price.usd;

        if (usdPrice) {
          // Add the converted price to the market data
          data.market_data.current_price[currencyKey] = usdPrice * multiplier;

          // Also convert other relevant fields
          if (data.market_data.market_cap?.usd) {
            data.market_data.market_cap[currencyKey] = data.market_data.market_cap.usd * multiplier;
          }
          if (data.market_data.total_volume?.usd) {
            data.market_data.total_volume[currencyKey] =
              data.market_data.total_volume.usd * multiplier;
          }
          if (data.market_data.ath?.usd) {
            data.market_data.ath[currencyKey] = data.market_data.ath.usd * multiplier;
          }
          if (data.market_data.atl?.usd) {
            data.market_data.atl[currencyKey] = data.market_data.atl.usd * multiplier;
          }
        }
      }
    }

    return data;
  } catch (error) {
    console.error(`Error fetching coin detail for ${coinId}:`, error);

    // For rate limiting or other API errors, try to provide fallback data
    if (
      error instanceof Error &&
      (error.message.includes('Rate limit') ||
        error.message.includes('fetch') ||
        error.message.includes('network'))
    ) {
      console.warn(`Using fallback data for ${coinId} due to API error`);
      try {
        return generateFallbackCoinDetail(coinId, currency);
      } catch (fallbackError) {
        console.error(`No fallback data available for ${coinId}:`, fallbackError);
      }
    }

    throw error;
  }
}

/**
 * Fetch market chart data for a specific coin
 */
export async function fetchMarketChart(
  coinId: string,
  currency: Currency = 'USD',
  days: TimeFrame = '7',
): Promise<MarketChartData> {
  try {
    // Add delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));

    // For 1-day data, we need to use a different approach
    let url: string;

    if (days === '1') {
      // For 1-day data, use hourly interval and ensure we get enough data points
      url = `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=${currency.toLowerCase()}&days=1&interval=hourly`;
    } else {
      // For other timeframes, use daily interval
      url = `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=${currency.toLowerCase()}&days=${days}&interval=daily`;
    }

    const response = await fetch(url, {
      next: { revalidate: 300 }, // 5 minutes cache
      headers: {
        Accept: 'application/json',
        'User-Agent': 'CryptoPrices/1.0',
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Rate limit exceeded for market chart, using fallback data');

        return generateFallbackChartData(coinId, currency, days);
      }
      if (response.status === 404) {
        throw new Error('Coin not found');
      }
      if (response.status === 401) {
        console.warn('API authentication failed, using fallback chart data');

        return generateFallbackChartData(coinId, currency, days);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching market chart for ${coinId}:`, error);

    // For any fetch errors (network, rate limiting, etc.), provide fallback data
    if (
      error instanceof Error &&
      (error.message.includes('Failed to fetch') ||
        error.message.includes('Rate limit') ||
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('TypeError'))
    ) {
      console.warn(`Using fallback chart data for ${coinId} due to API error:`, error.message);

      return generateFallbackChartData(coinId, currency, days);
    }

    // For other errors, still provide fallback data to prevent app crashes
    console.warn('Using fallback chart data due to unknown error');

    return generateFallbackChartData(coinId, currency, days);
  }
}

/**
 * Generate fallback chart data when API is unavailable
 */
function generateFallbackChartData(
  coinId: string,
  currency: Currency,
  days: TimeFrame,
): MarketChartData {
  const now = Date.now();
  const daysNum = parseInt(days);
  const dataPoints = days === '1' ? 24 : Math.min(daysNum, 30); // Limit data points
  const interval = days === '1' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1 hour or 1 day

  // Base prices for common coins (in USD)
  const basePrices: Record<string, number> = {
    bitcoin: 45000,
    ethereum: 2500,
    binancecoin: 300,
    solana: 100,
    cardano: 0.5,
    ripple: 0.52,
    dogecoin: 0.08,
    'usd-coin': 1,
    'staked-ether': 2500,
  };

  const basePrice = basePrices[coinId] || 1000; // Default price if coin not found

  // Currency multipliers
  const multipliers = {
    USD: 1,
    EUR: 0.85,
    CLP: 850,
  };

  const multiplier = multipliers[currency] || 1;
  const adjustedBasePrice = basePrice * multiplier;

  const prices: [number, number][] = [];
  const market_caps: [number, number][] = [];
  const total_volumes: [number, number][] = [];

  for (let i = 0; i < dataPoints; i++) {
    const timestamp = now - (dataPoints - 1 - i) * interval;

    // Generate realistic price variations (±5%)
    const variation = (Math.random() - 0.5) * 0.1; // ±5%
    const price = adjustedBasePrice * (1 + variation);

    // Estimate market cap and volume based on price
    const marketCap = price * 19000000; // Approximate circulating supply
    const volume = marketCap * 0.05; // Approximate 5% daily volume

    prices.push([timestamp, price]);
    market_caps.push([timestamp, marketCap]);
    total_volumes.push([timestamp, volume]);
  }

  return {
    prices,
    market_caps,
    total_volumes,
  };
}

/**
 * Transform market chart data into a more usable format
 */
export function transformChartData(
  marketData: MarketChartData,
  timeFrame: TimeFrame,
): ChartDataPoint[] {
  const { prices, market_caps, total_volumes } = marketData;

  return prices.map(([timestamp, price], index) => ({
    timestamp,
    price,
    market_cap: market_caps[index]?.[1] || 0,
    volume: total_volumes[index]?.[1] || 0,
    date: formatChartDate(timestamp, timeFrame),
  }));
}

/**
 * Format date for chart display based on timeframe
 */
function formatChartDate(timestamp: number, timeFrame: TimeFrame): string {
  const date = new Date(timestamp);

  switch (timeFrame) {
    case '1':
      // For 1-day chart, show time in 12-hour format
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    case '7':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    case '30':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    case '365':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    default:
      return date.toLocaleDateString();
  }
}
