export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: number;
  completedAt?: number;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
}
