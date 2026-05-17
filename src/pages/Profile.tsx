import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useToast } from '../components/ui/Toast';

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { preferences, toggleHighContrast, toggleLargeFont, toggleReadingMode, toggleReduceAnimations } = useAccessibility();
  const { showToast } = useToast();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');

  const handleSave = () => {
    updateUser({
      name,
      age: age ? parseInt(age) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
    });
    setEditing(false);
    showToast('success', 'Perfil atualizado!');
  };

  const handleExportData = () => {
    const data = {
      user,
      metrics: localStorage.getItem('nutriguide_metrics'),
      habits: localStorage.getItem('nutriguide_habits'),
      calculatorHistory: localStorage.getItem('nutriguide_calc_history'),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutriguide_dados_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Dados exportados com sucesso!');
  };

  const handleClearData = () => {
    if (window.confirm('Tem certeza? Isso removerá TODOS os seus dados. Esta ação não pode ser desfeita.')) {
      ['nutriguide_metrics', 'nutriguide_habits', 'nutriguide_calc_history', 'nutriguide_accessibility'].forEach(k => localStorage.removeItem(k));
      showToast('info', 'Todos os dados foram removidos.');
      logout();
    }
  };

  const accessibilityToggles = [
    { label: 'Alto Contraste', icon: 'contrast', active: preferences.highContrast, onToggle: toggleHighContrast },
    { label: 'Fonte Grande', icon: 'format_size', active: preferences.largeFont, onToggle: toggleLargeFont },
    { label: 'Modo Leitura', icon: 'menu_book', active: preferences.readingMode, onToggle: toggleReadingMode },
    { label: 'Reduzir Animações', icon: 'animation', active: preferences.reduceAnimations, onToggle: toggleReduceAnimations },
  ];

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-10 animate-slide-up">
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface mb-2">Meu Perfil</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Gerencie suas informações pessoais e preferências.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Personal Info */}
          <div className="lg:col-span-8 space-y-6">
            <Card variant="outlined" padding="md" className="animate-slide-up stagger-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>Dados Pessoais
                </h2>
                <Button variant="ghost" size="sm" icon={editing ? 'close' : 'edit'} iconPosition="left" onClick={() => { if (editing) { setName(user?.name || ''); setAge(user?.age?.toString() || ''); setWeight(user?.weight?.toString() || ''); setHeight(user?.height?.toString() || ''); } setEditing(!editing); }}>
                  {editing ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">Nome</label>
                  {editing ? <input className="bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" value={name} onChange={e => setName(e.target.value)} /> : <p className="font-body-md text-body-md text-on-surface py-3">{user?.name || '—'}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">E-mail</label>
                  <p className="font-body-md text-body-md text-on-surface py-3">{user?.email || '—'}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">Idade</label>
                  {editing ? <input className="bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" type="number" placeholder="30" value={age} onChange={e => setAge(e.target.value)} /> : <p className="font-body-md text-body-md text-on-surface py-3">{user?.age ? `${user.age} anos` : '—'}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">Peso (kg)</label>
                  {editing ? <input className="bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" type="number" placeholder="70" value={weight} onChange={e => setWeight(e.target.value)} /> : <p className="font-body-md text-body-md text-on-surface py-3">{user?.weight ? `${user.weight} kg` : '—'}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">Altura (cm)</label>
                  {editing ? <input className="bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" type="number" placeholder="175" value={height} onChange={e => setHeight(e.target.value)} /> : <p className="font-body-md text-body-md text-on-surface py-3">{user?.height ? `${user.height} cm` : '—'}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">Membro desde</label>
                  <p className="font-body-md text-body-md text-on-surface py-3">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '—'}</p>
                </div>
              </div>
              {editing && <Button onClick={handleSave} className="mt-6" icon="save" iconPosition="left">Salvar Alterações</Button>}
            </Card>

            {/* Accessibility Settings */}
            <Card variant="outlined" padding="md" className="animate-slide-up stagger-2">
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">accessibility_new</span>Acessibilidade
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {accessibilityToggles.map(toggle => (
                  <button key={toggle.label} onClick={toggle.onToggle} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${toggle.active ? 'bg-primary/5 border-primary' : 'border-outline-variant hover:border-primary/40'}`} aria-pressed={toggle.active}>
                    <div className={`p-2 rounded-lg ${toggle.active ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-[20px]">{toggle.icon}</span>
                    </div>
                    <span className="font-label-lg text-label-lg text-on-surface flex-1 text-left">{toggle.label}</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${toggle.active ? 'bg-primary' : 'bg-outline-variant'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${toggle.active ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar: Data & Privacy */}
          <div className="lg:col-span-4 space-y-6">
            <Card variant="filled" padding="md" className="animate-slide-up stagger-3 text-center">
              <div className="w-20 h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-4 text-[32px] font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">{user?.name || 'Usuário'}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{user?.email}</p>
            </Card>

            <Card variant="outlined" padding="md" className="animate-slide-up stagger-4">
              <h3 className="font-label-lg text-label-lg text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary text-[20px]">shield</span>Privacidade (LGPD)
              </h3>
              <div className="space-y-3">
                <Button variant="outline" size="sm" fullWidth icon="download" iconPosition="left" onClick={handleExportData}>Exportar Meus Dados</Button>
                <Button variant="ghost" size="sm" fullWidth icon="delete_forever" iconPosition="left" onClick={handleClearData} className="!text-error hover:!bg-error/5">Excluir Todos os Dados</Button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-4">Conforme a LGPD, você tem direito à portabilidade e exclusão de seus dados a qualquer momento.</p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
