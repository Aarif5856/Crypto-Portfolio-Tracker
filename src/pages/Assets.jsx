import React from 'react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';

const columns = [
  { key: 'symbol', header: 'Asset' },
  { key: 'amount', header: 'Amount' },
  { key: 'value', header: 'Value (USD)' },
  { key: 'roi', header: 'ROI' },
];

const sample = [
  { id: 1, symbol: 'ETH', amount: '2.50', value: '$7,250', roi: '+12.4%' },
  { id: 2, symbol: 'BTC', amount: '0.20', value: '$13,200', roi: '+5.1%' },
  { id: 3, symbol: 'USDC', amount: '3,400', value: '$3,400', roi: '+0.0%' },
];

const Assets = () => {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-primary font-semibold">Token Holdings</div>
          <div className="badge">Sortable</div>
        </div>
        <DataTable columns={columns} data={sample} />
      </Card>
    </div>
  );
};

export default Assets;

