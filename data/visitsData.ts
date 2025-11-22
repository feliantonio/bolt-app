import { Recommendation, AnalysisTest } from '@/types/visits';

export const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Ecografia Tiroidea',
    reason: 'Aumento incidenza nella tua zona + familiarità',
    priority: 'Alta',
    icon: 'stethoscope',
    category: 'Endocrinologia',
  },
  {
    id: '2',
    title: 'Controllo Cardiologico',
    reason: 'Variabilità HRV sotto la media per la tua età',
    priority: 'Media',
    icon: 'heart-pulse',
    category: 'Cardiologia',
  },
  {
    id: '3',
    title: 'Visita Dermatologica',
    reason: 'Screening melanoma raccomandato annualmente',
    priority: 'Media',
    icon: 'scan',
    category: 'Dermatologia',
  },
  {
    id: '4',
    title: 'Esame Vista',
    reason: 'Controllo periodico dopo i 40 anni',
    priority: 'Bassa',
    icon: 'eye',
    category: 'Oculistica',
  },
  {
    id: '5',
    title: 'Densitometria Ossea',
    reason: 'Prevenzione osteoporosi - storia familiare',
    priority: 'Alta',
    icon: 'bone',
    category: 'Ortopedia',
  },
];

export const analysisTests: AnalysisTest[] = [
  {
    id: '1',
    name: 'Emocromo Completo',
    description: 'Valutazione generale dello stato di salute',
  },
  {
    id: '2',
    name: 'Funzionalità Tiroidea (TSH, FT3, FT4)',
    description: 'Controllo tiroide e metabolismo',
  },
  {
    id: '3',
    name: 'Vitamina D',
    description: 'Importante per ossa e sistema immunitario',
  },
  {
    id: '4',
    name: 'Glicemia e Emoglobina Glicata',
    description: 'Prevenzione diabete tipo 2',
  },
  {
    id: '5',
    name: 'Profilo Lipidico',
    description: 'Colesterolo totale, HDL, LDL, trigliceridi',
  },
];

export const preventionTips = [
  'Mantieni uno stile di vita attivo con almeno 150 minuti di attività fisica a settimana',
  'Segui una dieta mediterranea ricca di verdure, frutta e pesce',
  'Dormi 7-8 ore per notte per ottimizzare il recupero',
  'Riduci lo stress con tecniche di rilassamento e meditazione',
];
