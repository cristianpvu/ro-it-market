import * as XLSX from 'xlsx';
import type { JudetData } from '@/types';

// Mapare între numele din XLSX (fără diacritice) și numele corecte
const NUME_JUDETE_MAPPING: Record<string, string> = {
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

export class XLSXDataLoader {
  /**
   * Încarcă datele din fișierul XLSX din folderul public
   */
  static async loadData(): Promise<JudetData[]> {
    try {
      const response = await fetch('/Date_IT_Format_Dashboard (1).xlsx');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      const transformedData = this.transformData(rawData);
      
      return transformedData;
    } catch (error) {
      throw new Error(`Nu s-a putut citi fișierul XLSX: ${error}`);
    }
  }
  
  /**
   * Transformă datele din formatul XLSX în JudetData[]
   * rawData[0] = [null, 2008, 2009, 2010, ...] - anii
   * rawData[1] = ['Alba', 0.70, 0.60, 0.50, ...] - primul județ cu valorile
   */
  private static transformData(rawData: any[][]): JudetData[] {
    if (rawData.length < 2) {
      throw new Error('XLSX-ul trebuie să aibă cel puțin 2 rânduri (header + date)');
    }
    
    // Primul rând conține anii (coloana 0 e goală/nume, restul sunt anii)
    const years = rawData[0].slice(1).map(year => {
      const y = parseInt(String(year));
      return isNaN(y) ? null : y;
    }).filter(y => y !== null) as number[];
    
    const judete: JudetData[] = [];
    
    // De la rândul 1 în jos - fiecare rând e un județ
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      const numeJudetXLSX = String(row[0]).trim();
      
      if (!numeJudetXLSX || numeJudetXLSX === '') {
        continue; // Skip rânduri goale
      }
      
      // Normalizează numele județului folosind maparea
      const numeJudet = NUME_JUDETE_MAPPING[numeJudetXLSX] || numeJudetXLSX;
      
      const angajatiIT: Record<number, number> = {};
      
      for (let j = 0; j < years.length; j++) {
        const value = parseFloat(row[j + 1]); // +1 pentru că prima coloană e numele
        if (!isNaN(value)) {
          angajatiIT[years[j]] = value;
        }
      }
      
      // Calculează metrici
      const values = Object.values(angajatiIT);
      const latest = values.length > 0 ? values[values.length - 1] : 0;
      const oldest = values.length > 0 ? values[0] : 0;
      const rataCrestere = oldest !== 0 ? ((latest - oldest) / oldest) * 100 : 0;
      
      judete.push({
        judet: numeJudet,
        populatie: 0, // Nu avem date populație în XLSX
        angajatiIT,
        densitateIT: 0, // Nu putem calcula fără populație
        rataCrestere: parseFloat(rataCrestere.toFixed(2))
      });
    }
    
    return judete;
  }
}
