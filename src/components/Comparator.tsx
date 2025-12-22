import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { AdvancedMetrics } from '@/utils/exportData';
import { ArrowUpDown } from 'lucide-react';

interface ComparatorProps {
  allData: AdvancedMetrics[];
}

const Comparator: React.FC<ComparatorProps> = ({ allData }) => {
  const judete = allData.map(d => d.judet).sort();
  const [judet1, setJudet1] = useState(judete[0] || '');
  const [judet2, setJudet2] = useState(judete[1] || '');

  const data1 = allData.find(d => d.judet === judet1);
  const data2 = allData.find(d => d.judet === judet2);

  if (!data1 || !data2) {
    return <div>Selectează două județe pentru comparație</div>;
  }

  // Normalizează datele pentru radar chart (0-100)
  const normalizeValue = (value: number, max: number) => {
    return (value / max) * 100;
  };

  const maxValues = {
    cagr: Math.max(...allData.map(d => Math.abs(d.cagr))),
    saturatie: 100,
    stabilitate: 100,
    oportunitate: Math.max(...allData.map(d => d.oportunitateScor)),
    angajati: Math.max(...allData.map(d => d.angajatiCurent))
  };

  const radarData = [
    {
      metric: 'CAGR',
      [judet1]: normalizeValue(Math.max(0, data1.cagr), maxValues.cagr),
      [judet2]: normalizeValue(Math.max(0, data2.cagr), maxValues.cagr),
    },
    {
      metric: 'Talent Pool',
      [judet1]: normalizeValue(data1.angajatiCurent, maxValues.angajati),
      [judet2]: normalizeValue(data2.angajatiCurent, maxValues.angajati),
    },
    {
      metric: 'Stabilitate',
      [judet1]: data1.stabilitateScor,
      [judet2]: data2.stabilitateScor,
    },
    {
      metric: 'Oportunitate',
      [judet1]: normalizeValue(data1.oportunitateScor, maxValues.oportunitate),
      [judet2]: normalizeValue(data2.oportunitateScor, maxValues.oportunitate),
    },
    {
      metric: 'Inversul Saturației',
      [judet1]: 100 - data1.saturatieIndex,
      [judet2]: 100 - data2.saturatieIndex,
    }
  ];

  const metrics = [
    { label: 'CAGR (%)', key: 'cagr' },
    { label: 'Talent Pool (mii)', key: 'angajatiCurent', format: (v: number) => (v / 1000).toFixed(1) },
    { label: 'Saturație (%)', key: 'saturatieIndex' },
    { label: 'Stabilitate', key: 'stabilitateScor' },
    { label: 'Scor Oportunitate', key: 'oportunitateScor' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Comparator Head-to-Head
      </h3>

      {/* Explicație comparator */}
      <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
        <p className="text-xs text-indigo-900 leading-relaxed">
          🔄 <strong>Comparație directă între județe:</strong> Radar chart-ul vizualizează 5 dimensiuni simultane. 
          Suprafața mai mare = profil superior. Compară huburi tech cu județe emergente pentru a identifica trade-off-uri.
        </p>
      </div>

      {/* Selectori */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Județul A</label>
          <select
            value={judet1}
            onChange={(e) => setJudet1(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {judete.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Județul B</label>
          <select
            value={judet2}
            onChange={(e) => setJudet2(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {judete.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrici comparative */}
      <div className="space-y-3 mb-6">
        {metrics.map(({ label, key, format }) => {
          const val1 = data1[key as keyof AdvancedMetrics] as number;
          const val2 = data2[key as keyof AdvancedMetrics] as number;
          const delta = val2 - val1;
          const formatter = format || ((v: number) => v.toFixed(1));

          return (
            <div key={key} className="grid grid-cols-3 gap-4 items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-700">{label}</div>
                <div className="text-lg font-semibold text-blue-600">{formatter(val1)}</div>
              </div>
              <div className="flex justify-center">
                <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                  delta > 0 ? 'bg-green-100 text-green-700' : 
                  delta < 0 ? 'bg-red-100 text-red-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  <ArrowUpDown className="w-3 h-3" />
                  <span className="text-sm font-medium">{formatter(Math.abs(delta))}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">{label}</div>
                <div className="text-lg font-semibold text-purple-600">{formatter(val2)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Radar Chart */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar 
              name={judet1} 
              dataKey={judet1} 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.3} 
            />
            <Radar 
              name={judet2} 
              dataKey={judet2} 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.3} 
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Justificare:</strong> Acest grafic radar evidențiază trade-off-ul între <strong>{judet1}</strong> și <strong>{judet2}</strong>. 
          Hub-urile mari au saturație ridicată (risc cost), în timp ce județele satelit oferă oportunitate mai mare 
          dar pot avea stabilitate mai scăzută a pipeline-ului de talente.
        </p>
      </div>
    </div>
  );
};

export default Comparator;
