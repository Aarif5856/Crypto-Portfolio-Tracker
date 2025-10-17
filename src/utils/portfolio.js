import { ethers } from 'ethers';
import { getMultipleTokenPrices, getETHPrice } from './coingecko';

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
export const POPULAR_TOKENS = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    isNative: true,
  },
  {
    address: '0xA0b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    isNative: false,
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether',
    decimals: 6,
    isNative: false,
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    isNative: false,
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    isNative: false,
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    isNative: false,
  },
  {
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    isNative: false,
  },
  {
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    isNative: false,
  },
];

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
export const getPortfolioData = async (provider, userAddress) => {
  try {
    const portfolio = [];
    let totalValueUSD = 0;

    // Get ETH price first
    const ethPriceData = await getETHPrice();
    const ethPrice = ethPriceData.price;

    // Check each popular token
    for (const token of POPULAR_TOKENS) {
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
          // ETH
          priceUSD = ethPrice;
          change24h = ethPriceData.change24h;
        } else {
          // ERC-20 tokens
          try {
            const priceData = await getMultipleTokenPrices([token.address]);
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



