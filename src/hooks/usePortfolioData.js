import { useQuery } from '@tanstack/react-query';
import { useWallet } from '../context/WalletContext';
import { getPortfolioData } from '../utils/portfolio';

/**
 * Shared portfolio query so multiple widgets reuse the same fetch and cache.
 */
export const usePortfolioData = () => {
  const { provider, account, chainId, isConnected } = useWallet();

  return useQuery({
    queryKey: ['portfolio', account, chainId],
    queryFn: () => getPortfolioData(provider, account, chainId),
    enabled: Boolean(isConnected && provider && account),
    refetchInterval: 30000,
    staleTime: 15000,
  });
};
