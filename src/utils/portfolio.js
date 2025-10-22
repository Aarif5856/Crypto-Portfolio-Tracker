import { ethers } from 'ethers';
import { getMultipleTokenPrices, getNativePrice } from './coingecko';

// Common ERC-20 token ABI for balance checking
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  }
];

// Popular token contracts on Ethereum mainnet
export const POPULAR_TOKENS_BY_CHAIN = {
  1: [
    { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', name: 'Ethereum', decimals: 18, isNative: true },
    { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', symbol: 'USDC', name: 'USD Coin', decimals: 6, isNative: false },
    { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', name: 'Tether', decimals: 6, isNative: false },
    { address: '0x6b175474e89094c44da98b954eedeac495271d0f', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, isNative: false },
    { address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8, isNative: false },
    { address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', symbol: 'UNI', name: 'Uniswap', decimals: 18, isNative: false },
    { address: '0x514910771af9ca656af840dff83e8264ecf986ca', symbol: 'LINK', name: 'Chainlink', decimals: 18, isNative: false },
  ],
  137: [
    { address: '0x0000000000000000000000000000000000000000', symbol: 'MATIC', name: 'Polygon', decimals: 18, isNative: true },
    { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC', name: 'USD Coin', decimals: 6, isNative: false },
    { address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', symbol: 'USDT', name: 'Tether', decimals: 6, isNative: false },
    { address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, isNative: false },
  ],
  56: [
    { address: '0x0000000000000000000000000000000000000000', symbol: 'BNB', name: 'BNB', decimals: 18, isNative: true },
    { address: '0x55d398326f99059ff775485246999027b3197955', symbol: 'USDT', name: 'Tether', decimals: 18, isNative: false },
    { address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', symbol: 'USDC', name: 'USD Coin', decimals: 18, isNative: false },
    { address: '0xe9e7cea3dedca5984780bafc599bd69add087d56', symbol: 'BUSD', name: 'Binance USD', decimals: 18, isNative: false },
  ],
};

// Get token balance
export const getTokenBalance = async (provider, tokenAddress, userAddress, decimals = 18) => {
  try {
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      // ETH balance
      const balance = await provider.getBalance(userAddress);
      return ethers.formatEther(balance);
    } else {
      // ERC-20 token balance
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const balance = await contract.balanceOf(userAddress);
      return ethers.formatUnits(balance, decimals);
    }
  } catch (error) {
    console.error(`Error fetching balance for token ${tokenAddress}:`, error);
    return '0';
  }
};

// Get token info (name, symbol, decimals)
export const getTokenInfo = async (provider, tokenAddress) => {
  try {
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      return {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      };
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
    ]);

    return { name, symbol, decimals };
  } catch (error) {
    console.error(`Error fetching token info for ${tokenAddress}:`, error);
    return {
      name: 'Unknown Token',
      symbol: 'UNKNOWN',
      decimals: 18,
    };
  }
};

// Get portfolio data for a user
export const getPortfolioData = async (provider, userAddress, chainIdInput) => {
  try {
    const portfolio = [];
    let totalValueUSD = 0;

    // Determine chain
    let chainId = chainIdInput;
    if (!chainId) {
      const network = await provider.getNetwork();
      chainId = Number(network.chainId);
    }

    const tokens = POPULAR_TOKENS_BY_CHAIN[chainId] || POPULAR_TOKENS_BY_CHAIN[1];

    // Get native price first
    const nativePriceData = await getNativePrice(chainId);
    const nativePrice = nativePriceData.price;

    // Check each popular token
    for (const token of tokens) {
      const balance = await getTokenBalance(
        provider,
        token.address,
        userAddress,
        token.decimals
      );

      const balanceNumber = parseFloat(balance);
      
      // Only include tokens with non-zero balance
      if (balanceNumber > 0) {
        let priceUSD = 0;
        let change24h = 0;

        if (token.isNative) {
          priceUSD = nativePrice;
          change24h = nativePriceData.change24h;
        } else {
          // ERC-20 tokens
          try {
            const priceData = await getMultipleTokenPrices([token.address], chainId);
            const tokenPriceData = priceData[token.address.toLowerCase()];
            if (tokenPriceData) {
              priceUSD = tokenPriceData.price;
              change24h = tokenPriceData.change24h;
            }
          } catch (error) {
            console.error(`Error fetching price for ${token.symbol}:`, error);
          }
        }

        const valueUSD = balanceNumber * priceUSD;
        totalValueUSD += valueUSD;

        portfolio.push({
          address: token.address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          balance: balanceNumber,
          balanceFormatted: balance,
          priceUSD,
          change24h,
          valueUSD,
          isNative: token.isNative,
        });
      }
    }

    // Sort by value (highest first)
    portfolio.sort((a, b) => b.valueUSD - a.valueUSD);

    return {
      tokens: portfolio,
      totalValueUSD,
      totalValueFormatted: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(totalValueUSD),
    };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw error;
  }
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value, decimals = 2) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

// Format large numbers
export const formatLargeNumber = (num) => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toFixed(2);
};



