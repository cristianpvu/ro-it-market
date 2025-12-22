// Tipuri pentru datele județelor și angajaților IT
export interface JudetData {
  judet: string;
  populatie: number;
  angajatiIT: Record<number, number>; // Anul -> număr angajați (mii)
  densitateIT: number; // Angajați la 1000 locuitori
  rataCrestere: number; // Procent creștere 2008-2024
  cagr?: number; // Compound Annual Growth Rate
}

export interface TimeSeriesData {
  year: number;
  [key: string]: number | string;
}

export interface KPIMetrics {
  totalAngajatiIT: number;
  mediaNationalaDensitate: number;
  judetTopCrestere: string;
  rataCrestereMaxima: number;
  numarJudete: number;
}

export interface FilterOptions {
  selectedJudete: string[];
  yearRange: [number, number];
  minDensitate?: number;
  maxDensitate?: number;
}

export interface MapRegionData {
  judet: string;
  lat: number;
  lng: number;
  densitateIT: number;
  angajatiCurent: number;
  rataCrestere: number;
  cagr?: number;
  saturatieIndex?: number;
  oportunitateScor?: number;
  stabilitateScor?: number;
}

// Date pentru API INS TEMPO
export interface INSTempoResponse {
  success: boolean;
  data: any[];
  metadata?: {
    lastUpdated: string;
    source: string;
  };
}
