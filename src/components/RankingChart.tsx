import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CULORI_GRAFICE } from '@/constants';

interface RankingChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title: string;
  yAxisLabel?: string;
}

const RankingChart: React.FC<RankingChartProps> = ({
  data,
  title,
  yAxisLabel = 'Valoare',
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Bar dataKey="value" name={yAxisLabel} radius={[0, 4, 4, 0]}>
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CULORI_GRAFICE[index % CULORI_GRAFICE.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RankingChart;
