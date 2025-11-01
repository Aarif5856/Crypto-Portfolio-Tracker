export type PriceQuote = {
  symbol: string;
  currency: string;
  price: number;
  asOf: string; // ISO timestamp
};

export type ExchangeAccountRef = {
  provider: string; // e.g., binance, coinbase
  externalId: string;
  label?: string;
};

export type PortfolioPosition = {
  asset: string; // e.g., BTC
  quantity: number;
};

export const ok = <T>(value: T) => ({ ok: true as const, value });
export const err = <E>(error: E) => ({ ok: false as const, error });
export type Result<T, E> = ReturnType<typeof ok<T>> | ReturnType<typeof err<E>>;

