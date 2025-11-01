import React from 'react';
import Card from '../components/Card';

const Swap = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <div className="mb-4 text-primary font-semibold">Swap</div>
        <div className="space-y-4">
          <div>
            <div className="text-xs text-secondary mb-1">Pay</div>
            <div className="flex gap-2">
              <select className="input max-w-[140px]">
                <option>ETH</option>
                <option>USDC</option>
                <option>USDT</option>
              </select>
              <input className="input" placeholder="0.0" />
            </div>
          </div>
          <div>
            <div className="text-xs text-secondary mb-1">Receive</div>
            <div className="flex gap-2">
              <select className="input max-w-[140px]">
                <option>USDC</option>
                <option>ETH</option>
                <option>WBTC</option>
              </select>
              <input className="input" placeholder="0.0" />
            </div>
          </div>
          <button className="btn-gradient w-full">Go Premium for 0% Fee</button>
        </div>
      </Card>
      <Card>
        <div className="mb-4 text-primary font-semibold">Quote</div>
        <div className="text-xs text-secondary">Aggregated DEX quotes placeholder</div>
      </Card>
    </div>
  );
};

export default Swap;

