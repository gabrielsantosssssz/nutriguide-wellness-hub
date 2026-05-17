import React, { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import type { HealthMetrics, HabitEntry, CalculatorResult } from '../types';
import { getToken } from '../services/api';
import {
  apiObterMetricas,
  apiAtualizarMetricas,
  apiObterHabitos,
  apiAlternarHabito,
  apiObterHistoricoCalc,
  apiSalvarResultadoCalc,
} from '../services/api';

interface HealthDataContextType {
  metrics: HealthMetrics;
  habits: HabitEntry[];
  calculatorHistory: CalculatorResult[];
  updateMetrics: (data: Partial<HealthMetrics>) => void;
  addHydration: (amount: number) => void;
  resetHydration: () => void;
  toggleHabit: (date: string, habit: keyof HabitEntry['habits']) => void;
  getHabitsForDate: (date: string) => HabitEntry | undefined;
  addCalculatorResult: (result: CalculatorResult) => void;
  getStreak: () => number;
}

const defaultMetrics: HealthMetrics = {
  bmi: null,
  bmr: null,
  hydrationGoal: 2500,
  hydrationCurrent: 0,
  bodyFatPercentage: null,
  tdee: null,
};

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<HealthMetrics>(defaultMetrics);
  const [habits, setHabits] = useState<HabitEntry[]>([]);
  const [calculatorHistory, setCalculatorHistory] = useState<CalculatorResult[]>([]);

  // Carregar dados da API ao montar (se autenticado)
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiObterMetricas()
      .then(res => setMetrics(res.metricas))
      .catch(() => { /* fallback: mantém default */ });

    apiObterHabitos()
      .then(res => setHabits(res.habitos))
      .catch(() => {});

    apiObterHistoricoCalc()
      .then(res => {
        const mapped = res.historico.map(h => ({
          id: h.id,
          type: h.type as CalculatorResult['type'],
          value: h.value,
          label: h.label,
          date: h.date,
          inputs: h.inputs,
        }));
        setCalculatorHistory(mapped);
      })
      .catch(() => {});
  }, []);

  const updateMetrics = useCallback((data: Partial<HealthMetrics>) => {
    setMetrics(prev => {
      const updated = { ...prev, ...data };
      // Sincronizar com API em background
      apiAtualizarMetricas(data).catch(err => console.error('Erro ao sincronizar métricas:', err));
      return updated;
    });
  }, []);

  const addHydration = useCallback((amount: number) => {
    setMetrics(prev => {
      const newCurrent = Math.min(prev.hydrationCurrent + amount, prev.hydrationGoal * 1.5);
      // Sincronizar com API
      apiAtualizarMetricas({ hydrationCurrent: newCurrent }).catch(err => console.error('Erro ao sincronizar hidratação:', err));
      return { ...prev, hydrationCurrent: newCurrent };
    });
  }, []);

  const resetHydration = useCallback(() => {
    setMetrics(prev => {
      apiAtualizarMetricas({ hydrationCurrent: 0 }).catch(err => console.error('Erro ao resetar hidratação:', err));
      return { ...prev, hydrationCurrent: 0 };
    });
  }, []);

  const toggleHabit = useCallback((date: string, habit: keyof HabitEntry['habits']) => {
    // Atualização otimista local
    setHabits(prev => {
      const existing = prev.find(h => h.date === date);
      if (existing) {
        return prev.map(h =>
          h.date === date
            ? { ...h, habits: { ...h.habits, [habit]: !h.habits[habit] } }
            : h
        );
      }
      const newEntry: HabitEntry = {
        id: crypto.randomUUID(),
        date,
        habits: { water: false, exercise: false, healthyFood: false, sleep: false, supplements: false, [habit]: true },
      };
      return [...prev, newEntry];
    });

    // Sincronizar com API
    apiAlternarHabito(date, habit).catch(err => console.error('Erro ao sincronizar hábito:', err));
  }, []);

  const getHabitsForDate = useCallback((date: string) => {
    return habits.find(h => h.date === date);
  }, [habits]);

  const addCalculatorResult = useCallback((result: CalculatorResult) => {
    setCalculatorHistory(prev => [result, ...prev].slice(0, 50));
    // Sincronizar com API
    apiSalvarResultadoCalc({
      id: result.id,
      type: result.type,
      value: result.value,
      label: result.label,
      date: result.date,
      inputs: result.inputs,
    }).catch(err => console.error('Erro ao sincronizar calculadora:', err));
  }, []);

  const getStreak = useCallback((): number => {
    if (habits.length === 0) return 0;

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const entry = habits.find(h => h.date === dateStr);

      if (entry) {
        const completedCount = Object.values(entry.habits).filter(Boolean).length;
        if (completedCount >= 3) {
          streak++;
        } else if (i > 0) {
          break;
        }
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  }, [habits]);

  return (
    <HealthDataContext.Provider value={{
      metrics,
      habits,
      calculatorHistory,
      updateMetrics,
      addHydration,
      resetHydration,
      toggleHabit,
      getHabitsForDate,
      addCalculatorResult,
      getStreak,
    }}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = (): HealthDataContextType => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData deve ser usado dentro de HealthDataProvider');
  }
  return context;
};
