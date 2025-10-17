import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getMultipleTokenPrices } from '../utils/coingecko';

const TopMovers = () => {
  const [topMovers, setTopMovers] = useState([]);
  const [loading, setLoading] = useState(true);

  const popularTokens = [
    { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin' },
    { symbol: 'ETH', name: 'Ethereum', id: 'ethereum' },
    { symbol: 'BNB', name: 'BNB', id: 'binancecoin' },
    { symbol: 'ADA', name: 'Cardano', id: 'cardano' },
    { symbol: 'SOL', name: 'Solana', id: 'solana' },
    { symbol: 'MATIC', name: 'Polygon', id: 'matic-network' },
    { symbol: 'DOT', name: 'Polkadot', id: 'polkadot' },
    { symbol: 'AVAX', name: 'Avalanche', id: 'avalanche-2' },
  ];

  useEffect(() => {
    const fetchTopMovers = async () => {
      try {
        setLoading(true);
        // Note: This is a simplified version - in production you'd use proper API calls
        const prices = {};
        
        // Use fallback data since we're not making real API calls
        const movers = [
          { symbol: 'BTC', name: 'Bitcoin', price: 43250, change24h: 2.5, isPositive: true },
          { symbol: 'ETH', name: 'Ethereum', price: 2650, change24h: -1.2, isPositive: false },
          { symbol: 'SOL', name: 'Solana', price: 98, change24h: 5.8, isPositive: true },
          { symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: -0.8, isPositive: false },
          { symbol: 'MATIC', name: 'Polygon', price: 0.85, change24h: 3.2, isPositive: true },
        ];

        setTopMovers(movers);
      } catch (error) {
        console.error('Error fetching top movers:', error);
        // Fallback data
        setTopMovers([
          { symbol: 'BTC', name: 'Bitcoin', price: 43250, change24h: 2.5, isPositive: true },
          { symbol: 'ETH', name: 'Ethereum', price: 2650, change24h: -1.2, isPositive: false },
          { symbol: 'SOL', name: 'Solana', price: 98, change24h: 5.8, isPositive: true },
          { symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: -0.8, isPositive: false },
          { symbol: 'MATIC', name: 'Polygon', price: 0.85, change24h: 3.2, isPositive: true },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovers();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Movers</h3>
          <TrendingUp className="w-5 h-5 text-primary-500" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Movers</h3>
        <TrendingUp className="w-5 h-5 text-primary-500" />
      </div>
      <div className="space-y-3">
        {topMovers.map((token, index) => (
          <div key={token.symbol} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {token.symbol.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{token.symbol}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{token.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-white">
                ${token.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                token.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {token.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                <span>{Math.abs(token.change24h).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopMovers;

