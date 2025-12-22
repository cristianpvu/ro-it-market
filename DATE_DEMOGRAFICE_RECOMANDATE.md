# 📊 Date Demografice Recomandate pentru Analiza Pieței IT

## 🎯 Obiectiv Academic
Acest document identifică matricile INS TEMPO cu **factori demografici** care explică și justifică fenomenele din industria IT din România.

---

## 1️⃣ **Structura pe Vârste (PRIORITATE 1)**

### **POP107A** - Populație pe grupe de vârstă
```javascript
{
  matCode: 'POP107A',
  language: 'ro',
  // Grupe relevante: 20-24, 25-29, 30-34, 35-39 (demographic IT)
}
```

**Justificare academică:**
- **Ipoteză**: Județele cu populație tânără (20-40 ani) au piață IT mai dezvoltată
- **Metrici noi**:
  - `Procent Tineri (20-40 ani) / Total Populație`
  - `Raport Dependență Demografică IT` = (Sub 20 + Peste 65) / (20-65)
  - `Workforce IT Potențial` = Populația 20-40 ani × Rată Educație IT

**Fenomene explicabile:**
- De ce Cluj/București au cele mai multe startup-uri IT? → Populație tânără concentrată
- De ce județele rurale au densitate IT scăzută? → Îmbătrânire demografică accentuată

---

## 2️⃣ **Educație (PRIORITATE 1)**

### **SCL101A** - Absolvenți învățământ superior
```javascript
{
  matCode: 'SCL101A',
  language: 'ro',
  // Filtru: Profilul Științe exacte, Inginerie, TIC
}
```

**Justificare academică:**
- **Ipoteză**: Densitatea IT corelează direct cu numărul absolvenților tehnici
- **Metrici noi**:
  - `Indice Educație IT` = Absolvenți TIC per 1000 locuitori (20-30 ani)
  - `Pipeline Talent IT` = Studenți TIC actuali / Angajați IT actuali
  - `Brain Gain Potential` = Absolvenți TIC / Locuri muncă IT disponibile

### **SCL102B** - Studenți înscriși pe domenii
```javascript
{
  matCode: 'SCL102B',
  language: 'ro',
  // Domenii: Informatică, Automatică, Telecomunicații
}
```

**Fenomene explicabile:**
- Existența clusterelor IT (Cluj, Iași, Timișoara) → Prezența universităților tehnice majore
- Creștere accelerată București → Concentrare instituții educaționale + atragere studenți din țară
- Stagnare județe fără universități → Lipsa pipeline-ului local de talente

---

## 3️⃣ **Migrație Internă (PRIORITATE 1)**

### **POP201A** - Migrație internă pe județe
```javascript
{
  matCode: 'POP201A',
  language: 'ro',
  // Flux: Sosiri - Plecări per județ
}
```

**Justificare academică:**
- **Ipoteză**: "Brain Drain" vs "Brain Gain" explică dinamica pieței IT
- **Metrici noi**:
  - `Sold Migratoriu Net` = Sosiri - Plecări (20-40 ani)
  - `Indice Atracție Talente` = (Sosiri Tineri / Plecări Tineri) × 100
  - `Rataj Retenție Talent` = (1 - Plecări Absolvenți TIC / Total Absolvenți TIC) × 100

**Fenomene explicabile:**
- Cluj TOP 3 IT → Sold migratoriu pozitiv masiv (tineri din toată țara)
- Teleorman/Vaslui stagnare IT → Brain drain continuu către București/străinătate
- București = hub național → Atragere neto >50k tineri/an

---

## 4️⃣ **Urban vs Rural (PRIORITATE 2)**

### **POP323A** - Populație pe medii de rezidență
```javascript
{
  matCode: 'POP323A',
  language: 'ro',
  // Urban / Rural split per județ
}
```

**Justificare academică:**
- **Ipoteză**: Urbanizare accelerată corelează cu dezvoltare IT
- **Metrici noi**:
  - `Grad Urbanizare` = Populație Urbană / Populație Totală × 100
  - `Densitate IT Urbană` = Angajați IT / Populație Urbană × 1000
  - `Rural IT Gap` = Densitate IT Urban / Densitate IT Rural

**Fenomene explicabile:**
- Concentrare IT în orașele mari → Infrastructură, internet de viteză, ecosistem
- Acces limitat zone rurale → Lipsa digitalizării, educație sub-standard

---

## 5️⃣ **Fertilitate & Natalitate (PERSPECTIVĂ LONG-TERM)**

### **POP301D** - Rata natalității
```javascript
{
  matCode: 'POP301D',
  language: 'ro'
}
```

### **POP302A** - Indicatori de fertilitate
```javascript
{
  matCode: 'POP302A',
  language: 'ro'
}
```

**Justificare academică:**
- **Ipoteză**: Natalitate scăzută → Contracție demografică → Criză workforce IT viitor
- **Metrici noi**:
  - `Proiecție Workforce IT 2035` = Natalitate 2015-2020 × Rată Educație TIC
  - `Sustainability Index` = Natalitate × Grad Urbanizare × Educație Superioară

**Fenomene explicabile:**
- De ce piața IT va avea criză talente în 2030-2035? → Natalitate în scădere de 15 ani
- Presiune creștere salarii IT → Ofertă insuficientă de tineri calificați

---

## 6️⃣ **Șomaj & Piața Muncii (COMPLEMENTAR)**

### **SOM104C** - Șomaj pe grupe de vârstă
```javascript
{
  matCode: 'SOM104C',
  language: 'ro',
  // Focus: Șomaj tineri 20-29 ani
}
```

**Justificare academică:**
- **Ipoteză inversă**: Județele cu șomaj tânăr ridicat au potențial IT neexploatat
- **Metrici noi**:
  - `IT Opportunity Gap` = Șomaj Tineri × Absolvenți TIC × (1 - Densitate IT)
  - `Talent Reservoir` = Șomeri cu studii superioare / Angajați IT actuali

**Fenomene explicabile:**
- Zone cu șomaj ridicat + educație bună = oportunitate investiții IT (costuri scăzute)
- Vaslui, Teleorman → Șomaj ridicat dar lipsa ecosistem IT = talent neutilizat

---

## 7️⃣ **Îmbătrânire Demografică (CONTEXT MACROECONOMIC)**

### **POP108A** - Indicatori îmbătrânire demografică
```javascript
{
  matCode: 'POP108A',
  language: 'ro'
}
```

**Justificare academică:**
- **Ipoteză**: Județe cu îmbătrânire accentuată → Recesiune economică → Scădere investiții IT
- **Metrici noi**:
  - `Indice Îmbătrânire` = Populație >65 ani / Populație <15 ani
  - `Dependency Ratio IT` = (Copii + Pensionari) / Populație Activă IT

**Fenomene explicabile:**
- Sud/Est România → Îmbătrânire accelerată = ecosistem IT slab dezvoltat
- Cluj/Ilfov → Populație tânără = investiții masive IT

---

## 🎓 **Argumentare Academică - Cadrul Teoretic**

### Model Conceptual: **Determinanți Demografici ai Dezvoltării IT**

```
┌─────────────────────────────────────────────────────┐
│          FACTORI DEMOGRAFICI (Cauze)                │
├─────────────────────────────────────────────────────┤
│ 1. Structura Vârstă (20-40 ani)                     │
│ 2. Educație TIC (pipeline talent)                   │
│ 3. Migrație Internă (brain gain/drain)              │
│ 4. Urbanizare (concentrare urbană)                  │
│ 5. Fertilitate (proiecție viitor)                   │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│      FENOMENE INDUSTRIE IT (Efecte)                 │
├─────────────────────────────────────────────────────┤
│ → Densitate IT (angajați per 1000 loc)              │
│ → CAGR (creștere anuală compusă)                    │
│ → Saturație Piață (competiție resurse)              │
│ → Salarizare (ofertă vs cerere)                     │
│ → Clustering geografic (Cluj, București, Iași)      │
│ → Decalaj regional (Nord-Vest vs Sud-Est)           │
└─────────────────────────────────────────────────────┘
```

---

## 📈 **Analize Recomandate pentru Proiect**

### 1. **Regresie Multiplă**
```
Densitate_IT = β₀ + β₁(Procent_Tineri) + β₂(Absolventi_TIC) + 
               β₃(Sold_Migratoriu) + β₄(Grad_Urbanizare) + ε
```

### 2. **Analiza Clustering**
- Grupare județe după profil demografic
- Identificare pattern-uri: "Huburi IT", "Zone Potențial", "Deșerturi IT"

### 3. **Proiecții Demografice**
- Scenarii workforce IT 2030/2035 bazate pe natalitate actuală
- Impact îmbătrânire pe sustenabilitate piață IT

### 4. **Harta Corelații**
```
Heatmap: Densitate IT vs:
- % Populație 20-40 ani
- Absolvenți TIC per capita
- Sold migratoriu net
- Grad urbanizare
- Rată fertilitate
```

---

## 🚀 **Implementare Tehnică**

### Endpoint Unificat (tempoAPI.ts)
```typescript
async fetchDemographicData(): Promise<DemographicData> {
  const [
    population,
    ageStructure,
    education,
    migration,
    urbanization
  ] = await Promise.all([
    this.fetchPopulation(),      // POP105A
    this.fetchAgeGroups(),        // POP107A
    this.fetchEducation(),        // SCL101A
    this.fetchMigration(),        // POP201A
    this.fetchUrbanRural()        // POP323A
  ]);
  
  return this.combineDemographicFactors({
    population,
    ageStructure,
    education,
    migration,
    urbanization
  });
}
```

### Metrici Compuse Noi
```typescript
interface EnhancedJudetData extends JudetData {
  // Demografice
  populatieTineri2040: number;      // 20-40 ani
  gradUrbanizare: number;           // %
  absolventiTIC: number;            // ultimii 3 ani
  soldMigratoriu: number;           // net
  
  // Indicatori derivați
  pipelineTalent: number;           // (Studenți TIC / Angajați IT) × 100
  indiceImbatrânire: number;        // (>65 ani / <15 ani)
  potențialIT: number;              // Scor compus 0-100
}
```

---

## ✅ **Checklist Implementare**

- [x] POP105A - Populație totală (IMPLEMENTAT)
- [ ] POP107A - Structura pe vârste
- [ ] SCL101A - Absolvenți învățământ superior
- [ ] POP201A - Migrație internă
- [ ] POP323A - Urban vs Rural
- [ ] POP301D - Natalitate
- [ ] SOM104C - Șomaj pe vârste
- [ ] POP108A - Îmbătrânire

---

## 📚 **Referințe Teoretice Sugerate**

1. **Teoria Capitalului Uman** (Becker, 1964)
   - Educație = investiție în productivitate
   - Aplicare: Absolvenți TIC → creștere densitate IT

2. **Push-Pull Migration Theory** (Lee, 1966)
   - Migrație determinată de oportunități economice
   - Aplicare: Brain drain zone rurale → Brain gain Cluj/București

3. **Urban-Rural Digital Divide** (OECD, 2020)
   - Inegalități acces tehnologie urban vs rural
   - Aplicare: Concentrare IT în orașe > 100k locuitori

4. **Demographic Dividend** (Bloom et al., 2003)
   - Populație tânără = avantaj economic
   - Aplicare: Workforce IT susținut de cohortă 20-40 ani

---

**Autor**: Sistem de recomandare date demografice  
**Data**: 22 Decembrie 2025  
**Materie**: Demografie - Analiza Pieței IT România
