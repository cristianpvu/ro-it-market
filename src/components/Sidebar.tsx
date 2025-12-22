import React, { useState } from 'react';
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { JudetData } from '@/types';

interface SidebarProps {
  judete: JudetData[];
  selectedJudete: string[];
  onJudeteChange: (judete: string[]) => void;
  onYearRangeChange: (range: [number, number]) => void;
  yearRange: [number, number];
}

const Sidebar: React.FC<SidebarProps> = ({
  judete,
  selectedJudete,
  onJudeteChange,
  onYearRangeChange,
  yearRange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState<'alfabetic' | 'densitate' | 'crestere'>('alfabetic');

  // Filtrare și sortare județe
  const filteredJudete = judete
    .filter(j => j.judet.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'densitate':
          return b.densitateIT - a.densitateIT;
        case 'crestere':
          return b.rataCrestere - a.rataCrestere;
        default:
          return a.judet.localeCompare(b.judet);
      }
    });

  const handleJudetToggle = (judet: string) => {
    if (selectedJudete.includes(judet)) {
      onJudeteChange(selectedJudete.filter(j => j !== judet));
    } else {
      onJudeteChange([...selectedJudete, judet]);
    }
  };

  const handleSelectAll = () => {
    if (selectedJudete.length === judete.length) {
      onJudeteChange([]);
    } else {
      onJudeteChange(judete.map(j => j.judet));
    }
  };

  const handleTopN = (n: number) => {
    const top = [...judete]
      .sort((a, b) => b.densitateIT - a.densitateIT)
      .slice(0, n)
      .map(j => j.judet);
    onJudeteChange(top);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden">
      {/* Header Sidebar */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Filtre & Selecție
        </h2>
        <p className="text-sm text-gray-600">
          Selectează județele pentru analiză
        </p>
      </div>

      {/* Căutare */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Caută județ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Acțiuni rapide */}
      <div className="p-4 border-b border-gray-200 space-y-2">
        <button
          onClick={handleSelectAll}
          className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          {selectedJudete.length === judete.length ? 'Deselectează toate' : 'Selectează toate'}
        </button>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleTopN(5)}
            className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium"
          >
            Top 5
          </button>
          <button
            onClick={() => handleTopN(10)}
            className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium"
          >
            Top 10
          </button>
          <button
            onClick={() => onJudeteChange([])}
            className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Sortare */}
      <div className="p-4 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sortare
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
        >
          <option value="alfabetic">Alfabetic</option>
          <option value="densitate">Densitate IT</option>
          <option value="crestere">Rată creștere</option>
        </select>
      </div>

      {/* Filtrare Perioada Temporală */}
      <div className="p-4 border-b border-gray-200 bg-blue-50">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            Perioadă Analiză Temporală
          </span>
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showFilters && (
          <div className="space-y-3">
            <div className="text-xs text-gray-700 mb-2">
              <p className="mb-1">
                📊 Selectează perioada pentru calculul CAGR, tendințe și grafice istorice
              </p>
            </div>
            
            {/* Selectoare ani */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  An început
                </label>
                <select
                  value={yearRange[0]}
                  onChange={(e) => {
                    const newStart = Number(e.target.value);
                    if (newStart < yearRange[1]) {
                      onYearRangeChange([newStart, yearRange[1]]);
                    }
                  }}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Array.from({ length: 17 }, (_, i) => 2008 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  An final
                </label>
                <select
                  value={yearRange[1]}
                  onChange={(e) => {
                    const newEnd = Number(e.target.value);
                    if (newEnd > yearRange[0]) {
                      onYearRangeChange([yearRange[0], newEnd]);
                    }
                  }}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Array.from({ length: 17 }, (_, i) => 2008 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preseturi rapide */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200">
              <button
                onClick={() => onYearRangeChange([2008, 2024])}
                className="px-2 py-1.5 text-xs bg-white text-blue-700 rounded border border-blue-300 hover:bg-blue-100 transition-colors font-medium"
              >
                Toată perioada
              </button>
              <button
                onClick={() => onYearRangeChange([2019, 2024])}
                className="px-2 py-1.5 text-xs bg-white text-blue-700 rounded border border-blue-300 hover:bg-blue-100 transition-colors font-medium"
              >
                Ultimi 5 ani
              </button>
              <button
                onClick={() => onYearRangeChange([2014, 2024])}
                className="px-2 py-1.5 text-xs bg-white text-blue-700 rounded border border-blue-300 hover:bg-blue-100 transition-colors font-medium"
              >
                Ultimi 10 ani
              </button>
              <button
                onClick={() => onYearRangeChange([2020, 2024])}
                className="px-2 py-1.5 text-xs bg-white text-blue-700 rounded border border-blue-300 hover:bg-blue-100 transition-colors font-medium"
              >
                Post-COVID
              </button>
            </div>

            <div className="text-xs text-center text-gray-600 pt-2 border-t border-blue-200">
              Perioada selectată: <strong>{yearRange[1] - yearRange[0] + 1} ani</strong> ({yearRange[0]} - {yearRange[1]})
            </div>
          </div>
        )}
      </div>

      {/* Listă județe */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {filteredJudete.map((judet) => (
            <label
              key={judet.judet}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <input
                type="checkbox"
                checked={selectedJudete.includes(judet.judet)}
                onChange={() => handleJudetToggle(judet.judet)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {judet.judet}
                </p>
                <p className="text-xs text-gray-500">
                  Densitate: {judet.densitateIT.toFixed(2)} | Creștere: {judet.rataCrestere.toFixed(1)}%
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Info selecție */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{selectedJudete.length}</span> din{' '}
          <span className="font-medium text-gray-900">{judete.length}</span> județe selectate
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
