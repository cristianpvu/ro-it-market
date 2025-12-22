import axios from 'axios';
import type { JudetData } from '@/types';

// Detectează automat environment-ul (local vs production)
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3001/api'
  : '/api'; // Pe Vercel, API-urile sunt la /api/*

// Mapare între numele din API TEMPO (fără diacritice) și numele corecte (cu diacritice)
const NUME_JUDETE_API_MAPPING: Record<string, string> = {
  'Alba': 'Alba',
  'Arad': 'Arad',
  'Arges': 'Argeș',
  'Bacau': 'Bacău',
  'Bihor': 'Bihor',
  'Bistrita-Nasaud': 'Bistrița-Năsăud',
  'Botosani': 'Botoșani',
  'Braila': 'Brăila',
  'Brasov': 'Brașov',
  'Buzau': 'Buzău',
  'Calarasi': 'Călărași',
  'Caras-Severin': 'Caraș-Severin',
  'Cluj': 'Cluj',
  'Constanta': 'Constanța',
  'Covasna': 'Covasna',
  'Dambovita': 'Dâmbovița',
  'Dolj': 'Dolj',
  'Galati': 'Galați',
  'Giurgiu': 'Giurgiu',
  'Gorj': 'Gorj',
  'Harghita': 'Harghita',
  'Hunedoara': 'Hunedoara',
  'Ialomita': 'Ialomița',
  'Iasi': 'Iași',
  'Ilfov': 'Ilfov',
  'Maramures': 'Maramureș',
  'Mehedinti': 'Mehedinți',
  'Municipiul Bucuresti': 'București',
  'Mures': 'Mureș',
  'Neamt': 'Neamț',
  'Olt': 'Olt',
  'Prahova': 'Prahova',
  'Salaj': 'Sălaj',
  'Satu Mare': 'Satu Mare',
  'Sibiu': 'Sibiu',
  'Suceava': 'Suceava',
  'Teleorman': 'Teleorman',
  'Timis': 'Timiș',
  'Tulcea': 'Tulcea',
  'Valcea': 'Vâlcea',
  'Vaslui': 'Vaslui',
  'Vrancea': 'Vrancea',
};

/**
 * Serviciu pentru interacțiunea cu API-ul TEMPO INS
 */
export const TempoAPIService = {
  /**
   * Endpoint principal - obține date IT + populație și le combină
   */
  async fetchData(): Promise<JudetData[]> {
    try {
      const REQUEST_BODY = {
        language: "ro",
        encQuery: "23426:105:3068,3069,3075,3087,3093,3094,3064,3071,3077,3082,3089,3095,3067,3070,3085,3090,3096,3100,3072,3073,3076,3080,3099,3102,3066,3105,3078,3106,3084,3092,3097,3086,3104,3079,3081,3088,3091,3101,3065,3074,3083,3098:4589,4608,4627,4646,4665,4684,4703,4722,4741,4760,4779,4798,4817,4836,4855,4874,4893:9606",
        matCode: "FOM103D",
        matMaxDim: 5,
        matUMSpec: 0,
        matRegJ: 3
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/pivot`,
        REQUEST_BODY,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      if (typeof response.data !== 'string') {
        throw new Error('Răspuns invalid de la API TEMPO - așteptam CSV string');
      }
      
      const itData = this.parseCSVData(response.data);
      
      // Request 2: Populație 2024 (POP105A)
      const populationData = await this.fetchPopulation();
      
      // Combină datele
      const combinedData = itData.map(judet => {
        const pop = populationData.find(p => p.judet === judet.judet);
        const angajatiCurent = judet.angajatiIT[2024] || 0;
        
        return {
          ...judet,
          populatie: pop?.populatie || 0,
          densitateIT: pop && pop.populatie > 0 
            ? (angajatiCurent / (pop.populatie / 1000))
            : 0
        };
      });
      
      return combinedData;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obține populație 2024 din POP105A cu payload exact ca în exemplul utilizatorului
   */
  async fetchPopulation(): Promise<Array<{ judet: string; populatie: number }>> {
    try {
      const payload = {
        language: 'ro',
        encQuery: '1:105:108:3068,3069,3075,3087,3093,3094,3064,3071,3077,3082,3089,3095,3067,3070,3085,3090,3096,3100,3072,3073,3076,3080,3099,3102,3066,3105,3078,3106,3084,3092,3097,3086,3104,3079,3081,3088,3091,3101,5725,3065,3074,3083,3098:4893:9685',
        matCode: 'POP105A',
        matMaxDim: 6,
        matUMSpec: 0,
        matRegJ: 4
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/pivot`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      if (typeof response.data !== 'string') {
        throw new Error('Răspuns invalid de la API TEMPO - așteptam CSV string');
      }
      
      if (response.data.length < 100) {
        return [];
      }
      
      return this.parsePopulationCSV(response.data);
    } catch (error) {
      return [];
    }
  },

  /**
   * Parsează CSV populație din POP105A
   * Format: "Total, Total, Total, Județul, Anul 2024, Numar persoane, Valoare"
   */
  parsePopulationCSV(csvData: string): Array<{ judet: string; populatie: number }> {
    const lines = csvData.trim().split('\n');
    const populationMap = new Map<string, number>();

    // Skip header (line 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map(p => p.trim());
      
      // Format așteptat: 7 coloane
      if (parts.length < 7) continue;

      const judetRaw = parts[3]; // ex: "Bihor", "Municipiul Bucuresti"
      const year = parts[4];      // ex: "Anul 2024"
      const valueStr = parts[6];  // ex: "555957"

      // Filtrare: doar anul 2024
      if (!year.includes('2024')) continue;

      // Mapare nume județe (de la API la nume standard)
      let judetMapped = NUME_JUDETE_API_MAPPING[judetRaw];
      
      // Cazuri speciale
      if (judetRaw === 'Municipiul Bucuresti') {
        judetMapped = 'București';
      } else if (judetRaw.includes('Regiunea')) {
        continue; // Skip regiunile, vrem doar județe
      }
      
      if (!judetMapped) {
        continue;
      }

      const value = parseInt(valueStr.replace(/\./g, '')) || 0;

      if (value > 0) {
        populationMap.set(judetMapped, value);
      }
    }

    const result = Array.from(populationMap.entries()).map(([judet, populatie]) => ({
      judet,
      populatie
    }));

    return result;
  },

  /**
   * Parsează datele CSV din răspunsul API
   * Format CSV: CAEN Rev.2, Sexe, Județ, Anul YYYY, UM, Valoare
   */
  parseCSVData(csvData: string): JudetData[] {
    const lines = csvData.trim().split('\n');
    
    if (lines.length < 2) {
      throw new Error('CSV gol sau invalid');
    }
    
    // Skip header (prima linie)
    const dataLines = lines.slice(1);
    

    const judeteMap = new Map<string, Record<number, number>>();
    
    for (const line of dataLines) {
      // Split pe virgulă - formatul: "J  INFORMATII SI COMUNICATII, Total, Bihor, Anul 2008, Mii persoane, 2.1"
      const parts = line.split(',').map(p => p.trim());
      
      if (parts.length < 6) continue;
      
      // Format: CAEN, Sexe, Județ, Anul YYYY, UM, Valoare
      const judetRaw = parts[2];
      const anText = parts[3]; // "Anul 2008"
      const valoareText = parts[5];
      
      // Extrage anul
      const anMatch = anText.match(/\d{4}/);
      if (!anMatch) continue;
      const an = parseInt(anMatch[0]);
      
      // Extrage valoarea (poate fi "2.1" sau ".9")
      const valoare = parseFloat(valoareText.replace(',', '.'));
      if (isNaN(valoare)) continue;
      
      // Normalizează numele județului
      const numeJudet = NUME_JUDETE_API_MAPPING[judetRaw];
      
      if (!numeJudet) {
        continue;
      }
      
      // Convertește din mii persoane în persoane (x 1000)
      const valoareReala = valoare * 1000;
      
      // Adaugă în map
      if (!judeteMap.has(numeJudet)) {
        judeteMap.set(numeJudet, {});
      }
      
      judeteMap.get(numeJudet)![an] = valoareReala;
    }
    const judete: JudetData[] = [];
    
    for (const [judet, angajatiIT] of judeteMap.entries()) {
      const years = Object.keys(angajatiIT).map(Number).sort();
      
      if (years.length === 0) continue;
      
      // Calculează CAGR (Compound Annual Growth Rate)
      const oldest = angajatiIT[years[0]] || 1;
      const latest = angajatiIT[years[years.length - 1]] || 1;
      const nYears = years.length - 1;
      const cagr = nYears > 0 ? (Math.pow(latest / oldest, 1 / nYears) - 1) * 100 : 0;
      
      // Calculează rata totală de creștere
      const rataCrestere = oldest !== 0 ? ((latest - oldest) / oldest) * 100 : 0;
      
      judete.push({
        judet,
        populatie: 0, // Nu avem date populație din acest API
        angajatiIT,
        densitateIT: 0, // Nu putem calcula fără populație
        rataCrestere: parseFloat(rataCrestere.toFixed(2)),
        cagr: parseFloat(cagr.toFixed(2))
      });
    }
    
    return judete;
  }
}
