import React, { useState } from 'react';
import Card from '../components/Card';

const TIERS = [
  {
    name: 'Free',
    monthly: 0,
    yearly: 0,
    features: ['1 wallet', 'Delayed refresh'],
  },
  {
    name: 'Pro',
    monthly: 9.99,
    yearly: 99,
    features: ['Live sync', 'Export', 'Price alerts'],
    popular: true,
  },
  {
    name: 'Premium',
    monthly: 29.99,
    yearly: 299,
    features: ['Advanced analytics', 'DeFi/NFT sync'],
  },
  {
    name: 'Enterprise',
    monthly: 199,
    yearly: 1990,
    features: ['White-label', 'Source access', 'Priority support'],
  },
];

const Pricing = () => {
  const [mode, setMode] = useState('monthly');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-primary text-xl font-semibold">Pricing</div>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => setMode('monthly')} className={`badge ${mode === 'monthly' ? 'text-white' : ''}`}>Monthly</button>
          <button onClick={() => setMode('yearly')} className={`badge ${mode === 'yearly' ? 'text-white' : ''}`}>Yearly</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {TIERS.map((t) => (
          <Card key={t.name} className={`relative ${t.popular ? 'ring-2 ring-orange-500/40' : ''}`}>
            {t.popular && (
              <div className="absolute right-3 top-3 rounded-full bg-orange-500/20 px-2 py-0.5 text-xs text-orange-300">Most Popular</div>
            )}
            <div className="mb-2 text-sm text-secondary">{t.name}</div>
            <div className="mb-4 text-2xl font-bold text-primary">
              {t[mode] === 0 ? '$0' : `$${t[mode]}`}
              <span className="ml-1 text-xs text-secondary">/{mode === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            <ul className="mb-4 space-y-2 text-sm text-secondary">
              {t.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <button className="btn-gradient w-full">Choose {t.name}</button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pricing;

