import React from 'react';
import Card from './Card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const data = Array.from({ length: 24 }).map((_, i) => ({
  t: i,
  v: 1000 + Math.round(Math.sin(i / 2) * 120) + Math.round(Math.random() * 50),
}));

const ChartCard = ({ title, footer }) => {
  return (
    <Card className="h-64">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-secondary">{title}</div>
        {footer}
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)' }} />
            <Area type="monotone" dataKey="v" stroke="#FF7A00" strokeWidth={2} fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ChartCard;

