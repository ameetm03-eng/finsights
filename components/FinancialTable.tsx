import React from 'react';

interface TableRow {
  metric: string;
  value: string;
}

interface FinancialTableProps {
  data: TableRow[];
}

export const FinancialTable: React.FC<FinancialTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden border border-gray-700 rounded-lg">
      <table className="min-w-full divide-y divide-gray-700">
        <tbody className="divide-y divide-gray-700 bg-gray-800">
          {data.map((row, index) => (
            <tr key={row.metric} className={index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900/50'}>
              <td className="px-4 py-3 text-sm font-medium text-gray-300 whitespace-nowrap">{row.metric}</td>
              <td className="px-4 py-3 text-sm text-gray-200 font-semibold whitespace-nowrap">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};