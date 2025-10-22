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
// CoinGecko token id lookup by chainId -> address -> coinId
export const TOKEN_MAP_BY_CHAIN = {
  1: {
    '0x0000000000000000000000000000000000000000': 'ethereum',
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd-coin', // USDC
    '0xdac17f958d2ee523a2206206994597c13d831ec7': 'tether', // USDT
    '0x6b175474e89094c44da98b954eedeac495271d0f': 'dai', // DAI
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'wrapped-bitcoin', // WBTC
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'uniswap', // UNI
    '0x514910771af9ca656af840dff83e8264ecf986ca': 'chainlink', // LINK
  },
  137: {
    '0x0000000000000000000000000000000000000000': 'matic-network', // Native MATIC
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': 'usd-coin', // USDC (Polygon)
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f': 'tether', // USDT (Polygon)
    '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063': 'dai', // DAI (Polygon)
  },
  56: {
    '0x0000000000000000000000000000000000000000': 'binancecoin', // Native BNB
    '0x55d398326f99059ff775485246999027b3197955': 'tether', // USDT (BSC)
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': 'usd-coin', // USDC (BSC)
    '0xe9e7cea3dedca5984780bafc599bd69add087d56': 'binance-usd', // BUSD (BSC)
  },
};

// Get token price by contract address
export const getTokenPrice = async (contractAddress, chainId = 1) => {
  try {
    const map = TOKEN_MAP_BY_CHAIN[chainId] || TOKEN_MAP_BY_CHAIN[1];
    const coinId = map[contractAddress.toLowerCase()];
    
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
export const getMultipleTokenPrices = async (contractAddresses, chainId = 1) => {
  try {
    const map = TOKEN_MAP_BY_CHAIN[chainId] || TOKEN_MAP_BY_CHAIN[1];
    // Normalize addresses to lowercase for consistent lookups
    const lowerAddrs = (contractAddresses || []).map(a => a.toLowerCase());
    const coinIds = lowerAddrs
      .map(addr => map[addr])
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
    Object.entries(map).forEach(([address, coinId]) => {
      if (lowerAddrs.includes(address.toLowerCase()) && response.data[coinId]) {
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
  'matic-network': { price: 1, change24h: 0, volume24h: 0, marketCap: 0 },
  binancecoin: { price: 300, change24h: 0, volume24h: 0, marketCap: 0 },
  'usd-coin': { price: 1, change24h: 0, volume24h: 0, marketCap: 0 },
  tether: { price: 1, change24h: 0, volume24h: 0, marketCap: 0 },
  dai: { price: 1, change24h: 0, volume24h: 0, marketCap: 0 },
  'wrapped-bitcoin': { price: 50000, change24h: 0, volume24h: 0, marketCap: 0 },
  uniswap: { price: 10, change24h: 0, volume24h: 0, marketCap: 0 },
  chainlink: { price: 15, change24h: 0, volume24h: 0, marketCap: 0 },
};

// Get ETH price
export const getNativePrice = async (chainId = 1) => {
  try {
    const id = chainId === 137 ? 'matic-network' : chainId === 56 ? 'binancecoin' : 'ethereum';
    const response = await coingeckoAPI.get(`/simple/price`, {
      params: {
        ids: id,
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_24hr_vol: true,
        include_market_cap: true,
      },
    });

    const priceData = {
      price: response.data[id].usd,
      change24h: response.data[id].usd_24h_change,
      volume24h: response.data[id].usd_24h_vol,
      marketCap: response.data[id].usd_market_cap,
    };

    // Update fallback data
    fallbackPrices[id] = priceData;
    return priceData;
  } catch (error) {
    console.error('Error fetching native asset price, using fallback:', error);
    const id = chainId === 137 ? 'matic-network' : chainId === 56 ? 'binancecoin' : 'ethereum';
    return fallbackPrices[id];
  }
};

// Backward compatible alias
export const getETHPrice = () => getNativePrice(1);

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
