import { JudetData } from '@/types';

// Mapare regiuni pentru județe
const REGION_MAP: Record<string, string> = {
  'București': 'București-Ilfov',
  'Ilfov': 'București-Ilfov',
  'Cluj': 'Nord-Vest',
  'Bihor': 'Nord-Vest',
  'Satu Mare': 'Nord-Vest',
  'Maramureș': 'Nord-Vest',
  'Sălaj': 'Nord-Vest',
  'Bistrița-Năsăud': 'Nord-Vest',
  'Timiș': 'Vest',
  'Arad': 'Vest',
  'Hunedoara': 'Vest',
  'Caraș-Severin': 'Vest',
  'Iași': 'Nord-Est',
  'Bacău': 'Nord-Est',
  'Suceava': 'Nord-Est',
  'Botoșani': 'Nord-Est',
  'Neamț': 'Nord-Est',
  'Vaslui': 'Nord-Est',
  'Constanța': 'Sud-Est',
  'Galați': 'Sud-Est',
  'Brăila': 'Sud-Est',
  'Tulcea': 'Sud-Est',
  'Buzău': 'Sud-Est',
  'Vrancea': 'Sud-Est',
  'Dolj': 'Sud-Vest Oltenia',
  'Gorj': 'Sud-Vest Oltenia',
  'Mehedinți': 'Sud-Vest Oltenia',
  'Vâlcea': 'Sud-Vest Oltenia',
  'Olt': 'Sud-Vest Oltenia',
  'Prahova': 'Sud Muntenia',
  'Argeș': 'Sud Muntenia',
  'Dâmbovița': 'Sud Muntenia',
  'Teleorman': 'Sud Muntenia',
  'Giurgiu': 'Sud Muntenia',
  'Ialomița': 'Sud Muntenia',
  'Călărași': 'Sud Muntenia',
  'Brașov': 'Centru',
  'Sibiu': 'Centru',
  'Mureș': 'Centru',
  'Alba': 'Centru',
  'Harghita': 'Centru',
  'Covasna': 'Centru',
};

/**
 * Exportă datele în format CSV optimizat pentru Excel
 * Format: Județ | Regiune | 2008 | 2009 | ... | 2024 | CAGR | Densitate | Populație
 */
export const exportToCSV = (data: JudetData[], yearRange?: [number, number]): string => {
  if (data.length === 0) return '';
  
  const allYears = new Set<number>();
  data.forEach(item => {
    Object.keys(item.angajatiIT).forEach(year => allYears.add(Number(year)));
  });
  let years = Array.from(allYears).sort();
  
  if (yearRange) {
    years = years.filter(y => y >= yearRange[0] && y <= yearRange[1]);
  }
  
  const headers = [
    'Judet',
    'Regiune',
    ...years.map(y => `Angajati_IT_${y}`),
    'CAGR_Procent',
    'Rata_Crestere_Procent',
    'Densitate_IT_per_1000_loc',
    'Populatie_Total'
  ];
  
  const csvRows = [headers.join(';')];
  
  data.forEach(item => {
    const regiune = REGION_MAP[item.judet] || 'Alte Regiuni';
    const row = [
      item.judet,
      regiune,
      ...years.map(year => {
        const value = item.angajatiIT[year] || 0;
        return Math.round(value).toString();
      }),
      item.cagr?.toFixed(2).replace('.', ',') || '0',
      item.rataCrestere.toFixed(2).replace('.', ','),
      item.densitateIT.toFixed(2).replace('.', ','),
      item.populatie || '0'
    ];
    csvRows.push(row.join(';'));
  });
  
  csvRows.push('');
  csvRows.push('');
  csvRows.push('Metadata');
  csvRows.push(`Perioada analizata;${yearRange ? `${yearRange[0]}-${yearRange[1]}` : '2008-2024'}`);
  csvRows.push(`Numar ani;${yearRange ? yearRange[1] - yearRange[0] + 1 : 17}`);
  csvRows.push(`Data export;${new Date().toLocaleDateString('ro-RO')}`);
  csvRows.push(`Sursa date;INS TEMPO - Matricea FOM103D si POP105A`);
  
  return csvRows.join('\r\n');
};

/**
 * Downloadează CSV-ul cu encoding UTF-8 BOM pentru Excel
 */
export const downloadCSV = (data: JudetData[], filename: string = 'raport_it_romania.csv', yearRange?: [number, number]) => {
  const csv = exportToCSV(data, yearRange);
  
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csv;
  
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Adaugă perioada în numele fișierului
  const periodSuffix = yearRange ? `_${yearRange[0]}-${yearRange[1]}` : '';
  const finalFilename = filename.replace('.csv', `${periodSuffix}.csv`);
  
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Calculează metrici suplimentare pentru analiză avansată
 */
export interface AdvancedMetrics {
  judet: string;
  regiune: string;
  cagr: number;
  saturatieIndex: number;
  stabilitateScor: number;
  oportunitateScor: number;
  angajatiCurent: number;
  populatie: number;
  densitateIT: number;
}

export const calculateAdvancedMetrics = (data: JudetData[], yearRange?: [number, number]): AdvancedMetrics[] => {
  const maxAngajati = Math.max(...data.map(d => {
    const values = Object.values(d.angajatiIT);
    return values.length > 0 ? Math.max(...values) : 0;
  }), 1);
  
  const rawMetrics = data.map(item => {
    const allYears = Object.keys(item.angajatiIT).map(Number).sort();
    
    const years = yearRange 
      ? allYears.filter(y => y >= yearRange[0] && y <= yearRange[1])
      : allYears;
    
    if (years.length === 0) {
      return {
        judet: item.judet,
        cagr: 0,
        saturatieIndex: 0,
        stabilitateScor: 0,
        oportunitateScorRaw: 0,
        angajatiCurent: 0
      };
    }
    
    const angajatiCurent = item.angajatiIT[years[years.length - 1]] || 0;
    
    const firstYear = years[0];
    const lastYear = years[years.length - 1];
    const firstValue = item.angajatiIT[firstYear] || 1;
    const lastValue = item.angajatiIT[lastYear] || 1;
    const nYears = lastYear - firstYear;
    const cagr = nYears > 0 ? ((Math.pow(lastValue / firstValue, 1 / nYears) - 1) * 100) : 0;
    
    const yearlyGrowth: number[] = [];
    for (let i = 1; i < years.length; i++) {
      const prev = item.angajatiIT[years[i - 1]] || 1;
      const curr = item.angajatiIT[years[i]] || 1;
      const growth = ((curr - prev) / prev) * 100;
      yearlyGrowth.push(growth);
    }
    
    const avgGrowth = yearlyGrowth.length > 0 ? yearlyGrowth.reduce((a, b) => a + b, 0) / yearlyGrowth.length : 0;
    const variance = yearlyGrowth.length > 0 ? yearlyGrowth.reduce((sum, g) => sum + Math.pow(g - avgGrowth, 2), 0) / yearlyGrowth.length : 0;
    const stdDev = Math.sqrt(variance);
    const stabilitateScor = Math.max(0, Math.min(100, 100 - stdDev));
    
    const saturatieIndex = (angajatiCurent / maxAngajati) * 100;
    
    const oportunitateScorRaw = (cagr * 0.6) + ((100 - saturatieIndex) * 0.4);
    
    return {
      judet: item.judet,
      cagr,
      saturatieIndex,
      stabilitateScor,
      oportunitateScorRaw,
      angajatiCurent
    };
  });
  
  const sortedByScore = [...rawMetrics].sort((a, b) => b.oportunitateScorRaw - a.oportunitateScorRaw);
  
  return rawMetrics.map(item => {
    const regiune = REGION_MAP[item.judet] || 'Alte Regiuni';
    
    const rank = sortedByScore.findIndex(m => m.judet === item.judet);
    const totalCount = sortedByScore.length;
    
    const percentile = (totalCount - rank) / totalCount;
    let oportunitateScor: number;
    
    if (percentile >= 0.8) {
      oportunitateScor = 75 + ((percentile - 0.8) / 0.2) * 25;
    } else if (percentile >= 0.6) {
      oportunitateScor = 50 + ((percentile - 0.6) / 0.2) * 25;
    } else if (percentile >= 0.4) {
      oportunitateScor = 35 + ((percentile - 0.4) / 0.2) * 15;
    } else if (percentile >= 0.2) {
      oportunitateScor = 15 + ((percentile - 0.2) / 0.2) * 20;
    } else {
      oportunitateScor = (percentile / 0.2) * 15;
    }
    
    const originalData = data.find(d => d.judet === item.judet);
    
    return {
      judet: item.judet,
      regiune,
      cagr: parseFloat(item.cagr.toFixed(2)),
      saturatieIndex: parseFloat(item.saturatieIndex.toFixed(1)),
      stabilitateScor: parseFloat(item.stabilitateScor.toFixed(1)),
      oportunitateScor: parseFloat(oportunitateScor.toFixed(1)),
      angajatiCurent: item.angajatiCurent,
      populatie: originalData?.populatie || 0,
      densitateIT: originalData?.densitateIT || 0
    };
  });
};

