import { useState, useMemo, useEffect } from 'react';
import { Users, TrendingUp, MapPin, Award, Download, GitCompare, AlertTriangle, BarChart3, Filter } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EmptyState from './components/EmptyState';
import KPICard from './components/KPICard';
import TrendChart from './components/TrendChart';
import RankingChart from './components/RankingChart';
import RomaniaMap from './components/RomaniaMap';
import RiskMatrix from './components/RiskMatrix';
import Comparator from './components/Comparator';
import Leaderboard from './components/Leaderboard';
import { JudetData } from './types';
import { parseCSVFile } from './utils/csvParser';
import { TempoAPIService } from './services/tempoAPI';
import { downloadCSV, calculateAdvancedMetrics } from './utils/exportData';
import {
  calculateKPIs,
  prepareTimeSeriesData,
  prepareMapData,
  getTopJudete,
} from './utils/dataProcessing';

function App() {
  const [data, setData] = useState<JudetData[]>([]);
  const [selectedJudete, setSelectedJudete] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([2008, 2024]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapMetric, setMapMetric] = useState<'densitateIT' | 'angajatiCurent' | 'rataCrestere' | 'cagr' | 'saturatie' | 'oportunitate'>('angajatiCurent');
  const [activeTab, setActiveTab] = useState<'overview' | 'risk' | 'compare' | 'export'>('overview');
  const [viewMode, setViewMode] = useState<'Talent Pool' | 'Competiție & Cost' | 'Oportunitate Investiții'>('Talent Pool');

  // Încărcare automată date la pornire
  useEffect(() => {
    loadDataFromAPI();
  }, []);

  const loadDataFromAPI = async () => {
    setIsLoading(true);
    try {
      const apiData = await TempoAPIService.fetchData();
      setData(apiData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadCSV = async (file: File) => {
    setIsLoading(true);
    try {
      const csvData = await parseCSVFile(file);
      setData(csvData);
    } catch (error) {
      alert('Eroare la procesarea fișierului CSV. Verifică formatul.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    if (data.length === 0) {
      alert('Nu există date de exportat');
      return;
    }
    downloadCSV(data, 'raport_piata_it_romania.csv', yearRange);
  };

  const handleRefreshData = () => {
    loadDataFromAPI();
  };

  // Calculare metrici
  const kpis = useMemo(() => calculateKPIs(data), [data]);
  
  // Calculare metrici avansate pentru analiză - folosind perioada selectată
  const advancedMetrics = useMemo(() => calculateAdvancedMetrics(data, yearRange), [data, yearRange]);

  // Pregătire date pentru grafice - folosind perioada selectată
  const timeSeriesData = useMemo(() => {
    const allData = prepareTimeSeriesData(data, selectedJudete);
    // Filtrează doar anii din range
    return allData.filter(d => d.year >= yearRange[0] && d.year <= yearRange[1]);
  }, [data, selectedJudete, yearRange]);
  
  const timeSeriesDataKeys = useMemo(() => {
    if (timeSeriesData.length === 0) return [];
    const firstRow = timeSeriesData[0];
    return Object.keys(firstRow).filter(key => key !== 'year');
  }, [timeSeriesData]);

  const mapData = useMemo(() => {
    return prepareMapData(data);
  }, [data]);

  const topJudeteByDensity = useMemo(() => {
    return getTopJudete(data, 'densitateIT', 10).map(item => ({
      name: item.judet,
      value: item.densitateIT,
      fill: '#3B82F6',
    }));
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onUploadCSV={handleUploadCSV}
        onExportData={handleExportData}
        onRefreshData={handleRefreshData}
        isLoading={isLoading}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          judete={data}
          selectedJudete={selectedJudete}
          onJudeteChange={setSelectedJudete}
          onYearRangeChange={setYearRange}
          yearRange={yearRange}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Se încarcă datele...</p>
              </div>
            </div>
          ) : data.length === 0 ? (
            <EmptyState onUploadCSV={handleUploadCSV} />
          ) : (
            <div className="space-y-6">
              {/* Tabs Navigation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    Vizualizare Geografică
                  </button>
                  <button
                    onClick={() => setActiveTab('risk')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'risk'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Risc & Saturație
                  </button>
                  <button
                    onClick={() => setActiveTab('compare')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'compare'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <GitCompare className="w-4 h-4" />
                    Comparator Head-to-Head
                  </button>
                  <button
                    onClick={() => setActiveTab('export')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'export'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Date & Export
                  </button>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  title="Piață Totală IT"
                  value={kpis.totalAngajatiIT}
                  subtitle="mii angajați"
                  icon={<Users className="w-5 h-5" />}
                  trend={advancedMetrics.length > 0 && (advancedMetrics.reduce((sum, m) => sum + m.cagr, 0) / advancedMetrics.length) > 5 ? 'up' : 'neutral'}
                  trendValue={advancedMetrics.length > 0 ? `${(advancedMetrics.reduce((sum, m) => sum + m.cagr, 0) / advancedMetrics.length).toFixed(1)}% CAGR` : ''}
                  color="blue"
                  explanation="Reprezintă totalul angajaților din IT&C în România (2024). Piața este în creștere datorită transformării digitale și demografiei tinere în huburi tech."
                />
                <KPICard
                  title="CAGR Mediu (2008-2024)"
                  value={advancedMetrics.length > 0 ? (advancedMetrics.reduce((sum, m) => sum + m.cagr, 0) / advancedMetrics.length).toFixed(1) : '0'}
                  subtitle="%"
                  icon={<TrendingUp className="w-5 h-5" />}
                  trend={advancedMetrics.length > 0 && (advancedMetrics.reduce((sum, m) => sum + m.cagr, 0) / advancedMetrics.length) > 5 ? 'up' : 'neutral'}
                  color="green"
                  explanation="Compound Annual Growth Rate - rata de creștere anuală compusă. Arată momentum-ul istoric al industriei IT pe 16 ani. Valori >10% indică creștere exponențială."
                />
                <KPICard
                  title="Top Oportunitate"
                  value={advancedMetrics.length > 0 ? advancedMetrics.reduce((max, m) => m.oportunitateScor > max.oportunitateScor ? m : max).judet : 'N/A'}
                  subtitle={advancedMetrics.length > 0 ? `Scor: ${advancedMetrics.reduce((max, m) => m.oportunitateScor > max.oportunitateScor ? m : max).oportunitateScor.toFixed(1)}` : ''}
                  icon={<Award className="w-5 h-5" />}
                  color="orange"
                  explanation="Combină CAGR ridicat (60%) cu saturație scăzută (40%). Județul cu cel mai bun echilibru între creștere rapidă și piață neexploatată pentru investiții."
                />
                <KPICard
                  title="Top Momentum (CAGR)"
                  value={advancedMetrics.length > 0 ? advancedMetrics.reduce((max, m) => m.cagr > max.cagr ? m : max).judet : 'N/A'}
                  subtitle={advancedMetrics.length > 0 ? `${advancedMetrics.reduce((max, m) => m.cagr > max.cagr ? m : max).cagr.toFixed(1)}%` : ''}
                  icon={<MapPin className="w-5 h-5" />}
                  color="purple"
                  explanation="Județul cu cea mai rapidă creștere IT din țară. Momentum-ul indică atragerea talentelor, investiții și dezvoltare ecosistem tech susținut."
                />
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Indicator Perioadă Activă */}
                  {(yearRange[0] !== 2008 || yearRange[1] !== 2024) && (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-yellow-700" />
                        <span className="text-sm font-medium text-yellow-900">
                          Analiză filtrată: <strong>{yearRange[0]} - {yearRange[1]}</strong> ({yearRange[1] - yearRange[0] + 1} ani)
                        </span>
                      </div>
                      <button
                        onClick={() => setYearRange([2008, 2024])}
                        className="text-xs text-yellow-700 hover:text-yellow-900 underline font-medium"
                      >
                        Resetează la toată perioada
                      </button>
                    </div>
                  )}

                  {/* View Mode Selector */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Modul de Vizualizare:</h3>
                      <p className="text-xs text-gray-600">
                        Fiecare mod oferă o perspectivă diferită: <strong>Talent Pool</strong> = mărime absolută piață, 
                        <strong>Competiție & Cost</strong> = saturație și dificultate recrutare, 
                        <strong>Oportunitate</strong> = potențial investiții (creștere + spațiu liber).
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setViewMode('Talent Pool');
                            setMapMetric('angajatiCurent');
                          }}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            viewMode === 'Talent Pool'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Users className="w-4 h-4 inline mr-2" />
                          Talent Pool
                        </button>
                        <button
                          onClick={() => {
                            setViewMode('Competiție & Cost');
                            setMapMetric('saturatie');
                          }}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            viewMode === 'Competiție & Cost'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <BarChart3 className="w-4 h-4 inline mr-2" />
                          Competiție & Cost
                        </button>
                        <button
                          onClick={() => {
                            setViewMode('Oportunitate Investiții');
                            setMapMetric('oportunitate');
                          }}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            viewMode === 'Oportunitate Investiții'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Award className="w-4 h-4 inline mr-2" />
                          Oportunitate Investiții
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <RomaniaMap 
                        data={mapData.map(m => ({
                          ...m,
                          saturatieIndex: advancedMetrics.find(a => a.judet === m.judet)?.saturatieIndex,
                          oportunitateScor: advancedMetrics.find(a => a.judet === m.judet)?.oportunitateScor,
                          stabilitateScor: advancedMetrics.find(a => a.judet === m.judet)?.stabilitateScor,
                        }))} 
                        selectedMetric={mapMetric}
                        viewMode={viewMode}
                      />
                    </div>
                    <div>
                      <Leaderboard 
                        data={advancedMetrics} 
                        viewMode={viewMode}
                        topN={10}
                      />
                    </div>
                  </div>

                  {/* Trend Chart */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                      Evoluția Temporală a Angajaților IT
                      {selectedJudete.length > 0 && (
                        <span className="ml-2 text-sm font-normal text-gray-600">
                          ({selectedJudete.length} județ{selectedJudete.length > 1 ? 'e' : ''} selectat{selectedJudete.length > 1 ? 'e' : ''})
                        </span>
                      )}
                    </h2>
                    <TrendChart 
                      data={timeSeriesData} 
                      dataKeys={timeSeriesDataKeys}
                      title="Evoluția Angajaților IT (mii persoane)"
                    />
                  </div>

                  {/* Ranking Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Top 10 Județe - Densitate IT
                      </h2>
                      <RankingChart
                        data={topJudeteByDensity}
                        title="Per 1000 locuitori"
                      />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Top 10 Județe - CAGR (2008-2024)
                      </h2>
                      <RankingChart
                        data={advancedMetrics.slice().sort((a, b) => b.cagr - a.cagr).slice(0, 10).map(item => ({
                          name: item.judet,
                          value: item.cagr,
                          fill: '#10B981',
                        }))}
                        title="Procent (%)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'risk' && (
                <div className="space-y-6">
                  <RiskMatrix data={advancedMetrics} />
                </div>
              )}

              {activeTab === 'compare' && (
                <div className="space-y-6">
                  <Comparator allData={advancedMetrics} />
                </div>
              )}

              {activeTab === 'export' && (
                <div className="space-y-6">
                  {/* Info Perioadă Export */}
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-blue-700" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">
                          Export date perioada: {yearRange[0]} - {yearRange[1]} ({yearRange[1] - yearRange[0] + 1} ani)
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          CSV-ul va include toate coloanele anuale din perioada selectată + metrici calculate (CAGR, saturație, densitate, populație)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Date Complete - Angajați IT pe Ani
                      </h2>
                      <button
                        onClick={handleExportData}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Exportă CSV ({yearRange[0]}-{yearRange[1]})
                      </button>
                    </div>

                    <div className="overflow-x-auto max-h-[800px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-50 z-10">
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 bg-gray-50">Județ</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 bg-gray-50">Regiune</th>
                            <th className="px-3 py-3 text-right font-semibold text-gray-700 bg-gray-50">Populație</th>
                            <th className="px-3 py-3 text-right font-semibold text-gray-700 bg-gray-50">Densitate IT</th>
                            {Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, i) => yearRange[0] + i).map(year => (
                              <th key={year} className="px-3 py-3 text-right font-semibold text-gray-700 bg-gray-50">{year}</th>
                            ))}
                            <th className="px-3 py-3 text-right font-semibold text-gray-700 bg-gray-50">CAGR (%)</th>
                            <th className="px-3 py-3 text-right font-semibold text-gray-700 bg-gray-50">Saturație (%)</th>
                            <th className="px-3 py-3 text-right font-semibold text-gray-700 bg-gray-50">Stabilitate</th>
                            <th className="px-3 py-3 text-right font-semibold text-gray-700 bg-gray-50">Oportunitate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...advancedMetrics]
                            .sort((a, b) => a.judet.localeCompare(b.judet, 'ro'))
                            .map((item, index) => {
                              const judetData = data.find(d => d.judet === item.judet);
                              return (
                                <tr key={item.judet} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-4 py-3 font-medium text-gray-900">{item.judet}</td>
                                  <td className="px-4 py-3 text-gray-600">{item.regiune}</td>
                                  <td className="px-3 py-3 text-right text-gray-900">{(item.populatie || 0).toLocaleString('ro-RO')}</td>
                                  <td className="px-3 py-3 text-right text-gray-900">{(item.densitateIT || 0).toFixed(2)}</td>
                                  {Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, i) => yearRange[0] + i).map(year => (
                                    <td key={year} className="px-3 py-3 text-right text-gray-900">
                                      {Math.round(judetData?.angajatiIT[year] || 0).toLocaleString('ro-RO')}
                                    </td>
                                  ))}
                                  <td className="px-3 py-3 text-right text-gray-900">{(item.cagr || 0).toFixed(1)}</td>
                                  <td className="px-3 py-3 text-right text-gray-900">{(item.saturatieIndex || 0).toFixed(1)}</td>
                                  <td className="px-3 py-3 text-right text-gray-900">{(item.stabilitateScor || 0).toFixed(1)}</td>
                                  <td className="px-3 py-3 text-right text-gray-900">{(item.oportunitateScor || 0).toFixed(1)}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Methodology */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Metodologie de Calcul</h2>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div className="border-l-4 border-blue-600 pl-4">
                        <h3 className="font-semibold mb-1">CAGR (Compound Annual Growth Rate)</h3>
                        <p>Formula: <code className="bg-gray-100 px-2 py-1 rounded">CAGR = (Valoare_finală / Valoare_inițială)^(1/n_ani) - 1</code></p>
                        <p className="mt-1 text-gray-600">Măsoară rata de creștere anuală compusă între 2008 și 2024.</p>
                      </div>

                      <div className="border-l-4 border-orange-600 pl-4">
                        <h3 className="font-semibold mb-1">Index Saturație</h3>
                        <p>Formula: <code className="bg-gray-100 px-2 py-1 rounded">Saturație = (Angajați_curent / Max_angajați_națională) × 100</code></p>
                        <p className="mt-1 text-gray-600">Indică nivelul de aglomerare a pieței. Saturație ridicată = competiție intensă.</p>
                      </div>

                      <div className="border-l-4 border-green-600 pl-4">
                        <h3 className="font-semibold mb-1">Scor Stabilitate</h3>
                        <p>Formula: <code className="bg-gray-100 px-2 py-1 rounded">Stabilitate = 100 - StdDev(rate_creștere_anuale)</code></p>
                        <p className="mt-1 text-gray-600">Măsoară predictibilitatea creșterii. Volatilitate scăzută = mai stabil.</p>
                      </div>

                      <div className="border-l-4 border-purple-600 pl-4">
                        <h3 className="font-semibold mb-1">Scor Oportunitate</h3>
                        <p>Formula: <code className="bg-gray-100 px-2 py-1 rounded">Oportunitate = 0.6 × CAGR + 0.4 × (100 - Saturație)</code></p>
                        <p className="mt-1 text-gray-600">Combină dinamica creșterii cu disponibilitatea pieței. Scor mare = oportunitate bună de investiție.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
