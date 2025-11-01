import React from 'react';
import Card from '../components/Card';

const tiles = Array.from({ length: 6 }).map((_, i) => ({ id: i + 1, name: `Protocol ${i + 1}` }));

const DeFi = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((t) => (
          <Card key={t.id}>
            <div className="text-primary font-semibold mb-1">{t.name}</div>
            <div className="text-xs text-secondary">Yield, TVL, APY placeholders</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeFi;

