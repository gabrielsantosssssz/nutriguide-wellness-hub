// ============================
// NutriGuide — Tipagens TypeScript
// ============================

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'masculino' | 'feminino';
  createdAt: string;
}

export interface HealthMetrics {
  bmi: number | null;
  bmr: number | null;
  hydrationGoal: number;
  hydrationCurrent: number;
  bodyFatPercentage: number | null;
  tdee: number | null;
}

export interface HabitEntry {
  id: string;
  date: string; // ISO date string
  habits: {
    water: boolean;
    exercise: boolean;
    healthyFood: boolean;
    sleep: boolean;
    supplements: boolean;
  };
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
  readTimeMinutes: number;
  date: string;
}

export interface CalculatorResult {
  id: string;
  type: 'imc' | 'tmb' | 'hidratacao' | 'macros' | 'gordura';
  value: number;
  label: string;
  date: string;
  inputs: Record<string, number | string>;
}

export interface AccessibilityPreferences {
  highContrast: boolean;
  largeFont: boolean;
  readingMode: boolean;
  reduceAnimations: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
