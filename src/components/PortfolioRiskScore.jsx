import React, { useMemo } from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const DEFAULT_METRICS = {
  score: 0,
  level: 'Low',
  recommendations: ['Connect your wallet to generate a risk profile'],
};

// Derive a simple risk signal from portfolio distribution and size.
const deriveRiskMetrics = (totalValue, tokens) => {
  if (!totalValue || !tokens.length) {
    return DEFAULT_METRICS;
  }

  let score = 0;
  const tips = [];

  const findValue = (symbol) =>
    tokens.find((token) => token.symbol?.toUpperCase() === symbol)?.valueUSD || 0;

  // Factor 1: portfolio concentration (0-40 points)
  const ethValue = findValue('ETH');
  const ethRatio = totalValue > 0 ? (ethValue / totalValue) * 100 : 0;
  if (ethRatio > 80) {
    score += 40;
    tips.push('High ETH concentration - consider diversifying.');
  } else if (ethRatio > 60) {
    score += 25;
    tips.push('Moderate ETH concentration - mix in additional assets.');
  } else if (ethRatio < 20) {
    score += 10;
    tips.push('Low ETH exposure - ensure you hold a core asset position.');
  }

  // Factor 2: token diversity (0-30 points)
  const diversifiedCount = tokens.filter((token) => token.balance > 0).length;
  if (diversifiedCount === 1) {
    score += 25;
    tips.push('Single token portfolio - high directional risk.');
  } else if (diversifiedCount < 3) {
    score += 15;
    tips.push('Limited diversification - add more tokens to balance risk.');
  } else if (diversifiedCount >= 5) {
    score += 5;
    tips.push('Good diversification across assets.');
  }

  // Factor 3: portfolio size (0-20 points)
  if (totalValue < 100) {
    score += 20;
    tips.push('Small portfolios can be more volatile - rebalance frequently.');
  } else if (totalValue < 1000) {
    score += 10;
    tips.push('Medium portfolio - keep an eye on position sizing.');
  } else {
    tips.push('Healthy portfolio size - maintain disciplined risk controls.');
  }

  // Factor 4: stablecoin buffer (0-10 points)
  const stableValue = tokens
    .filter((token) => ['USDC', 'USDT', 'DAI'].includes(token.symbol?.toUpperCase()))
    .reduce((sum, token) => sum + (token.valueUSD || 0), 0);
  const stableRatio = totalValue > 0 ? (stableValue / totalValue) * 100 : 0;
  if (stableRatio < 5) {
    score += 10;
    tips.push('Consider holding a stablecoin buffer for volatility.');
  } else if (stableRatio > 30) {
    tips.push('Great job keeping dry powder in stablecoins.');
  }

  const clampedScore = Math.min(score, 100);
  let level = 'Low';
  if (clampedScore > 75) level = 'Very High';
  else if (clampedScore > 50) level = 'High';
  else if (clampedScore > 25) level = 'Medium';

  return {
    score: clampedScore,
    level,
    recommendations: tips,
  };
};

const PortfolioRiskScore = ({ portfolioQuery }) => {
  const { isConnected } = useWallet();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = portfolioQuery ?? {
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    refetch: () => {},
    isFetching: false,
  };

  const tokens = useMemo(() => data?.tokens ?? [], [data]);
  const totalValueUSD = data?.totalValueUSD ?? 0;
  const metrics = useMemo(() => deriveRiskMetrics(totalValueUSD, tokens), [totalValueUSD, tokens]);

  const getRiskColor = () => {
    if (metrics.score <= 25) return 'text-green-600 dark:text-green-400';
    if (metrics.score <= 50) return 'text-yellow-600 dark:text-yellow-400';
    if (metrics.score <= 75) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskBgColor = () => {
    if (metrics.score <= 25) return 'bg-green-100 dark:bg-green-900/20';
    if (metrics.score <= 50) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (metrics.score <= 75) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getRiskIcon = () => {
    if (metrics.score <= 25) return <CheckCircle className="w-5 h-5" />;
    if (metrics.score <= 50) return <Shield className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  if (!isConnected) {
    return (
      <div className="card text-center">
        <Shield className="mx-auto mb-3 h-10 w-10 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connect to assess risk</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Link your wallet to see diversification tips and a live risk score.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card flex flex-col items-center py-10 text-gray-600 dark:text-gray-400">
        <RefreshCw className="mb-3 h-6 w-6 animate-spin text-primary-500" />
        <p className="text-sm">Calculating risk profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card text-center">
        <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Unable to compute risk</h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{String(error)}</p>
        <button
          onClick={() => refetch()}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          <span>Try again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white">
          <BarChart3 className="h-5 w-5 text-primary-500" />
          <span>Risk Score</span>
        </h3>
        <div className={`rounded-full px-2 py-1 text-xs font-medium ${getRiskBgColor()} ${getRiskColor()}`}>
          {metrics.level}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Portfolio Risk</span>
          <span className={`text-lg font-bold ${getRiskColor()}`}>{metrics.score}/100</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              metrics.score <= 25
                ? 'bg-green-500'
                : metrics.score <= 50
                ? 'bg-yellow-500'
                : metrics.score <= 75
                ? 'bg-orange-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${metrics.score}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          {getRiskIcon()}
          <span>
            Risk Level:{' '}
            <span className={`font-medium ${getRiskColor()}`}>{metrics.level}</span>
          </span>
        </div>

        {metrics.recommendations.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Recommendations</h4>
            <ul className="space-y-1">
              {metrics.recommendations.map((tip, index) => (
                <li
                  key={`${tip}-${index}`}
                  className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500"></div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="h-4 w-4" />
            <span>
              Portfolio Value:{' '}
              {totalValueUSD
                ? `$${totalValueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : '$0'}
            </span>
          </div>
          <div className="mt-1 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <BarChart3 className="h-4 w-4" />
            <span>Active Tokens: {tokens.filter((token) => token.balance > 0).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioRiskScore;
