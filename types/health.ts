export type RiskLevel = 'low' | 'medium' | 'high';

export interface HealthStatus {
  riskLevel: RiskLevel;
  wellnessIndex: number;
  riskText: string;
}

export interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
}

export interface DailySuggestion {
  text: string;
  category: string;
}

export interface FamilyRisk {
  sharedRisks: number;
  description: string;
}
