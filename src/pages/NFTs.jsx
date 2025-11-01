import React from 'react';
import Card from '../components/Card';

const items = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `NFT #${i + 1}`,
  floor: Math.round(Math.random() * 2 * 100) / 100,
}));

const NFTs = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((n) => (
        <Card key={n.id} className="p-3">
          <div className="mb-2 aspect-square w-full rounded-lg bg-white/5" />
          <div className="text-sm font-medium text-primary">{n.name}</div>
          <div className="text-xs text-secondary">Floor: {n.floor} ETH</div>
        </Card>
      ))}
    </div>
  );
};

export default NFTs;

