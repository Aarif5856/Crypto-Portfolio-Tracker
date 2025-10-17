import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { getPortfolioData } from '../utils/portfolio';
import { formatCurrency, formatPercentage } from '../utils/portfolio';

const PortfolioOverview = () => {
  const { provider, account, isConnected } = useWallet();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolioData = async () => {
    if (!provider || !account) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getPortfolioData(provider, account);
      setPortfolioData(data);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchPortfolioData();
    } else {
      setPortfolioData(null);
    }
  }, [isConnected, account]);

  if (!isConnected) {
    return (
      <div className="card text-center py-12">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Connect your wallet to view your portfolio overview
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card text-center py-12">
        <RefreshCw className="w-8 h-8 text-primary-500 mx-auto mb-4 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400">Loading portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <div className="text-red-500 mb-4">
          <TrendingDown className="w-8 h-8 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Error Loading Portfolio
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchPortfolioData}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!portfolioData || portfolioData.tokens.length === 0) {
    return (
      <div className="card text-center py-12">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Tokens Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Your wallet doesn't contain any supported tokens
        </p>
      </div>
    );
  }

  const { tokens, totalValueUSD, totalValueFormatted } = portfolioData;

  // Calculate 24h change (simplified - in real app, you'd track this over time)
  const totalChange24h = tokens.reduce((sum, token) => {
    return sum + (token.valueUSD * (token.change24h || 0) / 100);
  }, 0);
  const totalChangePercentage = totalValueUSD > 0 ? (totalChange24h / totalValueUSD) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Total Portfolio Value */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio Value
          </h2>
          <button
            onClick={fetchPortfolioData}
            disabled={loading}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {totalValueFormatted}
          </div>
          <div className={`flex items-center justify-center space-x-1 ${
            totalChangePercentage >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {totalChangePercentage >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {formatPercentage(totalChangePercentage)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              (24h)
            </span>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Tokens ({tokens.length})
        </h3>
        
        <div className="space-y-3">
          {tokens.map((token) => (
            <div
              key={token.address}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {token.symbol.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {token.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {token.symbol}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(token.valueUSD)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {parseFloat(token.balanceFormatted).toFixed(6)} {token.symbol}
                </div>
                {token.change24h !== undefined && (
                  <div className={`text-xs ${
                    token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(token.change24h)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;

