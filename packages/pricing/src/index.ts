import { getCoingeckoPrice } from './providers/coingecko.js';

export async function getPrice(symbolOrId: string, vsCurrency = 'usd'): Promise<number | null> {
  const provider = (process.env.PRICING_PROVIDER || 'coingecko').toLowerCase();
  switch (provider) {
    case 'coingecko':
    default:
      return getCoingeckoPrice(symbolOrId, vsCurrency);
  }
}

