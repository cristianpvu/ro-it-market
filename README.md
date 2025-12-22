# Dashboard IT&C România - Analiză Disparități Regionale

Dashboard Business Intelligence profesional pentru analiza disparităților regionale în sectorul IT&C din România (2008-2024).

## 📋 Descriere Proiect

Aplicație web interactivă construită cu React, TypeScript și Vite, care permite analiza și vizualizarea datelor despre forța de muncă în sectorul IT&C din România, pe județe, în perioada 2008-2024.

### ✨ Funcționalități Principale

- **📊 KPI Dashboard**: Metrici cheie (Total angajați IT, Densitate medie, Top județul cu cea mai mare creștere)
- **🗺️ Hartă Interactivă**: Vizualizare geografică a datelor pe județe cu markers dimensionați dinamic
- **📈 Grafice Interactive**: 
  - Evoluție temporală (line charts)
  - Rankings (bar charts)
  - Comparații multiple județe
- **🔍 Filtrare Avansată**: Sidebar cu căutare, sortare și selecție multiplă județe
- **📤 Import/Export**: Upload CSV și export date procesate
- **🔄 Integrare API**: Pregătit pentru conectare la API INS TEMPO Online

## 🛠️ Tehnologii Utilizate

- **Frontend Framework**: React 18 cu TypeScript
- **Build Tool**: Vite (rapid, modern)
- **Styling**: Tailwind CSS (utility-first)
- **Charts**: Recharts (grafice responsive)
- **Maps**: React Leaflet + OpenStreetMap
- **Data Processing**: PapaParse (CSV parsing)
- **Icons**: Lucide React
- **HTTP Client**: Axios (pentru API INS)

## 🚀 Instalare și Pornire

### Cerințe Preliminare

- Node.js >= 18.x
- npm sau yarn

### Pași Instalare

```bash
# 1. Navighează în directorul proiectului
cd ro-itc-dashboard

# 2. Instalează dependențele
npm install

# 3. Pornește serverul de development
npm run dev

# 4. Deschide browser la http://localhost:3000
```

### Comenzi Disponibile

```bash
npm run dev      # Pornește dev server (port 3000)
npm run build    # Build pentru producție
npm run preview  # Preview build de producție
npm run lint     # Verificare cod (ESLint)
```

## 📊 Structura Datelor CSV

Pentru ca aplicația să funcționeze corect, fișierul CSV trebuie să aibă următoarea structură:

```csv
Judet,2008,2009,2010,...,2023,2024,Populatie
București,15.2,16.5,18.3,...,45.6,48.2,1883425
Cluj,3.5,4.2,5.1,...,12.3,14.5,691106
Timiș,2.8,3.3,4.0,...,9.5,11.2,683540
...
```

### Coloane Obligatorii:
- **Judet**: Numele județului (text)
- **2008-2024**: Număr angajați IT în mii (numeric)
- **Populatie**: Populație rezidentă (numeric)

### Fișier Exemplu

Un fișier CSV de exemplu este disponibil în `public/sample-data.csv`.

## 🗂️ Structura Proiectului

```
ro-itc-dashboard/
├── src/
│   ├── components/        # Componente React reutilizabile
│   │   ├── Header.tsx     # Header cu acțiuni
│   │   ├── Sidebar.tsx    # Sidebar cu filtre
│   │   ├── KPICard.tsx    # Card-uri metrici
│   │   ├── TrendChart.tsx # Grafic evoluție
│   │   ├── RankingChart.tsx # Grafic ranking
│   │   ├── RomaniaMap.tsx # Hartă interactivă
│   │   └── EmptyState.tsx # Stare inițială
│   ├── services/          # Servicii API și integrări
│   │   └── insAPI.ts      # Client API INS TEMPO
│   ├── utils/             # Utilități și helpers
│   │   ├── csvParser.ts   # Parser și validare CSV
│   │   └── dataProcessing.ts # Calcule și transformări
│   ├── types/             # TypeScript types
│   │   └── index.ts       # Interfețe date
│   ├── constants/         # Constante și configurări
│   │   └── index.ts       # Coordonate, culori, ani
│   ├── App.tsx            # Componenta principală
│   ├── main.tsx           # Entry point
│   └── index.css          # Stiluri globale
├── public/                # Fișiere statice
│   └── sample-data.csv    # Date exemplu
├── package.json           # Dependențe proiect
├── tsconfig.json          # Configurare TypeScript
├── tailwind.config.js     # Configurare Tailwind
├── vite.config.ts         # Configurare Vite
└── README.md              # Documentație
```

## 🔌 Integrare API INS TEMPO Online

Dashboard-ul este pregătit pentru integrare cu API-ul oficial INS România pentru date în timp real.

### Configurare API

1. Consultă documentația API: http://statistici.insse.ro:8077/tempo-online/
2. Obține codurile indicatorilor pentru sectorul IT&C
3. Actualizează fișierul `src/services/insAPI.ts` cu parametrii corecți
4. Implementează autentificare dacă este necesar

### Exemplu Folosire

```typescript
import { insAPI } from '@/services/insAPI';

// Obținere date IT workforce
const data = await insAPI.getITWorkforceByCounty(2008, 2024);

// Verificare stare API
const isHealthy = await insAPI.checkAPIHealth();
```

## 📈 Pipeline Procesare Date

### 1. Citire & Parsare CSV
```typescript
import { parseCSVFile } from '@/utils/csvParser';
const data = await parseCSVFile(file);
```

### 2. Curățare & Transformare
```typescript
// Automatică în csvParser.ts
// - Eliminare linii goale
// - Validare structură
// - Calculare densitate IT
// - Calculare rată creștere
```

### 3. Calculare Metrici
```typescript
import { calculateKPIs } from '@/utils/dataProcessing';
const kpis = calculateKPIs(data);
```

### 4. Pregătire Vizualizări
```typescript
import { prepareMapData, prepareTimeSeriesData } from '@/utils/dataProcessing';
const mapData = prepareMapData(data);
const chartData = prepareTimeSeriesData(data, selectedJudete);
```

## 🎨 UI/UX Design

Dashboard-ul folosește un design modern și profesional:

- **Layout**: Sidebar (320px) + Main Content (responsive)
- **Color Scheme**: Blue primary, accent colors pentru categorii
- **Typography**: Inter font (clean, professional)
- **Components**: Card-based layout cu shadows și borders
- **Interactions**: Hover effects, smooth transitions
- **Responsive**: Adaptat pentru desktop (optimizat pentru prezentări)

## 🚀 Deploy Production

### Build pentru Producție

```bash
npm run build
```

Fișierele optimizate vor fi generate în directorul `dist/`.

### Opțiuni Deploy

1. **Vercel** (recomandat pentru React)
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Netlify**
   - Conectează repository GitHub
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **GitHub Pages**
   ```bash
   npm run build
   # Deploy dist/ folder
   ```

## 📝 Considerații Importante

### Pentru Proiect Academic

- ✅ Dashboard-ul este ready-to-use pentru prezentări
- ✅ Cod bine structurat și comentat
- ✅ TypeScript pentru type safety
- ✅ Componente modulare și reutilizabile
- ✅ Design profesional "enterprise-ready"

### Limitări Actuale

- Integrarea API INS necesită studiu documentație oficială
- Codurile indicatorilor INS trebuie adaptate
- Posibile probleme CORS - recomandare proxy server
- Hartă folosește coordonate aproximative județe

### Îmbunătățiri Viitoare

- [ ] Autentificare utilizatori
- [ ] Export PDF/PNG rapoarte
- [ ] Comparații temporale avansate
- [ ] Predicții ML pentru evoluții viitoare
- [ ] Dashboard multi-limbă (RO/EN)
- [ ] Dark mode
- [ ] Real-time updates via WebSocket

## 📚 Resurse Utile

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts Guide](https://recharts.org/en-US/guide)
- [React Leaflet](https://react-leaflet.js.org/)
- [API INS TEMPO](http://statistici.insse.ro:8077/tempo-online/)

## 👨‍💻 Autor

Proiect dezvoltat pentru analiza disparităților regionale în sectorul IT&C din România (2008-2024).

## 📄 Licență

Acest proiect este dezvoltat în scop academic.

---

**Notă**: Pentru întrebări sau asistență tehnică, consultă documentația sau deschide un issue.
