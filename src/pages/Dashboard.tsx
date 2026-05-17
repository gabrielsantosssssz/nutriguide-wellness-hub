import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useHealthData } from '../contexts/HealthDataContext';
import { useToast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { metrics, addHydration } = useHealthData();
  const { showToast } = useToast();

  const handleAddWater = (amount: number) => {
    addHydration(amount);
    showToast('success', `+${amount}ml adicionado!`);
  };

  const hydrationPercent = Math.round((metrics.hydrationCurrent / metrics.hydrationGoal) * 100);
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const weekData = [65, 80, 45, 90, 70, 55, 0]; // Mock data

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 py-10">
        {/* Greeting */}
        <div className="mb-10 animate-slide-up">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">
            {greeting()}, {user?.name?.split(' ')[0] || 'Usuário'} 👋
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Acompanhe sua saúde metabólica e objetivos nutricionais.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Hydration (8 cols) */}
          <Card className="md:col-span-8 animate-slide-up stagger-1" variant="outlined" padding="md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
                  Meta de Hidratação
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Meta: {metrics.hydrationGoal} ml diários</p>
              </div>
              <div className="text-right">
                <span className="font-headline-lg text-headline-lg text-secondary">{metrics.hydrationCurrent}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant ml-1">ml</span>
              </div>
            </div>
            <ProgressBar value={metrics.hydrationCurrent} max={metrics.hydrationGoal} color="secondary" showPercentage height="md" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => handleAddWater(250)} className="flex-1 bg-surface-container text-on-surface hover:bg-surface-container-highest transition-colors font-label-lg text-label-lg py-3 px-4 rounded-lg flex items-center justify-center gap-2 min-h-[48px]">
                <span className="material-symbols-outlined text-[20px]">add</span> 250 ml
              </button>
              <button onClick={() => handleAddWater(500)} className="flex-1 bg-surface-container text-on-surface hover:bg-surface-container-highest transition-colors font-label-lg text-label-lg py-3 px-4 rounded-lg flex items-center justify-center gap-2 min-h-[48px]">
                <span className="material-symbols-outlined text-[20px]">add</span> 500 ml
              </button>
            </div>
            {hydrationPercent >= 100 && (
              <div className="mt-3 p-2 bg-primary/5 rounded-lg text-center animate-scale-in">
                <p className="font-label-lg text-label-lg text-primary">🎉 Meta alcançada! Parabéns!</p>
              </div>
            )}
          </Card>

          {/* BMI (4 cols) */}
          <Card className="md:col-span-4 flex flex-col justify-between animate-slide-up stagger-2" variant="outlined" padding="md">
            <div>
              <h2 className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">monitor_weight</span>IMC Atual
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-xl text-headline-xl text-on-surface">{metrics.bmi?.toFixed(1) || '—'}</span>
                {metrics.bmi && <Badge color="primary" icon="check_circle">{metrics.bmi < 18.5 ? 'Abaixo' : metrics.bmi < 25 ? 'Saudável' : metrics.bmi < 30 ? 'Sobrepeso' : 'Obeso'}</Badge>}
              </div>
            </div>
            <Link to="/calculadoras" className="mt-4 font-label-lg text-label-lg text-primary flex items-center gap-1 hover:underline">
              Recalcular <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </Card>

          {/* BMR (4 cols) */}
          <Card className="md:col-span-4 flex flex-col justify-between animate-slide-up stagger-3" variant="outlined" padding="md">
            <div>
              <h2 className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">local_fire_department</span>TMB Est.
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-xl text-headline-xl text-on-surface">{metrics.bmr ? Math.round(metrics.bmr).toLocaleString('pt-BR') : '—'}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">kcal/dia</span>
              </div>
            </div>
            <p className="mt-4 font-body-sm text-body-sm text-on-surface-variant">Energia basal para funções vitais em repouso.</p>
          </Card>

          {/* Weekly Habits (8 cols) */}
          <Card className="md:col-span-8 animate-slide-up stagger-4" variant="outlined" padding="md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-headline-md text-headline-md text-on-surface">Atividade Semanal</h2>
              <Link to="/habitos" className="font-label-lg text-label-lg text-primary hover:underline flex items-center gap-1">Ver Hábitos <span className="material-symbols-outlined text-[18px]">arrow_forward</span></Link>
            </div>
            <div className="flex items-end justify-between gap-2 h-32">
              {weekDays.map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-surface-variant rounded-t-lg relative" style={{ height: '100px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-primary/70 rounded-t-lg transition-all duration-500"
                      style={{ height: `${weekData[i]}%` }}
                    />
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{day}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Calculators (12 cols) */}
          <Card className="md:col-span-12 animate-slide-up stagger-5" variant="outlined" padding="md">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Calculadoras Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: 'calculate', title: 'Divisão de Macros', desc: 'Otimize sua ingestão' },
                { icon: 'set_meal', title: 'Gasto Calórico', desc: 'TDEE diário total' },
                { icon: 'monitor_weight', title: 'Índice de Massa', desc: 'Calcule seu IMC' },
                { icon: 'water_drop', title: 'Hidratação Ideal', desc: 'Meta de água diária' },
              ].map(calc => (
                <Link key={calc.icon} to="/calculadoras" className="group border border-outline-variant rounded-xl p-4 flex items-center gap-3 hover:border-primary hover:shadow-sm transition-all min-h-[48px]">
                  <div className="bg-surface-container-low p-2 rounded-lg group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                    <span className="material-symbols-outlined">{calc.icon}</span>
                  </div>
                  <div>
                    <span className="font-label-lg text-label-lg text-on-surface block">{calc.title}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{calc.desc}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Featured Article (12 cols) */}
          <section className="md:col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col md:flex-row group hover:shadow-sm transition-shadow animate-slide-up stagger-6">
            <div className="md:w-1/3 min-h-[200px] bg-surface-variant relative overflow-hidden">
              <img alt="Alimentação saudável" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7XD6O-8ikT-lfLArd1PfPGN4loo9NmV8W3B0SmPJyoNumJHwVODSyVDefFED0fdgJDwudCJYsBD3hMH9zx0ZmYo8eLG4SLiddQ8dK4D3OV7XqKWixIDDFsM6dzkrsCEyZpWKm7itYMKX_4MCavE8FlLfhuIeMHk9A8imIDzrHpwsFg_WcY6hYknj9iurqiaOkSDS-1GeIZ6bnM_4BDpPczLLqHwCNYq_TLD9cGHt8cezR-_WTTMSB1nIL2x8Qk2ABLaVX_YrRkXY" />
            </div>
            <div className="p-6 md:w-2/3 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <Badge color="primary">Artigo em Destaque</Badge>
                <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span>5 min</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">Entendendo o Índice Glicêmico nas Refeições Diárias</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4 max-w-[800px]">Saiba como diferentes carboidratos impactam seus níveis de açúcar no sangue e descubra estratégias para manter a energia constante.</p>
              <Link to="/blog" className="font-label-lg text-label-lg text-primary flex items-center gap-1 w-max hover:underline">
                Ler Artigo <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
