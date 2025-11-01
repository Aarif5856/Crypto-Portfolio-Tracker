import type { ExchangeAccountRef, PortfolioPosition } from '@cpt/shared';

export async function fetchExchangeBalances(_account: ExchangeAccountRef): Promise<PortfolioPosition[]> {
  // TODO: Implement per-exchange connectors. This is a stub.
  return [];
}

