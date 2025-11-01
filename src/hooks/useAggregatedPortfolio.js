import { useQuery } from '@tanstack/react-query';
import { useWallet } from '../context/WalletContext';
import { getPortfolioData } from '../utils/portfolio';

export const useAggregatedPortfolio = () => {
  const { provider, chainId, isConnected, account, wallets } = useWallet();

  const addresses = Array.from(
    new Set([
      ...(wallets || []).map((w) => w.address),
      account || undefined,
    ].filter(Boolean))
  );

  return useQuery({
    queryKey: ['agg-portfolio', addresses.join(','), chainId],
    enabled: Boolean(provider && addresses.length),
    staleTime: 15000,
    refetchInterval: 30000,
    queryFn: async () => {
      const results = await Promise.all(
        addresses.map(async (addr) => {
          try {
            const r = await getPortfolioData(provider, addr, chainId);
            return { address: addr, ...r };
          } catch (e) {
            return { address: addr, tokens: [], totalValueUSD: 0 };
          }
        })
      );

      const totalValueUSD = results.reduce((s, r) => s + (r.totalValueUSD || 0), 0);

      // Aggregate tokens by contract address
      const map = new Map();
      for (const r of results) {
        for (const t of r.tokens || []) {
          const key = `${t.address}`;
          if (!map.has(key)) {
            map.set(key, { ...t });
          } else {
            const cur = map.get(key);
            map.set(key, {
              ...cur,
              balance: Number(cur.balance || 0) + Number(t.balance || 0),
              valueUSD: Number(cur.valueUSD || 0) + Number(t.valueUSD || 0),
            });
          }
        }
      }
      const tokens = Array.from(map.values()).sort((a, b) => b.valueUSD - a.valueUSD);

      return {
        addresses,
        tokens,
        totalValueUSD,
        totalValueFormatted: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(totalValueUSD),
        breakdown: results.map((r) => ({ address: r.address, totalValueUSD: r.totalValueUSD })),
      };
    },
  });
};
