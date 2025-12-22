import React, { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapRegionData } from '@/types';
import 'leaflet/dist/leaflet.css';

interface RomaniaMapProps {
  data: MapRegionData[];
  selectedMetric: 'densitateIT' | 'angajatiCurent' | 'rataCrestere' | 'cagr' | 'saturatie' | 'oportunitate';
  viewMode?: string;
}

// Componenta pentru ajustarea viewport-ului hărții
const MapBounds: React.FC<{ data: MapRegionData[] }> = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (data.length > 0) {
      const bounds = L.latLngBounds(
        data.map(d => [d.lat, d.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [data, map]);

  return null;
};

const RomaniaMap: React.FC<RomaniaMapProps> = ({ data, selectedMetric, viewMode = 'Talent Pool' }) => {
  // Calculare rază cerc pe baza metricii selectate
  const getCircleRadius = (value: number, maxValue: number, minValue: number, metricType: string): number => {
    if (metricType === 'oportunitate' || viewMode === 'Oportunitate Investiții') {
      const minRadius = 8;
      const maxRadius = 35;
      if (maxValue === 0) return minRadius;
      
      const range = maxValue - minValue;
      const normalized = range > 0 ? (value - minValue) / range : 0;
      
      const squared = Math.pow(normalized, 0.7);
      return minRadius + squared * (maxRadius - minRadius);
    }
    
    const minRadius = 8;
    const maxRadius = 40;
    if (maxValue === 0) return minRadius;
    return minRadius + (value / maxValue) * (maxRadius - minRadius);
  };

  // Calculare culoare pe baza valorii - diferite palete pentru fiecare view mode
  const getCircleColor = (value: number, maxValue: number, minValue: number, metricType: string): string => {
    if (maxValue === 0) return '#e5e7eb';
    
    const range = maxValue - minValue;
    const intensity = range > 0 ? (value - minValue) / range : 0;
    
    if (metricType === 'oportunitate' || viewMode === 'Oportunitate Investiții') {
      if (intensity > 0.75) return '#15803d';
      if (intensity > 0.50) return '#22c55e';
      if (intensity > 0.25) return '#fbbf24';
      return '#ef4444';
    }
    
    if (metricType === 'saturatie' || viewMode === 'Competiție & Cost') {
      if (intensity > 0.75) return '#dc2626';
      if (intensity > 0.5) return '#f59e0b';
      if (intensity > 0.25) return '#fbbf24';
      return '#4ade80';
    }
    
    if (intensity > 0.75) return '#1e40af';
    if (intensity > 0.5) return '#3b82f6';
    if (intensity > 0.25) return '#60a5fa';
    return '#93c5fd';
  };

  const maxValue = Math.max(...data.map(d => {
    switch (selectedMetric) {
      case 'densitateIT':
        return d.densitateIT;
      case 'angajatiCurent':
        return d.angajatiCurent;
      case 'rataCrestere':
        return d.rataCrestere;
      case 'cagr':
        return d.cagr || 0;
      case 'saturatie':
        return d.saturatieIndex || 0;
      case 'oportunitate':
        return d.oportunitateScor || 0;
      default:
        return 0;
    }
  }), 1);
  
  const minValue = Math.min(...data.map(d => {
    switch (selectedMetric) {
      case 'densitateIT':
        return d.densitateIT;
      case 'angajatiCurent':
        return d.angajatiCurent;
      case 'rataCrestere':
        return d.rataCrestere;
      case 'cagr':
        return d.cagr || 0;
      case 'saturatie':
        return d.saturatieIndex || 0;
      case 'oportunitate':
        return d.oportunitateScor || 0;
      default:
        return 0;
    }
  }));

  const getMetricValue = (item: MapRegionData): number => {
    switch (selectedMetric) {
      case 'densitateIT':
        return item.densitateIT;
      case 'angajatiCurent':
        return item.angajatiCurent;
      case 'rataCrestere':
        return item.rataCrestere;
      case 'cagr':
        return item.cagr || 0;
      case 'saturatie':
        return item.saturatieIndex || 0;
      case 'oportunitate':
        return item.oportunitateScor || 0;
      default:
        return 0;
    }
  };

  const getMetricLabel = (): string => {
    switch (selectedMetric) {
      case 'densitateIT':
        return 'Densitate IT (la 1000 loc.)';
      case 'angajatiCurent':
        return 'Angajați IT (mii)';
      case 'rataCrestere':
        return 'Rata creștere (%)';
      case 'cagr':
        return 'CAGR (%)';
      case 'saturatie':
        return 'Index Saturație (%)';
      case 'oportunitate':
        return 'Scor Oportunitate';
      default:
        return '';
    }
  };

  const getMetricExplanation = (): string => {
    switch (selectedMetric) {
      case 'densitateIT':
        return 'Angajați IT per 1000 locuitori - indicator demografic cheie. Arată concentrarea talentelor IT față de populația totală.';
      case 'angajatiCurent':
        return 'Numărul total de angajați IT în 2024. Mărime absolută a pieței locale fără corecție demografică.';
      case 'rataCrestere':
        return 'Creșterea anuală (2023→2024). Arată dinamica recentă și momentum-ul actual al pieței IT.';
      case 'cagr':
        return 'Compound Annual Growth Rate (2008-2024). Tendința istorică de creștere - indicator de sustenabilitate pe termen lung.';
      case 'saturatie':
        return 'Gradul de ocupare a pieței (raportat la max național). Valori mari = competiție intensă, costuri ridicate, dificil de scalat.';
      case 'oportunitate':
        return 'Scor combinat: CAGR ridicat (60%) + saturație scăzută (40%). Indică județe cu creștere rapidă și spațiu pentru investiții noi.';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Harta Interactivă România
        </h3>
        <span className="text-sm text-gray-600">
          Metric: {getMetricLabel()}
        </span>
      </div>
      
      {/* Explicație metrică */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 leading-relaxed">
          💡 <strong>Context:</strong> {getMetricExplanation()}
        </p>
      </div>
      
      <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={[45.9432, 24.9668]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapBounds data={data} />

          {data.map((item, index) => {
            const value = getMetricValue(item);
            const radius = getCircleRadius(value, maxValue, minValue, selectedMetric);
            const color = getCircleColor(value, maxValue, minValue, selectedMetric);

            return (
              <CircleMarker
                key={index}
                center={[item.lat, item.lng]}
                radius={radius}
                fillColor={color}
                fillOpacity={0.8}
                color="#ffffff"
                weight={2}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {item.judet}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Angajați IT:</span>{' '}
                        {(item.angajatiCurent / 1000).toFixed(1)} mii
                      </p>
                      {item.cagr !== undefined && (
                        <p>
                          <span className="font-medium">CAGR:</span>{' '}
                          {item.cagr.toFixed(1)}%
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Creștere:</span>{' '}
                        {item.rataCrestere.toFixed(1)}%
                      </p>
                      {item.saturatieIndex !== undefined && (
                        <p>
                          <span className="font-medium">Saturație:</span>{' '}
                          {item.saturatieIndex.toFixed(1)}%
                        </p>
                      )}
                      {item.oportunitateScor !== undefined && (
                        <p>
                          <span className="font-medium">Scor Oportunitate:</span>{' '}
                          {item.oportunitateScor.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legendă */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        {(selectedMetric === 'oportunitate' || viewMode === 'Oportunitate Investiții') ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#bbf7d0] border-2 border-white"></div>
              <span className="text-gray-600">Scăzut</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#4ade80] border-2 border-white"></div>
              <span className="text-gray-600">Mediu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#16a34a] border-2 border-white"></div>
              <span className="text-gray-600">Ridicat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#15803d] border-2 border-white"></div>
              <span className="text-gray-600">Foarte ridicat</span>
            </div>
          </>
        ) : (selectedMetric === 'saturatie' || viewMode === 'Competiție & Cost') ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#4ade80] border-2 border-white"></div>
              <span className="text-gray-600">Favorabil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#fbbf24] border-2 border-white"></div>
              <span className="text-gray-600">Moderat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#f59e0b] border-2 border-white"></div>
              <span className="text-gray-600">Aglomerat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#dc2626] border-2 border-white"></div>
              <span className="text-gray-600">Saturat</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#93c5fd] border-2 border-white"></div>
              <span className="text-gray-600">Scăzut</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#60a5fa] border-2 border-white"></div>
              <span className="text-gray-600">Mediu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#3b82f6] border-2 border-white"></div>
              <span className="text-gray-600">Ridicat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#1e40af] border-2 border-white"></div>
              <span className="text-gray-600">Foarte ridicat</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RomaniaMap;
