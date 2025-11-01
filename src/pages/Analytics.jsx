import React from 'react';
import Card from '../components/Card';
import ChartCard from '../components/ChartCard';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Portfolio Growth (30d)" />
        <ChartCard title="Realized vs Unrealized P/L" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="text-sm text-secondary mb-2">Asset Allocation</div>
          <div className="text-xs text-secondary">Pie chart placeholder</div>
        </Card>
        <Card>
          <div className="text-sm text-secondary mb-2">Volatility</div>
          <div className="text-xs text-secondary">Heatmap placeholder</div>
        </Card>
        <Card>
          <div className="text-sm text-secondary mb-2">Sharpe Ratio</div>
          <div className="text-xs text-secondary">Metric cards placeholder</div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

