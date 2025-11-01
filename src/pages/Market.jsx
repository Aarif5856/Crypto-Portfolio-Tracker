import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { getTopMarketData } from '../utils/coingecko';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

const Market = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 25; // 4 pages for top 100

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const market = await getTopMarketData({ page, perPage });
      setRows(market || []);
    } catch (e) {
      setError('Failed to load market data');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = useMemo(() => [
    { key: 'symbol', header: 'Symbol', render: (v, row) => row.symbol?.toUpperCase() },
    { key: 'name', header: 'Name' },
    { key: 'current_price', header: 'Price', render: (v) => `$${(v ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
    { key: 'price_change_percentage_24h', header: '24h', render: (v) => (
      <span className={v >= 0 ? 'text-green-400' : 'text-red-400'}>{(v ?? 0).toFixed(2)}%</span>
    ) },
    { key: 'total_volume', header: 'Volume', render: (v) => `$${(v ?? 0).toLocaleString()}` },
    { key: 'sparkline_in_7d', header: '7d', render: (spark) => (
      <div className="h-8 w-24">
        {spark?.price?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark.price.map((y, i) => ({ i, y }))} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="mini" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="y" stroke="#FF7A00" strokeWidth={1.5} fill="url(#mini)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    ) },
  ], []);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold text-primary">Market — Top 100</div>
        <div className="flex items-center gap-2">
          <button onClick={load} className={`badge ${loading ? 'opacity-50' : ''}`}>{loading ? 'Loading...' : 'Refresh'}</button>
          <div className="badge">Page {page} / 4</div>
          <button disabled={page<=1} onClick={() => setPage((p)=>Math.max(1,p-1))} className="btn-secondary px-3 py-1 text-xs disabled:opacity-50">Prev</button>
          <button disabled={page>=4} onClick={() => setPage((p)=>Math.min(4,p+1))} className="btn-secondary px-3 py-1 text-xs disabled:opacity-50">Next</button>
        </div>
      </div>
      {error ? (
        <div className="text-xs text-red-400">{error}</div>
      ) : (
        <DataTable columns={columns} data={rows} keyField="id" />
      )}
    </Card>
  );
};

export default Market;
