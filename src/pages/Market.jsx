import React, { useCallback, useEffect, useState } from 'react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { getTrendingCoins, getCoinMarketData } from '../utils/coingecko';

const Market = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const trending = await getTrendingCoins();
      const ids = trending.map((c) => c.id).slice(0, 9);
      const market = await getCoinMarketData(ids);
      setRows(
        (market || []).map((m) => ({
          id: m.id,
          name: m.name,
          symbol: m.symbol?.toUpperCase(),
          price: `$${(m.current_price ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
          change: `${(m.price_change_percentage_24h ?? 0).toFixed(2)}%`,
          volume: `$${(m.total_volume ?? 0).toLocaleString()}`,
        }))
      );
    } catch (e) {
      setError('Failed to load market data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columns = [
    { key: 'symbol', header: 'Symbol' },
    { key: 'name', header: 'Name' },
    { key: 'price', header: 'Price' },
    { key: 'change', header: '24h' },
    { key: 'volume', header: 'Volume' },
  ];

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold text-primary">Market</div>
        <button onClick={load} className={`badge ${loading ? 'opacity-50' : ''}`}>{loading ? 'Loading...' : 'Refresh'}</button>
      </div>
      {error ? (
        <div className="text-xs text-red-400">{error}</div>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}
    </Card>
  );
};

export default Market;

