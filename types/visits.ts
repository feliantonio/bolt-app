export type Priority = 'Alta' | 'Media' | 'Bassa';

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  priority: Priority;
  icon: string;
  category: string;
}

export interface AnalysisTest {
  id: string;
  name: string;
  description: string;
}
