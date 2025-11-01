import React from 'react';

const DataTable = ({ columns = [], data = [], keyField = 'id' }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/5">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-2 text-left font-semibold text-secondary">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row) => (
            <tr key={row[keyField]} className="hover:bg-white/5">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2 text-xs text-primary">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

