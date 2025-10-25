import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Star, Trash2, Eye, RefreshCw } from 'lucide-react';
import { getCoinMarketData, searchCoinByQuery } from '../utils/coingecko';

const WATCHLIST_STORAGE_KEY = 'crypto-watchlist';
const WATCHLIST_PRICE_KEY = 'crypto-watchlist-prices';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newToken, setNewToken] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch {
        setWatchlist([]);
      }
    }
    const cached = localStorage.getItem(WATCHLIST_PRICE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPrices(parsed.prices || {});
        setLastUpdated(parsed.updatedAt || null);
      } catch {
        setPrices({});
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const fetchPrices = useCallback(async () => {
    if (watchlist.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const ids = watchlist.map((token) => token.id);
      const marketData = await getCoinMarketData(ids);
      const priceMap = {};
      marketData.forEach((coin) => {
        priceMap[coin.id] = coin;
      });
      setPrices(priceMap);
      const timestamp = Date.now();
      setLastUpdated(timestamp);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          WATCHLIST_PRICE_KEY,
          JSON.stringify({ updatedAt: timestamp, prices: priceMap })
        );
      }
    } catch (err) {
      console.error('Error fetching watchlist prices:', err);
      setError('Unable to refresh prices. Showing the last saved values.');
    } finally {
      setLoading(false);
    }
  }, [watchlist]);

  useEffect(() => {
    if (watchlist.length === 0) return;
    let isMounted = true;

    const refresh = async () => {
      if (!isMounted) return;
      await fetchPrices();
    };

    refresh();
    const interval = window.setInterval(refresh, 30000);
    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [fetchPrices, watchlist.length]);

  const addToWatchlist = async () => {
    if (!newToken.trim()) return;
    setFeedback(null);
    setIsAdding(true);
    try {
      const searchResult = await searchCoinByQuery(newToken.trim());
      if (!searchResult) {
        setFeedback('Token not found. Try a full name such as "Bitcoin" or symbol "BTC".');
        return;
      }
      const exists = watchlist.some((token) => token.id === searchResult.id);
      if (exists) {
        setFeedback('Token already in watchlist.');
        return;
      }
      const newEntry = {
        id: searchResult.id,
        symbol: searchResult.symbol.toUpperCase(),
        name: searchResult.name,
        addedAt: new Date().toISOString(),
      };
      setWatchlist((prev) => [...prev, newEntry]);
      setNewToken('');
      setShowAddForm(false);
      setFeedback(null);
    } catch (err) {
      console.error('Error adding token to watchlist:', err);
      setFeedback('Unable to add token right now. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const removeFromWatchlist = (tokenId) => {
    setWatchlist((prev) => prev.filter((token) => token.id !== tokenId));
    setPrices((prev) => {
      const next = { ...prev };
      delete next[tokenId];
      return next;
    });
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'N/A';
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const formatChange = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>My Watchlist</span>
        </h3>
        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="rounded-lg p-2 text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/20"
          aria-label="Add token to watchlist"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search token name or symbol (e.g., BTC)"
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              className="input flex-1"
              onKeyDown={(e) => e.key === 'Enter' && addToWatchlist()}
              disabled={isAdding}
            />
            <button
              onClick={addToWatchlist}
              disabled={isAdding}
              className="btn-primary flex items-center space-x-2"
            >
              {isAdding && <RefreshCw className="h-4 w-4 animate-spin" />}
              <span>Add</span>
            </button>
          </div>
          {feedback && <p className="mt-2 text-sm text-red-500">{feedback}</p>}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
          {error}
        </div>
      )}

      {lastUpdated && watchlist.length > 0 && (
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Last updated {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      )}

      {watchlist.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <Eye className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p>No tokens in watchlist</p>
          <p className="text-sm">Add a token to start tracking live prices.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {watchlist.map((token) => {
            const priceData = prices[token.id];
            const change24h = priceData?.price_change_percentage_24h ?? 0;
            const isPositive = change24h >= 0;

            return (
              <div
                key={token.id}
                className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-bold text-white">
                    {token.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{token.symbol}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{token.name}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="mb-1 h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    ) : (
                      <>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(priceData?.current_price)}
                        </div>
                        <div
                          className={`text-sm ${
                            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {formatChange(change24h)}
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromWatchlist(token.id)}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Remove ${token.name} from watchlist`}
                  >
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
