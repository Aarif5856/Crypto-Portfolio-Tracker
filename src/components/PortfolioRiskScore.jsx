import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';

const PortfolioRiskScore = ({ portfolioValue, tokenBalances = [] }) => {
  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('Low');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    calculateRiskScore();
  }, [portfolioValue, tokenBalances]);

  const calculateRiskScore = () => {
    let score = 0;
    const recommendations = [];

    // Factor 1: Portfolio Concentration (0-40 points)
    const totalValue = portfolioValue || 0;
    if (totalValue > 0) {
      const ethValue = tokenBalances.find(t => t.symbol === 'ETH')?.valueUSD || 0;
      const ethPercentage = (ethValue / totalValue) * 100;
      
      if (ethPercentage > 80) {
        score += 40;
        recommendations.push('High ETH concentration - consider diversifying');
      } else if (ethPercentage > 60) {
        score += 25;
        recommendations.push('Moderate ETH concentration - consider adding other assets');
      } else if (ethPercentage < 20) {
        score += 10;
        recommendations.push('Low ETH concentration - consider increasing core holdings');
      }
    }

    // Factor 2: Token Diversity (0-30 points)
    const tokenCount = tokenBalances.filter(t => t.balance > 0).length;
    if (tokenCount === 0) {
      score += 30;
      recommendations.push('No tokens detected - connect wallet to analyze');
    } else if (tokenCount === 1) {
      score += 25;
      recommendations.push('Single token portfolio - high risk');
    } else if (tokenCount < 3) {
      score += 15;
      recommendations.push('Limited diversification - consider adding more tokens');
    } else if (tokenCount >= 5) {
      score += 5;
      recommendations.push('Good token diversification');
    }

    // Factor 3: Portfolio Size (0-20 points)
    if (totalValue < 100) {
      score += 20;
      recommendations.push('Small portfolio - higher volatility risk');
    } else if (totalValue < 1000) {
      score += 10;
      recommendations.push('Medium portfolio size');
    } else {
      score += 0;
      recommendations.push('Large portfolio - good risk management');
    }

    // Factor 4: Stablecoin Ratio (0-10 points)
    const stablecoinValue = tokenBalances
      .filter(t => ['USDC', 'USDT', 'DAI'].includes(t.symbol))
      .reduce((sum, t) => sum + (t.valueUSD || 0), 0);
    
    const stablecoinRatio = totalValue > 0 ? (stablecoinValue / totalValue) * 100 : 0;
    
    if (stablecoinRatio > 30) {
      score += 0;
      recommendations.push('Good stablecoin allocation');
    } else if (stablecoinRatio < 5) {
      score += 10;
      recommendations.push('Consider adding stablecoins for stability');
    }

    setRiskScore(Math.min(score, 100));
    setRecommendations(recommendations);

    // Determine risk level
    if (score <= 25) {
      setRiskLevel('Low');
    } else if (score <= 50) {
      setRiskLevel('Medium');
    } else if (score <= 75) {
      setRiskLevel('High');
    } else {
      setRiskLevel('Very High');
    }
  };

  const getRiskColor = () => {
    if (riskScore <= 25) return 'text-green-600 dark:text-green-400';
    if (riskScore <= 50) return 'text-yellow-600 dark:text-yellow-400';
    if (riskScore <= 75) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskBgColor = () => {
    if (riskScore <= 25) return 'bg-green-100 dark:bg-green-900/20';
    if (riskScore <= 50) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (riskScore <= 75) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getRiskIcon = () => {
    if (riskScore <= 25) return <CheckCircle className="w-5 h-5" />;
    if (riskScore <= 50) return <Shield className="w-5 h-5" />;
    if (riskScore <= 75) return <AlertTriangle className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-primary-500" />
          <span>Risk Score</span>
        </h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBgColor()} ${getRiskColor()}`}>
          {riskLevel}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Portfolio Risk</span>
          <span className={`text-lg font-bold ${getRiskColor()}`}>{riskScore}/100</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              riskScore <= 25 ? 'bg-green-500' :
              riskScore <= 50 ? 'bg-yellow-500' :
              riskScore <= 75 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${riskScore}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          {getRiskIcon()}
          <span>Risk Level: <span className={`font-medium ${getRiskColor()}`}>{riskLevel}</span></span>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recommendations:</h4>
            <ul className="space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>Portfolio Value: ${portfolioValue?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0'}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
            <BarChart3 className="w-4 h-4" />
            <span>Active Tokens: {tokenBalances.filter(t => t.balance > 0).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioRiskScore;



