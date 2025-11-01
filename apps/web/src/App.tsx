import React, { useEffect, useState } from 'react';

export const App: React.FC = () => {
  const [price, setPrice] = useState<string>('loading...');

  useEffect(() => {
    // Simple demo call to API route if running locally
    fetch('http://localhost:3001/price/bitcoin')
      .then((r) => r.json())
      .then((j) => setPrice(`${j.price ?? 'n/a'} USD`))
      .catch(() => setPrice('api unavailable'));
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Crypto Portfolio Tracker</h1>
      <p>BTC price: {price}</p>
    </div>
  );
};

