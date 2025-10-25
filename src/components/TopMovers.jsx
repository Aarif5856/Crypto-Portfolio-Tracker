import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { getCoinMarketData } from '../utils/coingecko';

const DEFAULT_TOKEN_IDS = [
  'bitcoin',
  'ethereum',
  'binancecoin',
  'cardano',
  'solana',
  'matic-network',
  'polkadot',
  'avalanche-2',
  'chainlink',
];

const TOP_MOVERS_CACHE_KEY = 'top-movers-cache';

const TopMovers = () => {
  const [topMovers, setTopMovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cached = localStorage.getItem(TOP_MOVERS_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setTopMovers(parsed.data || []);
        setLastUpdated(parsed.updatedAt || null);
        setLoading(false);
      } catch {
        setTopMovers([]);
      }
    }
  }, []);

  const fetchTopMovers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const marketData = await getCoinMarketData(DEFAULT_TOKEN_IDS);
      const ranked = [...marketData]
        .sort(
          (a, b) =>
            (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0)
        )
        .slice(0, 5);
      setTopMovers(ranked);
      const timestamp = Date.now();
      setLastUpdated(timestamp);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          TOP_MOVERS_CACHE_KEY,
          JSON.stringify({ data: ranked, updatedAt: timestamp })
        );
      }
    } catch (err) {
      console.error('Error fetching top movers:', err);
      setError('Unable to refresh top movers. Showing cached data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopMovers();
    const interval = window.setInterval(fetchTopMovers, 60000);
    return () => window.clearInterval(interval);
  }, [fetchTopMovers]);

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Movers</h3>
        <button
          onClick={fetchTopMovers}
          className="rounded-lg p-2 text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/20"
          aria-label="Refresh top movers"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-yellow-300 bg-yellow-50 p-2 text-xs text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
          {error}
        </div>
      )}

      {lastUpdated && topMovers.length > 0 && (
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Last updated {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {topMovers.map((coin) => {
            const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;
            return (
              <div
                key={coin.id}
                className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-bold text-white">
                    {coin.symbol?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{coin.symbol?.toUpperCase()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{coin.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">
                    ${coin.current_price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`flex items-center justify-end space-x-1 text-sm ${
                      isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    <span>
                      {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopMovers;
