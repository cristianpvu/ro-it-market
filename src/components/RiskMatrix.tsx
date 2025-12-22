import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Legend, ReferenceLine } from 'recharts';
import { AdvancedMetrics } from '@/utils/exportData';

interface RiskMatrixProps {
  data: AdvancedMetrics[];
}

const RiskMatrix: React.FC<RiskMatrixProps> = ({ data }) => {
  // Calculează media pentru linii de referință
  const avgSaturatie = data.reduce((sum, d) => sum + d.saturatieIndex, 0) / data.length;
  const avgCAGR = data.reduce((sum, d) => sum + d.cagr, 0) / data.length;

  // Funcție pentru a determina categoria și culoarea
  const getCategoryAndColor = (cagr: number, saturatie: number) => {
    const highGrowth = cagr >= avgCAGR;
    const lowSaturation = saturatie < 50; // Prag saturație critică

    if (highGrowth && lowSaturation) {
      return { category: 'Vedete', color: '#22c55e' }; // Verde
    } else if (highGrowth && !lowSaturation) {
      return { category: 'Mature', color: '#3b82f6' }; // Albastru
    } else if (!highGrowth && lowSaturation) {
      return { category: 'Stagnare', color: '#9ca3af' }; // Gri
    } else {
      return { category: 'Potențial', color: '#f59e0b' }; // Portocaliu
    }
  };

  // Prepară datele pentru scatter plot cu culori
  const chartData = data.map(d => {
    const { category, color } = getCategoryAndColor(d.cagr, d.saturatieIndex);
    return {
      x: d.saturatieIndex,
      y: d.cagr,
      z: d.angajatiCurent / 1000, // Pentru dimensiunea bulelor
      name: d.judet,
      oportunitate: d.oportunitateScor,
      category,
      fill: color
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Matricea de Risc: Saturație vs. Momentum
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Identifică județe cu potențial ridicat (creștere mare, saturație mică) sau piețe mature (saturație mare)
        </p>
      </div>

      {/* Explicație cadrane */}
      <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-xs text-purple-900 leading-relaxed">
          💡 <strong>Cum se interpretează:</strong> Cadranul stânga-sus (CAGR ridicat + saturație scăzută) = zona ideală pentru investiții. 
          Dreapta-jos (CAGR scăzut + saturație mare) = piețe mature cu costuri ridicate și creștere lentă.
        </p>
      </div>

      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Index Saturație" 
              unit="%"
              label={{ value: 'Index Saturație (Dificultate Recrutare)', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="CAGR" 
              unit="%"
              label={{ value: 'Viteză Creștere (CAGR %)', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis type="number" dataKey="z" range={[50, 500]} name="Angajați (mii)" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-semibold text-gray-900">{data.name}</p>
                      <p className="text-sm text-purple-600 font-medium">Categorie: {data.category}</p>
                      <p className="text-sm text-gray-600">CAGR: {data.y.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Saturație: {data.x.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Angajați: {data.z.toFixed(1)}k</p>
                      <p className="text-sm font-medium text-blue-600">
                        Scor Oportunitate: {data.oportunitate.toFixed(1)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend content={() => null} />
            
            {/* Linii de referință */}
            <ReferenceLine 
              y={avgCAGR} 
              stroke="#94a3b8" 
              strokeDasharray="3 3"
              label={{ value: 'Media Națională CAGR', position: 'right' }}
            />
            <ReferenceLine 
              x={50} 
              stroke="#94a3b8" 
              strokeDasharray="3 3"
              label={{ value: 'Prag Saturație Critică', position: 'top' }}
            />
            
            <Scatter 
              name="Județe" 
              data={chartData} 
              fill="#3b82f6"
              fillOpacity={0.7}
            >
              {chartData.map((entry, index) => (
                <circle key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="font-semibold text-green-800">Vedete ⭐</div>
          </div>
          <div className="text-xs text-green-600 mt-1">Creștere mare + Saturație mică</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="font-semibold text-blue-800">Mature 🏢</div>
          </div>
          <div className="text-xs text-blue-600 mt-1">Hub-uri consacrate, costuri mari</div>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="font-semibold text-yellow-800">Potențial 💎</div>
          </div>
          <div className="text-xs text-yellow-600 mt-1">Piețe emergente, investiții necesare</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <div className="font-semibold text-gray-800">Stagnare 📉</div>
          </div>
          <div className="text-xs text-gray-600 mt-1">Creștere lentă, saturație scăzută</div>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;
