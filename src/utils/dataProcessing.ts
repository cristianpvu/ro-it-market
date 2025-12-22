import { JudetData, KPIMetrics, TimeSeriesData, MapRegionData } from '@/types';
import { COORDONATE_JUDETE } from '@/constants';

/**
 * Calculare metrici KPI pentru dashboard
 */
export const calculateKPIs = (data: JudetData[]): KPIMetrics => {
  if (!data || data.length === 0) {
    return {
      totalAngajatiIT: 0,
      mediaNationalaDensitate: 0,
      judetTopCrestere: 'N/A',
      rataCrestereMaxima: 0,
      numarJudete: 0,
    };
  }

  // Total angajați IT (anul 2024)
  const totalAngajatiIT = data.reduce((sum, item) => sum + (item.angajatiIT[2024] || 0), 0);

  // Media națională densitate IT
  const mediaNationalaDensitate = data.reduce((sum, item) => sum + item.densitateIT, 0) / data.length;

  // Județul cu cea mai mare rată de creștere
  const judetMaxCrestere = data.reduce((max, item) => 
    item.rataCrestere > max.rataCrestere ? item : max
  , data[0]);

  return {
    totalAngajatiIT: Number(totalAngajatiIT.toFixed(1)),
    mediaNationalaDensitate: Number(mediaNationalaDensitate.toFixed(2)),
    judetTopCrestere: judetMaxCrestere.judet,
    rataCrestereMaxima: judetMaxCrestere.rataCrestere,
    numarJudete: data.length,
  };
};

/**
 * Pregătire date pentru grafic de serie temporală
 */
export const prepareTimeSeriesData = (
  data: JudetData[],
  selectedJudete: string[]
): TimeSeriesData[] => {
  const years = Array.from({ length: 17 }, (_, i) => 2008 + i);
  
  if (selectedJudete.length === 0) {
    // Dacă nu e selectat nimic, afișăm media națională
    return years.map(year => ({
      year,
      value: data.reduce((sum, item) => sum + (item.angajatiIT[year] || 0), 0) / data.length,
    }));
  }

  // Date pentru județele selectate
  const result: TimeSeriesData[] = [];
  
  selectedJudete.forEach(judetName => {
    const judetData = data.find(d => d.judet === judetName);
    if (judetData) {
      years.forEach(year => {
        result.push({
          year,
          value: judetData.angajatiIT[year] || 0,
          judet: judetName,
        });
      });
    }
  });

  return result;
};

/**
 * Pregătire date pentru hartă interactivă
 */
export const prepareMapData = (data: JudetData[]): MapRegionData[] => {
  const filtered = data.filter(item => {
    return !!COORDONATE_JUDETE[item.judet];
  });
  
  return filtered.map(item => {
    const coords = COORDONATE_JUDETE[item.judet];
    return {
      judet: item.judet,
      lat: coords.lat,
      lng: coords.lng,
      densitateIT: item.densitateIT,
      angajatiCurent: item.angajatiIT[2024] || 0,
      rataCrestere: item.rataCrestere,
    };
  });
};

/**
 * Filtrare date pe baza criteriilor selectate
 */
export const filterData = (
  data: JudetData[],
  filters: {
    selectedJudete?: string[];
    yearRange?: [number, number];
    minDensitate?: number;
    maxDensitate?: number;
  }
): JudetData[] => {
  let filtered = [...data];

  // Filtrare după județe selectate
  if (filters.selectedJudete && filters.selectedJudete.length > 0) {
    filtered = filtered.filter(item => filters.selectedJudete!.includes(item.judet));
  }

  // Filtrare după densitate IT
  if (filters.minDensitate !== undefined) {
    filtered = filtered.filter(item => item.densitateIT >= filters.minDensitate!);
  }
  
  if (filters.maxDensitate !== undefined) {
    filtered = filtered.filter(item => item.densitateIT <= filters.maxDensitate!);
  }

  return filtered;
};

/**
 * Grupare județe după regiuni
 */
export const groupByRegion = (data: JudetData[]): Record<string, JudetData[]> => {
  const regiuni: Record<string, string[]> = {
    'Centru': ['Alba', 'Brașov', 'Covasna', 'Harghita', 'Mureș', 'Sibiu'],
    'Nord-Est': ['Bacău', 'Botoșani', 'Iași', 'Neamț', 'Suceava', 'Vaslui'],
    'Nord-Vest': ['Bihor', 'Bistrița-Năsăud', 'Cluj', 'Maramureș', 'Satu Mare', 'Sălaj'],
    'Sud-Est': ['Brăila', 'Buzău', 'Constanța', 'Galați', 'Tulcea', 'Vrancea'],
    'Sud-Muntenia': ['Argeș', 'Călărași', 'Dâmbovița', 'Giurgiu', 'Ialomița', 'Prahova', 'Teleorman'],
    'Sud-Vest Oltenia': ['Dolj', 'Gorj', 'Mehedinți', 'Olt', 'Vâlcea'],
    'Vest': ['Arad', 'Caraș-Severin', 'Hunedoara', 'Timiș'],
    'București-Ilfov': ['București', 'Ilfov'],
  };

  const grouped: Record<string, JudetData[]> = {};

  Object.entries(regiuni).forEach(([regiune, judete]) => {
    grouped[regiune] = data.filter(item => judete.includes(item.judet));
  });

  return grouped;
};

/**
 * Top N județe după un criteriu
 */
export const getTopJudete = (
  data: JudetData[],
  criterion: 'densitateIT' | 'rataCrestere' | 'angajatiCurent',
  limit: number = 10
): JudetData[] => {
  const sorted = [...data].sort((a, b) => {
    if (criterion === 'angajatiCurent') {
      return (b.angajatiIT[2024] || 0) - (a.angajatiIT[2024] || 0);
    }
    return b[criterion] - a[criterion];
  });

  return sorted.slice(0, limit);
};
