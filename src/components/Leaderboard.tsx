import React from 'react';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import { AdvancedMetrics } from '../utils/exportData';

interface LeaderboardProps {
  data: AdvancedMetrics[];
  viewMode: string;
  topN?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data, viewMode, topN = 10 }) => {
  // Sortare în funcție de view mode
  const getSortedData = () => {
    const sorted = [...data];
    
    switch (viewMode) {
      case 'Talent Pool':
        return sorted.sort((a, b) => b.angajatiCurent - a.angajatiCurent);
      case 'Competiție & Cost':
        return sorted.sort((a, b) => a.saturatieIndex - b.saturatieIndex); // Saturație mai mică = mai bine
      case 'Oportunitate Investiții':
        return sorted.sort((a, b) => b.oportunitateScor - a.oportunitateScor);
      default:
        return sorted.sort((a, b) => b.cagr - a.cagr);
    }
  };

  const topCounties = getSortedData().slice(0, topN);

  const getMetricValue = (item: AdvancedMetrics): string => {
    switch (viewMode) {
      case 'Talent Pool':
        return `${(item.angajatiCurent / 1000).toFixed(1)} mii`;
      case 'Competiție & Cost':
        return `${item.saturatieIndex.toFixed(1)}%`;
      case 'Oportunitate Investiții':
        return item.oportunitateScor.toFixed(1);
      default:
        return `${item.cagr.toFixed(1)}%`;
    }
  };

  const getMetricLabel = (): string => {
    switch (viewMode) {
      case 'Talent Pool':
        return 'Angajați IT';
      case 'Competiție & Cost':
        return 'Index Saturație';
      case 'Oportunitate Investiții':
        return 'Scor Oportunitate';
      default:
        return 'CAGR';
    }
  };

  const getViewModeExplanation = (): string => {
    switch (viewMode) {
      case 'Talent Pool':
        return 'Clasament după mărimea absolută a pieței IT. Orașele mari (București, Cluj, Iași) domină datorită populației și concentrării de universități tehnice.';
      case 'Competiție & Cost':
        return 'Index de saturație - cât de "aglomerată" este piața. Valori scăzute = oportunitate, costuri mai mici, mai puțină competiție pentru talente.';
      case 'Oportunitate Investiții':
        return 'Scoruri bazate pe ranking percentil. Top județe combină creștere rapidă (CAGR ridicat) cu spațiu pentru expansiune (saturație scăzută).';
      default:
        return 'Compound Annual Growth Rate - tendința istorică de creștere.';
    }
  };

  const getTitle = (): string => {
    switch (viewMode) {
      case 'Talent Pool':
        return 'Top județe după forța de muncă IT';
      case 'Competiție & Cost':
        return 'Județe cu saturație scăzută (oportunități)';
      case 'Oportunitate Investiții':
        return 'Top oportunități de investiție';
      default:
        return 'Top județe după creștere';
    }
  };

  const getIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 1) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 text-center font-semibold text-gray-500">{rank + 1}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-2">
        {viewMode === 'Talent Pool' ? (
          <Users className="w-5 h-5 text-blue-600" />
        ) : (
          <TrendingUp className="w-5 h-5 text-blue-600" />
        )}
        <h3 className="text-lg font-semibold text-gray-900">{getTitle()}</h3>
      </div>

      {/* Explicație */}
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-900 leading-relaxed">
          📊 {getViewModeExplanation()}
        </p>
      </div>

      <div className="space-y-2">
        {topCounties.map((item, index) => (
          <div
            key={item.judet}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              index < 3
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-8">
                {getIcon(index)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.judet}</p>
                <p className="text-xs text-gray-500">{item.regiune}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{getMetricValue(item)}</p>
              <p className="text-xs text-gray-500">{getMetricLabel()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Statistici sumare */}
      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 mb-1">Medie</p>
          <p className="font-semibold text-gray-900">
            {viewMode === 'Talent Pool'
              ? `${(topCounties.reduce((sum, c) => sum + c.angajatiCurent, 0) / topCounties.length / 1000).toFixed(1)} mii`
              : viewMode === 'Competiție & Cost'
              ? `${(topCounties.reduce((sum, c) => sum + c.saturatieIndex, 0) / topCounties.length).toFixed(1)}%`
              : viewMode === 'Oportunitate Investiții'
              ? (topCounties.reduce((sum, c) => sum + c.oportunitateScor, 0) / topCounties.length).toFixed(1)
              : `${(topCounties.reduce((sum, c) => sum + c.cagr, 0) / topCounties.length).toFixed(1)}%`}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">CAGR mediu</p>
          <p className="font-semibold text-gray-900">
            {(topCounties.reduce((sum, c) => sum + c.cagr, 0) / topCounties.length).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Stabilitate medie</p>
          <p className="font-semibold text-gray-900">
            {(topCounties.reduce((sum, c) => sum + c.stabilitateScor, 0) / topCounties.length).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
