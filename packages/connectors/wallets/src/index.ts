import type { PortfolioPosition } from '@cpt/shared';

export async function fetchWalletBalances(_address: string): Promise<PortfolioPosition[]> {
  // TODO: Implement per-chain wallet balance readers. This is a stub.
  return [];
}

