import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useHealthData } from '../contexts/HealthDataContext';
import { useToast } from '../components/ui/Toast';

const Calculators: React.FC = () => {
  // IMC
  const [bmiH, setBmiH] = useState('');
  const [bmiW, setBmiW] = useState('');
  const [bmiR, setBmiR] = useState<number | null>(null);
  // TMB
  const [tmbGender, setTmbGender] = useState<'masculino'|'feminino'>('masculino');
  const [tmbAge, setTmbAge] = useState('');
  const [tmbH, setTmbH] = useState('');
  const [tmbW, setTmbW] = useState('');
  const [tmbR, setTmbR] = useState<number | null>(null);
  // Hidratação
  const [hydroW, setHydroW] = useState('');
  const [hydroR, setHydroR] = useState<number | null>(null);

  const { updateMetrics, addCalculatorResult } = useHealthData();
  const { showToast } = useToast();

  const getBMIClass = (v: number) => {
    if (v < 18.5) return { label: 'Abaixo do peso', color: 'secondary' as const };
    if (v < 25) return { label: 'Peso normal', color: 'primary' as const };
    if (v < 30) return { label: 'Sobrepeso', color: 'tertiary' as const };
    return { label: 'Obeso', color: 'tertiary' as const };
  };

  const calcBMI = () => {
    if (!bmiH || !bmiW) return;
    const h = parseFloat(bmiH) / 100;
    const w = parseFloat(bmiW);
    const r = parseFloat((w / (h * h)).toFixed(1));
    setBmiR(r);
    updateMetrics({ bmi: r });
    addCalculatorResult({ id: crypto.randomUUID(), type: 'imc', value: r, label: `IMC: ${r}`, date: new Date().toISOString(), inputs: { altura: bmiH, peso: bmiW } });
    showToast('success', `IMC calculado: ${r}`);
  };

  const calcTMB = () => {
    if (!tmbAge || !tmbH || !tmbW) return;
    const age = parseFloat(tmbAge), h = parseFloat(tmbH), w = parseFloat(tmbW);
    let r: number;
    if (tmbGender === 'masculino') r = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * age);
    else r = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * age);
    r = parseFloat(r.toFixed(0));
    setTmbR(r);
    updateMetrics({ bmr: r });
    addCalculatorResult({ id: crypto.randomUUID(), type: 'tmb', value: r, label: `TMB: ${r} kcal`, date: new Date().toISOString(), inputs: { genero: tmbGender, idade: tmbAge, altura: tmbH, peso: tmbW } });
    showToast('success', `TMB calculada: ${r} kcal/dia`);
  };

  const calcHydro = () => {
    if (!hydroW) return;
    const r = Math.round(parseFloat(hydroW) * 35);
    setHydroR(r);
    updateMetrics({ hydrationGoal: r });
    addCalculatorResult({ id: crypto.randomUUID(), type: 'hidratacao', value: r, label: `Hidratação: ${r} ml`, date: new Date().toISOString(), inputs: { peso: hydroW } });
    showToast('success', `Meta de hidratação: ${r} ml/dia`);
  };

  const shareResult = async (text: string) => {
    if (navigator.share) {
      try { await navigator.share({ title: 'NutriGuide — Resultado', text }); }
      catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      showToast('info', 'Resultado copiado!');
    }
  };

  const Disclaimer = () => (
    <div className="mt-4 pt-3 border-t border-outline-variant">
      <p className="font-label-md text-label-md text-error flex items-start gap-1"><span className="material-symbols-outlined text-[16px] mt-[2px]">info</span>Ferramenta apenas para fins informativos. Não substitui aconselhamento profissional.</p>
    </div>
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow px-6 max-w-[1280px] mx-auto w-full py-10">
        <header className="mb-10 animate-slide-up">
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface mb-2">Calculadoras de Saúde</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Ferramentas para avaliação metabólica e monitoramento. Insira suas métricas para cálculos padronizados.</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* IMC */}
            <Card variant="outlined" padding="md" className="animate-slide-up stagger-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary-container text-on-primary-container p-2 rounded-lg"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_weight</span></div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Índice de Massa Corporal (IMC)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="bh">Altura (cm)</label>
                  <input className="bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="bh" placeholder="175" type="number" value={bmiH} onChange={e => setBmiH(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="bw">Peso (kg)</label>
                  <input className="bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="bw" placeholder="70" type="number" value={bmiW} onChange={e => setBmiW(e.target.value)} />
                </div>
              </div>
              <Button onClick={calcBMI} className="mt-4" disabled={!bmiH || !bmiW}>Calcular IMC</Button>
              {bmiR !== null && (
                <div className="mt-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl animate-scale-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Resultado</span>
                      <div className="font-headline-lg text-headline-lg text-primary mt-1">{bmiR}</div>
                      <div className="mt-1"><Badge color={getBMIClass(bmiR).color}>{getBMIClass(bmiR).label} (OMS)</Badge></div>
                    </div>
                    <button onClick={() => shareResult(`Meu IMC: ${bmiR} — ${getBMIClass(bmiR).label}`)} className="p-2 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-variant transition-colors" aria-label="Compartilhar"><span className="material-symbols-outlined text-[20px]">share</span></button>
                  </div>
                  <div className="w-full h-2 bg-surface-variant rounded-full mt-3 overflow-hidden relative">
                    <div className="h-full bg-secondary absolute rounded-full transition-all" style={{ left: `${Math.min(Math.max((bmiR - 15) * 3, 0), 90)}%`, width: '10%' }} />
                  </div>
                  <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mt-1"><span>Abaixo</span><span>Normal</span><span>Sobrepeso</span><span>Obeso</span></div>
                </div>
              )}
              <Disclaimer />
            </Card>
            {/* TMB */}
            <Card variant="outlined" padding="md" className="animate-slide-up stagger-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary-container text-on-primary-container p-2 rounded-lg"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span></div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Taxa Metabólica Basal (TMB)</h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Equação de Harris-Benedict para necessidades calóricas em repouso.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface-variant">Gênero</label>
                  <div className="flex gap-4 h-12">
                    <label className="flex items-center gap-2 cursor-pointer"><input checked={tmbGender === 'masculino'} onChange={() => setTmbGender('masculino')} className="text-primary focus:ring-primary w-4 h-4" name="gender" type="radio" /><span className="font-body-md text-body-md text-on-surface">Masculino</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input checked={tmbGender === 'feminino'} onChange={() => setTmbGender('feminino')} className="text-primary focus:ring-primary w-4 h-4" name="gender" type="radio" /><span className="font-body-md text-body-md text-on-surface">Feminino</span></label>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5"><label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="ta">Idade (anos)</label><input className="bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="ta" placeholder="30" type="number" value={tmbAge} onChange={e => setTmbAge(e.target.value)} /></div>
                <div className="flex flex-col gap-1.5"><label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="th">Altura (cm)</label><input className="bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="th" placeholder="175" type="number" value={tmbH} onChange={e => setTmbH(e.target.value)} /></div>
                <div className="flex flex-col gap-1.5"><label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="tw">Peso (kg)</label><input className="bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="tw" placeholder="70" type="number" value={tmbW} onChange={e => setTmbW(e.target.value)} /></div>
              </div>
              <Button onClick={calcTMB} variant="outline" className="mt-4" disabled={!tmbAge || !tmbH || !tmbW}>Calcular TMB</Button>
              {tmbR !== null && (
                <div className="mt-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl animate-scale-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Resultado</span>
                      <div className="font-headline-lg text-headline-lg text-primary mt-1">{tmbR.toLocaleString('pt-BR')} <span className="font-body-sm text-body-sm text-on-surface-variant">kcal/dia</span></div>
                    </div>
                    <button onClick={() => shareResult(`Minha TMB: ${tmbR} kcal/dia`)} className="p-2 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-variant transition-colors" aria-label="Compartilhar"><span className="material-symbols-outlined text-[20px]">share</span></button>
                  </div>
                </div>
              )}
              <Disclaimer />
            </Card>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Hydration */}
            <Card variant="filled" padding="md" className="animate-slide-up stagger-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-secondary-container text-on-secondary-container p-2 rounded-lg"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span></div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Hidratação Diária</h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Cálculo base: 35ml por kg de peso corporal.</p>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="hw">Peso (kg)</label>
                <input className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 w-full font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="hw" placeholder="70" type="number" value={hydroW} onChange={e => setHydroW(e.target.value)} />
              </div>
              <Button onClick={calcHydro} variant="secondary" fullWidth className="mt-4" disabled={!hydroW}>Calcular Necessidade</Button>
              {hydroR !== null && (
                <div className="mt-4 p-3 bg-secondary/5 rounded-lg animate-scale-in text-center">
                  <span className="font-headline-md text-headline-md text-secondary">{hydroR.toLocaleString('pt-BR')} ml</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">por dia</p>
                </div>
              )}
              <Disclaimer />
            </Card>
            {/* Educational Callout */}
            <Card variant="outlined" padding="md" className="animate-slide-up stagger-4 relative overflow-hidden min-h-[200px] flex flex-col justify-end">
              <div className="absolute inset-0 z-0 bg-gradient-to-tr from-surface-container to-surface-bright opacity-80" />
              <div className="relative z-10">
                <Badge color="primary" icon="menu_book" className="mb-2">Educação</Badge>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Entenda suas Métricas</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Aprenda como esses cálculos se encaixam em uma avaliação holística de saúde.</p>
                <a className="inline-flex items-center font-label-lg text-label-lg text-primary hover:underline" href="/blog">Ler o guia <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span></a>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculators;
