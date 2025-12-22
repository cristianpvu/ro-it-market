import Papa from 'papaparse';
import { JudetData } from '@/types';

/**
 * Funcție pentru citirea și parsarea fișierului CSV
 */
export const parseCSVFile = (file: File): Promise<JudetData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const cleanedData = cleanAndTransformData(results.data);
          resolve(cleanedData);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

/**
 * Funcție pentru citirea CSV din URL sau string
 */
export const parseCSVFromURL = async (url: string): Promise<JudetData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const cleanedData = cleanAndTransformData(results.data);
          resolve(cleanedData);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

/**
 * Curățarea și transformarea datelor din format CSV în structura aplicației
 */
export const cleanAndTransformData = (rawData: any[]): JudetData[] => {
  return rawData
    .filter((row) => row.Judet && row.Populatie) // Filtrare linii goale
    .map((row) => {
      // Extragere date pentru fiecare an (2008-2024)
      const angajatiIT: Record<number, number> = {};
      for (let year = 2008; year <= 2024; year++) {
        const value = row[year.toString()];
        angajatiIT[year] = value !== null && value !== undefined ? Number(value) : 0;
      }

      // Calculare densitate IT (angajați la 1000 locuitori)
      const populatie = Number(row.Populatie);
      const angajatiCurent = angajatiIT[2024] || 0;
      const densitateIT = populatie > 0 ? (angajatiCurent * 1000) / populatie : 0;

      // Calculare rata de creștere % (2008-2024)
      const angajati2008 = angajatiIT[2008] || 0;
      const angajati2024 = angajatiIT[2024] || 0;
      const rataCrestere = angajati2008 > 0 
        ? ((angajati2024 - angajati2008) / angajati2008) * 100 
        : 0;

      return {
        judet: row.Judet.trim(),
        populatie,
        angajatiIT,
        densitateIT: Number(densitateIT.toFixed(2)),
        rataCrestere: Number(rataCrestere.toFixed(2)),
      };
    })
    .sort((a, b) => b.densitateIT - a.densitateIT); // Sortare descrescătoare după densitate
};

/**
 * Validare structură date CSV
 */
export const validateCSVStructure = (data: any[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data || data.length === 0) {
    errors.push('Fișierul CSV este gol');
    return { valid: false, errors };
  }

  const firstRow = data[0];
  
  // Verificare coloane obligatorii
  if (!firstRow.hasOwnProperty('Judet')) {
    errors.push('Lipsește coloana "Judet"');
  }
  
  if (!firstRow.hasOwnProperty('Populatie')) {
    errors.push('Lipsește coloana "Populatie"');
  }

  // Verificare coloane ani
  for (let year = 2008; year <= 2024; year++) {
    if (!firstRow.hasOwnProperty(year.toString())) {
      errors.push(`Lipsește coloana pentru anul ${year}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Exportare date în format CSV
 */
export const exportToCSV = (data: JudetData[], filename: string = 'export-itc-data.csv') => {
  const csv = Papa.unparse(data.map(item => ({
    Judet: item.judet,
    Populatie: item.populatie,
    ...item.angajatiIT,
    DensitateIT: item.densitateIT,
    RataCrestere: item.rataCrestere,
  })));

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
