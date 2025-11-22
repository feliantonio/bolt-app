import { HealthStatus, HealthMetric, DailySuggestion, FamilyRisk } from '@/types/health';

export const healthStatus: HealthStatus = {
  riskLevel: 'low',
  wellnessIndex: 88,
  riskText: 'Indice Benessere: Ottimo',
};

export const healthMetrics: HealthMetric[] = [
  {
    id: '1',
    name: 'Battito',
    value: '72',
    unit: 'bpm',
    icon: 'heart',
    color: '#FF3B30',
  },
  {
    id: '2',
    name: 'Sonno',
    value: '7.5',
    unit: 'ore',
    icon: 'moon',
    color: '#5856D6',
  },
  {
    id: '3',
    name: 'Stress',
    value: 'Basso',
    unit: '',
    icon: 'brain',
    color: '#FF9500',
  },
  {
    id: '4',
    name: 'HRV',
    value: '58',
    unit: 'ms',
    icon: 'activity',
    color: '#34C759',
  },
  {
    id: '5',
    name: 'Peso',
    value: '72.5',
    unit: 'kg',
    icon: 'scale',
    color: '#007AFF',
  },
];

export const dailySuggestion: DailySuggestion = {
  text: 'Esame tiroideo annuale consigliato nella tua zona.',
  category: 'Prevenzione',
};

export const familyRisk: FamilyRisk = {
  sharedRisks: 3,
  description: 'Rischi condivisi famigliari',
};

export const lastSync = {
  minutesAgo: 14,
};
