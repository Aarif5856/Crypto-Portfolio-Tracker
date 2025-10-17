import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3, DollarSign } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const PortfolioAnalytics = ({ portfolioValue, tokenBalances }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState([]);
  const [diversificationData, setDiversificationData] = useState([]);

  // Generate mock historical data
  useEffect(() => {
    const generateHistoricalData = () => {
      const data = [];
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const baseValue = portfolioValue || 1000;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Add some realistic volatility
        const volatility = 0.05;
        const trend = timeRange === '7d' ? 0.02 : timeRange === '30d' ? 0.01 : 0.005;
        const randomChange = (Math.random() - 0.5) * volatility;
        const value = baseValue * (1 + trend * (days - i) + randomChange);
        
        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.max(value, 0),
          formattedValue: `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
        });
      }
      
      return data;
    };

    setChartData(generateHistoricalData());
  }, [portfolioValue, timeRange]);

  // Generate diversification data
  useEffect(() => {
    if (tokenBalances && tokenBalances.length > 0) {
      const totalValue = tokenBalances.reduce((sum, token) => sum + (token.valueUSD || 0), 0);
      
      const diversification = tokenBalances
        .filter(token => token.valueUSD > 0)
        .map(token => ({
          name: token.symbol,
          value: token.valueUSD,
          percentage: totalValue > 0 ? (token.valueUSD / totalValue) * 100 : 0,
          color: getTokenColor(token.symbol)
        }))
        .sort((a, b) => b.value - a.value);

      setDiversificationData(diversification);
    }
  }, [tokenBalances]);

  const getTokenColor = (symbol) => {
    const colors = {
      'ETH': '#627EEA',
      'BTC': '#F7931A',
      'USDC': '#2775CA',
      'USDT': '#26A17B',
      'BNB': '#F3BA2F',
      'ADA': '#0033AD',
      'SOL': '#9945FF',
      'MATIC': '#8247E5',
      'DOT': '#E6007A',
      'AVAX': '#E84142',
    };
    return colors[symbol] || '#6366F1';
  };

  const calculatePerformance = () => {
    if (chartData.length < 2) return { change: 0, percentage: 0 };
    
    const firstValue = chartData[0].value;
    const lastValue = chartData[chartData.length - 1].value;
    const change = lastValue - firstValue;
    const percentage = firstValue > 0 ? (change / firstValue) * 100 : 0;
    
    return { change, percentage };
  };

  const performance = calculatePerformance();
  const isPositive = performance.percentage >= 0;

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <span>Portfolio Performance</span>
          </h3>
          <div className="flex space-x-2">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {chartData.length > 0 ? chartData[chartData.length - 1].formattedValue : '$0.00'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Value</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold flex items-center justify-center space-x-1 ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span>{performance.percentage.toFixed(2)}%</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Performance</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? '+' : ''}${performance.change.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Change</div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 'Portfolio Value']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Diversification Chart */}
      {diversificationData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <PieChartIcon className="w-5 h-5 text-primary-500" />
            <span>Portfolio Diversification</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diversificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {diversificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 'Value']}
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Token List */}
            <div className="space-y-3">
              {diversificationData.map((token, index) => (
                <div key={token.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: token.color }}
                    ></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {token.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {token.percentage.toFixed(1)}% of portfolio
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">
                      ${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risk Analysis */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-primary-500" />
          <span>Risk Analysis</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Concentration Risk</h4>
            <div className="space-y-2">
              {diversificationData.slice(0, 3).map((token, index) => (
                <div key={token.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{token.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${token.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {token.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Portfolio Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Tokens</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {diversificationData.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Largest Holding</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {diversificationData.length > 0 ? diversificationData[0].name : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Diversification Score</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {diversificationData.length > 0 ? 
                    (diversificationData.length >= 5 ? 'Good' : 
                     diversificationData.length >= 3 ? 'Fair' : 'Poor') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;



