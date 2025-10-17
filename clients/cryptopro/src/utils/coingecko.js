import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Create axios instance with default config
const coingeckoAPI = axios.create({
  baseURL: COINGECKO_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Rate limiting and retry logic
let requestCount = 0;
let lastRequestTime = 0;
const RATE_LIMIT = 50; // requests per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute in ms

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const checkRateLimit = async () => {
  const now = Date.now();
  
  // Reset counter if window has passed
  if (now - lastRequestTime > RATE_LIMIT_WINDOW) {
    requestCount = 0;
    lastRequestTime = now;
  }
  
  // If we've hit the rate limit, wait
  if (requestCount >= RATE_LIMIT) {
    const waitTime = RATE_LIMIT_WINDOW - (now - lastRequestTime);
    if (waitTime > 0) {
      console.warn(`Rate limit reached. Waiting ${waitTime}ms...`);
      await delay(waitTime);
      requestCount = 0;
      lastRequestTime = Date.now();
    }
  }
  
  requestCount++;
};

// Add request interceptor for rate limiting
coingeckoAPI.interceptors.request.use(async (config) => {
  await checkRateLimit();
  return config;
});

// Add response interceptor for error handling
coingeckoAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      console.warn('Rate limited by CoinGecko API. Retrying after delay...');
      await delay(5000); // Wait 5 seconds before retry
      return coingeckoAPI.request(error.config);
    }
    return Promise.reject(error);
  }
);

// Common token addresses and their CoinGecko IDs
export const TOKEN_MAP = {
  // Ethereum
  '0x0000000000000000000000000000000000000000': 'ethereum',
  
  // Popular ERC-20 tokens
  '0xA0b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4': 'usd-coin', // USDC
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': 'tether', // USDT
  '0x6B175474E89094C44Da98b954EedeAC495271d0F': 'dai', // DAI
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 'wrapped-bitcoin', // WBTC
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984': 'uniswap', // UNI
  '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0': 'matic-network', // MATIC
  '0x514910771AF9Ca656af840dff83E8264EcF986CA': 'chainlink', // LINK
  '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2': 'maker', // MKR
  '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942': 'decentraland', // MANA
  '0x4Fabb145d64652a948d72533023f6E7A623C7C53': 'binance-usd', // BUSD
};

// Get token price by contract address
export const getTokenPrice = async (contractAddress) => {
  try {
    const coinId = TOKEN_MAP[contractAddress.toLowerCase()];
    
    if (!coinId) {
      throw new Error(`Token not supported: ${contractAddress}`);
    }

    const response = await coingeckoAPI.get(`/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_24hr_vol: true,
        include_market_cap: true,
      },
    });

    return {
      price: response.data[coinId].usd,
      change24h: response.data[coinId].usd_24h_change,
      volume24h: response.data[coinId].usd_24h_vol,
      marketCap: response.data[coinId].usd_market_cap,
    };
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
  }
};

// Get multiple token prices
export const getMultipleTokenPrices = async (contractAddresses) => {
  try {
    const coinIds = contractAddresses
      .map(addr => TOKEN_MAP[addr.toLowerCase()])
      .filter(Boolean);

    if (coinIds.length === 0) {
      return {};
    }

    const response = await coingeckoAPI.get(`/simple/price`, {
      params: {
        ids: coinIds.join(','),
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_24hr_vol: true,
        include_market_cap: true,
      },
    });

    // Map back to contract addresses
    const result = {};
    Object.entries(TOKEN_MAP).forEach(([address, coinId]) => {
      if (contractAddresses.includes(address.toLowerCase()) && response.data[coinId]) {
        result[address.toLowerCase()] = {
          price: response.data[coinId].usd,
          change24h: response.data[coinId].usd_24h_change,
          volume24h: response.data[coinId].usd_24h_vol,
          marketCap: response.data[coinId].usd_market_cap,
        };
      }
    });

    return result;
  } catch (error) {
    console.error('Error fetching multiple token prices:', error);
    throw error;
  }
};

// Fallback price data (cached from last successful request)
let fallbackPrices = {
  ethereum: { price: 2000, change24h: 0, volume24h: 0, marketCap: 0 },
  'usd-coin': { price: 1, change24h: 0, volume24h: 0, marketCap: 0 },
  tether: { price: 1, change24h: 0, volume24h: 0, marketCap: 0 },
  dai: { price: 1, change24h: 0, volume24h: 0, marketCap: 0 },
  'wrapped-bitcoin': { price: 50000, change24h: 0, volume24h: 0, marketCap: 0 },
  uniswap: { price: 10, change24h: 0, volume24h: 0, marketCap: 0 },
  'matic-network': { price: 1, change24h: 0, volume24h: 0, marketCap: 0 },
  chainlink: { price: 15, change24h: 0, volume24h: 0, marketCap: 0 },
};

// Get ETH price
export const getETHPrice = async () => {
  try {
    const response = await coingeckoAPI.get(`/simple/price`, {
      params: {
        ids: 'ethereum',
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_24hr_vol: true,
        include_market_cap: true,
      },
    });

    const priceData = {
      price: response.data.ethereum.usd,
      change24h: response.data.ethereum.usd_24h_change,
      volume24h: response.data.ethereum.usd_24h_vol,
      marketCap: response.data.ethereum.usd_market_cap,
    };

    // Update fallback data
    fallbackPrices.ethereum = priceData;
    return priceData;
  } catch (error) {
    console.error('Error fetching ETH price, using fallback:', error);
    return fallbackPrices.ethereum;
  }
};

// Get trending coins
export const getTrendingCoins = async () => {
  try {
    const response = await coingeckoAPI.get('/search/trending');
    return response.data.coins.map(coin => ({
      id: coin.item.id,
      name: coin.item.name,
      symbol: coin.item.symbol,
      thumb: coin.item.thumb,
      market_cap_rank: coin.item.market_cap_rank,
    }));
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw error;
  }
};

// Get global market data
export const getGlobalMarketData = async () => {
  try {
    const response = await coingeckoAPI.get('/global');
    return {
      totalMarketCap: response.data.data.total_market_cap.usd,
      totalVolume: response.data.data.total_volume.usd,
      activeCryptocurrencies: response.data.data.active_cryptocurrencies,
      marketCapChange24h: response.data.data.market_cap_change_percentage_24h_usd,
    };
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw error;
  }
};

