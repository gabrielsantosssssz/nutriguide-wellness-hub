import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/ui/Card';
import { useHealthData } from '../contexts/HealthDataContext';
import { useToast } from '../components/ui/Toast';

const habitsList = [
  { key: 'water' as const, icon: 'water_drop', label: 'Beber Água (8 copos)', color: 'text-secondary' },
  { key: 'exercise' as const, icon: 'fitness_center', label: 'Exercício Físico (30 min)', color: 'text-primary' },
  { key: 'healthyFood' as const, icon: 'restaurant', label: 'Alimentação Saudável', color: 'text-primary' },
  { key: 'sleep' as const, icon: 'bedtime', label: 'Dormir 7-9 horas', color: 'text-secondary' },
  { key: 'supplements' as const, icon: 'medication', label: 'Suplementos/Vitaminas', color: 'text-tertiary' },
];

const Habits: React.FC = () => {
  const { toggleHabit, getHabitsForDate, getStreak, habits } = useHealthData();
  const { showToast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const todayHabits = getHabitsForDate(today);
  const streak = getStreak();

  const completedToday = todayHabits ? Object.values(todayHabits.habits).filter(Boolean).length : 0;
  const totalHabits = habitsList.length;

  const handleToggle = (key: typeof habitsList[number]['key']) => {
    const wasChecked = todayHabits?.habits[key] || false;
    toggleHabit(today, key);
    if (!wasChecked) showToast('success', 'Hábito registrado! 🎉');
  };

  // Últimos 7 dias
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const entry = habits.find(h => h.date === dateStr);
    const completed = entry ? Object.values(entry.habits).filter(Boolean).length : 0;
    return { date: dateStr, day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3), completed, isToday: dateStr === today };
  });

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-10 animate-slide-up">
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface mb-2">Hábitos Diários</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Acompanhe seus hábitos saudáveis e construa uma rotina equilibrada.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main: Today's Habits */}
          <div className="lg:col-span-8">
            <Card variant="outlined" padding="md" className="animate-slide-up stagger-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline-md text-headline-md text-on-surface">Hoje</h2>
                <span className="font-label-lg text-label-lg text-on-surface-variant">{completedToday}/{totalHabits} concluídos</span>
              </div>
              <div className="space-y-3">
                {habitsList.map(habit => {
                  const checked = todayHabits?.habits[habit.key] || false;
                  return (
                    <button
                      key={habit.key}
                      onClick={() => handleToggle(habit.key)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
                        checked
                          ? 'bg-primary/5 border-primary/30'
                          : 'bg-surface-container-lowest border-outline-variant hover:border-primary/40'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        checked ? 'bg-primary border-primary' : 'border-outline bg-transparent'
                      }`}>
                        {checked && <span className="material-symbols-outlined text-on-primary text-[16px] animate-check-bounce">check</span>}
                      </div>
                      <span className={`material-symbols-outlined ${habit.color} text-[24px]`} style={checked ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {habit.icon}
                      </span>
                      <span className={`font-body-md text-body-md flex-1 transition-all ${checked ? 'text-on-surface line-through opacity-60' : 'text-on-surface'}`}>
                        {habit.label}
                      </span>
                      {checked && <span className="font-label-sm text-label-sm text-primary">✓</span>}
                    </button>
                  );
                })}
              </div>
              {completedToday === totalHabits && (
                <div className="mt-4 p-4 bg-primary/5 rounded-xl text-center animate-scale-in">
                  <p className="font-headline-md text-headline-md text-primary">🏆 Dia perfeito!</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Todos os hábitos concluídos. Continue assim!</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Streak */}
            <Card variant="filled" padding="md" className="animate-slide-up stagger-2 text-center">
              <span className="text-[48px] block mb-2">🔥</span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">{streak}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Complete 3+ hábitos por dia para manter a sequência!</p>
            </Card>

            {/* Weekly Chart */}
            <Card variant="outlined" padding="md" className="animate-slide-up stagger-3">
              <h3 className="font-label-lg text-label-lg text-on-surface mb-4">Últimos 7 Dias</h3>
              <div className="flex items-end justify-between gap-2 h-28">
                {last7Days.map(day => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-surface-variant rounded-t-md relative" style={{ height: '80px' }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-t-md transition-all duration-500 ${day.isToday ? 'bg-primary' : 'bg-primary/50'}`}
                        style={{ height: `${(day.completed / totalHabits) * 100}%` }}
                      />
                    </div>
                    <span className={`font-label-sm text-label-sm ${day.isToday ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{day.day}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tips */}
            <Card variant="outlined" padding="md" className="animate-slide-up stagger-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                <h3 className="font-label-lg text-label-lg text-on-surface">Dica do Dia</h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Estudos mostram que hábitos se consolidam após 66 dias em média. A consistência importa mais que a perfeição — comece com 2-3 hábitos e expanda gradualmente.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Habits;
