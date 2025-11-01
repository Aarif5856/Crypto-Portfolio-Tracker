import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { formatCurrency, formatPercentage } from '../utils/portfolio';

const PortfolioOverview = ({ portfolioQuery }) => {
  const { isConnected } = useWallet();
  const {
    data: portfolioData,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = portfolioQuery ?? {
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    refetch: () => {},
  };

  // Show connect prompt only if no data is available
  if (!isConnected && !(portfolioData && portfolioData.tokens && portfolioData.tokens.length > 0)) {
    return (
      <div className="card text-center py-12">
        <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">Connect or add addresses to view your portfolio overview</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card text-center py-12">
        <RefreshCw className="w-8 h-8 text-primary-500 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card text-center py-12">
        <div className="text-red-500 mb-4">
          <TrendingDown className="w-8 h-8 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Error Loading Portfolio
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{String(error)}</p>
        <button
          onClick={() => refetch()}
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
        <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Tokens Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
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
            onClick={() => refetch()}
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
            <span className="text-sm text-gray-600 dark:text-gray-400">
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
        
        <div className="space-y-2 sm:space-y-3">
          {tokens.map((token) => (
            <div
              key={token.address}
              className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs sm:text-sm">
                    {token.symbol.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                    {token.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {token.symbol}
                  </div>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0 ml-2">
                <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                  {formatCurrency(token.valueUSD)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {parseFloat(token.balanceFormatted).toFixed(4)} {token.symbol}
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
