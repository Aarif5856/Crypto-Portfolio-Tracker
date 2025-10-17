import React, { useState, useEffect } from 'react';
import { Plus, Star, Trash2, Eye } from 'lucide-react';
import { getMultipleTokenPrices } from '../utils/coingecko';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newToken, setNewToken] = useState('');

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crypto-watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('crypto-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch prices for watchlist tokens
  useEffect(() => {
    if (watchlist.length === 0) return;

    const fetchPrices = async () => {
      setLoading(true);
      try {
        // Use fallback data since we're not making real API calls
        const fallbackPrices = {};
        watchlist.forEach(token => {
          fallbackPrices[token.id] = {
            current_price: Math.random() * 1000 + 10,
            price_change_percentage_24h: (Math.random() - 0.5) * 20
          };
        });
        setPrices(fallbackPrices);
      } catch (error) {
        console.error('Error fetching watchlist prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [watchlist]);

  const addToWatchlist = () => {
    if (!newToken.trim()) return;

    const tokenId = newToken.toLowerCase().trim();
    const tokenSymbol = tokenId.toUpperCase();
    
    // Check if already in watchlist
    if (watchlist.some(token => token.id === tokenId)) {
      alert('Token already in watchlist!');
      return;
    }

    const newTokenObj = {
      id: tokenId,
      symbol: tokenSymbol,
      name: tokenSymbol,
      addedAt: new Date().toISOString()
    };

    setWatchlist(prev => [...prev, newTokenObj]);
    setNewToken('');
    setShowAddForm(false);
  };

  const removeFromWatchlist = (tokenId) => {
    setWatchlist(prev => prev.filter(token => token.id !== tokenId));
  };

  const formatPrice = (price) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span>My Watchlist</span>
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter token symbol (e.g., BTC, ETH)"
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
            />
            <button
              onClick={addToWatchlist}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {watchlist.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No tokens in watchlist</p>
          <p className="text-sm">Add tokens to track their prices</p>
        </div>
      ) : (
        <div className="space-y-2">
          {watchlist.map((token) => {
            const priceData = prices[token.id];
            const change24h = priceData?.price_change_percentage_24h || 0;
            const isPositive = change24h > 0;

            return (
              <div key={token.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
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
                        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                        <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    ) : (
                      <>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {priceData ? formatPrice(priceData.current_price) : 'Loading...'}
                        </div>
                        <div className={`text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {priceData ? `${isPositive ? '+' : ''}${change24h.toFixed(2)}%` : ''}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeFromWatchlist(token.id)}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
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

