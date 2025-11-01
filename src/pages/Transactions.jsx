import React from 'react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';

const columns = [
  { key: 'hash', header: 'Tx Hash' },
  { key: 'type', header: 'Type' },
  { key: 'value', header: 'Value' },
  { key: 'time', header: 'Time' },
];

const rows = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  hash: `0x${(Math.random().toString(16) + '00000000000000000').slice(2, 10)}...${(
    Math.random().toString(16) + '00000000000000000'
  ).slice(2, 8)}`,
  type: Math.random() > 0.5 ? 'Swap' : 'Transfer',
  value: `$${(Math.random() * 500).toFixed(2)}`,
  time: `${Math.floor(Math.random() * 59)}m ago`,
}));

const Transactions = () => {
  return (
    <Card>
      <div className="text-primary font-semibold mb-3">Recent Transactions</div>
      <DataTable columns={columns} data={rows} />
    </Card>
  );
};

export default Transactions;

