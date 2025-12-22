// Coordonate geografice pentru județele României (pentru hartă)
export const COORDONATE_JUDETE: Record<string, { lat: number; lng: number }> = {
  'Alba': { lat: 46.0667, lng: 23.5833 },
  'Arad': { lat: 46.1667, lng: 21.3167 },
  'Argeș': { lat: 44.8564, lng: 24.8672 },
  'Bacău': { lat: 46.5670, lng: 26.9146 },
  'Bihor': { lat: 47.0722, lng: 21.9211 },
  'Bistrița-Năsăud': { lat: 47.1333, lng: 24.5000 },
  'Botoșani': { lat: 47.7486, lng: 26.6589 },
  'Brașov': { lat: 45.6580, lng: 25.6012 },
  'Brăila': { lat: 45.2692, lng: 27.9575 },
  'București': { lat: 44.4268, lng: 26.1025 },
  'Buzău': { lat: 45.1500, lng: 26.8333 },
  'Caraș-Severin': { lat: 45.3000, lng: 21.8833 },
  'Călărași': { lat: 44.2000, lng: 27.3333 },
  'Cluj': { lat: 46.7712, lng: 23.6236 },
  'Constanța': { lat: 44.1598, lng: 28.6348 },
  'Covasna': { lat: 45.8667, lng: 25.7833 },
  'Dâmbovița': { lat: 44.9333, lng: 25.4500 },
  'Dolj': { lat: 44.3302, lng: 23.7949 },
  'Galați': { lat: 45.4353, lng: 28.0080 },
  'Giurgiu': { lat: 43.9037, lng: 25.9699 },
  'Gorj': { lat: 45.0333, lng: 23.2667 },
  'Harghita': { lat: 46.3667, lng: 25.8000 },
  'Hunedoara': { lat: 45.7494, lng: 22.9389 },
  'Ialomița': { lat: 44.5667, lng: 27.3667 },
  'Iași': { lat: 47.1585, lng: 27.6014 },
  'Ilfov': { lat: 44.5333, lng: 26.2167 },
  'Maramureș': { lat: 47.6567, lng: 23.5683 },
  'Mehedinți': { lat: 44.6308, lng: 22.6558 },
  'Mureș': { lat: 46.5500, lng: 24.5667 },
  'Neamț': { lat: 46.9276, lng: 26.3817 },
  'Olt': { lat: 44.4297, lng: 24.3697 },
  'Prahova': { lat: 45.1000, lng: 26.0167 },
  'Satu Mare': { lat: 47.7911, lng: 22.8853 },
  'Sălaj': { lat: 47.1833, lng: 23.0500 },
  'Sibiu': { lat: 45.7983, lng: 24.1256 },
  'Suceava': { lat: 47.6514, lng: 26.2578 },
  'Teleorman': { lat: 43.9833, lng: 25.3333 },
  'Timiș': { lat: 45.7489, lng: 21.2087 },
  'Tulcea': { lat: 45.1785, lng: 28.8050 },
  'Vaslui': { lat: 46.6407, lng: 27.7276 },
  'Vâlcea': { lat: 45.1000, lng: 24.3667 },
  'Vrancea': { lat: 45.6972, lng: 27.1836 },
};

export const ANI_DISPONIBILI = Array.from({ length: 17 }, (_, i) => 2008 + i); // 2008-2024

export const CULORI_HARTA = {
  low: '#bbf7d0',     // Verde deschis
  medium: '#4ade80',  // Verde
  high: '#16a34a',    // Verde închis
  veryHigh: '#15803d', // Verde foarte închis
};

export const CULORI_GRAFICE = [
  '#3b82f6', // Albastru
  '#8b5cf6', // Violet
  '#ec4899', // Roz
  '#f59e0b', // Portocaliu
  '#10b981', // Verde
  '#06b6d4', // Cyan
  '#ef4444', // Roșu
];
