import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CULORI_GRAFICE } from '@/constants';

interface TrendChartProps {
  data: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  dataKeys: string[];
  title: string;
  yAxisLabel?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  dataKeys,
  title,
  yAxisLabel = 'Valoare',
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      
      {/* Explicație grafic tendință */}
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-xs text-green-900 leading-relaxed">
          📈 <strong>Evoluție istorică 2008-2024:</strong> Graficul arată trendul pe termen lung al pieței IT. 
          Creșteri constante indică stabilitate, salturi bruste pot semnala investiții masive sau migrație de talente.
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={CULORI_GRAFICE[index % CULORI_GRAFICE.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name={key}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
