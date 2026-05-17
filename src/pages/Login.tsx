import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    if (s <= 1) return { level: 1, label: 'Fraca', color: 'bg-error' };
    if (s <= 2) return { level: 2, label: 'Razoável', color: 'bg-tertiary-fixed-dim' };
    if (s <= 3) return { level: 3, label: 'Boa', color: 'bg-secondary' };
    return { level: 4, label: 'Forte', color: 'bg-primary' };
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isLogin && !name.trim()) e.name = 'Nome é obrigatório';
    if (!email.trim()) e.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'E-mail inválido';
    if (!password) e.password = 'Senha é obrigatória';
    else if (!isLogin && password.length < 8) e.password = 'Mínimo de 8 caracteres';
    if (!isLogin && !acceptedPrivacy) e.privacy = 'Obrigatório';
    if (!isLogin && !acceptedTerms) e.terms = 'Obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFormError('');
    if (!validate()) return;
    try {
      const ok = isLogin ? await login(email, password) : await register(name, email, password);
      if (ok) navigate('/dashboard');
      else setFormError('Falha na autenticação.');
    } catch { setFormError('Erro inesperado.'); }
  };

  const strength = getPasswordStrength();

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center px-4 py-8 md:px-8 relative">
      {/* Background decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-surface-container-low opacity-60 blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-surface-container-high opacity-40 blur-3xl" />
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
        {/* Esquerda: Branding */}
        <div className="hidden lg:flex flex-col justify-center flex-1 min-w-0 animate-fade-in">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6 text-primary">
              <span className="material-symbols-outlined text-[44px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              <h1 className="font-headline-xl text-headline-xl text-primary">NutriGuide</h1>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Clareza através da Nutrição.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Acesse ferramentas educacionais de precisão. Acompanhe suas métricas e descubra conteúdos baseados em evidências.
            </p>
          </div>
          <div className="space-y-5">
            {[
              { icon: 'analytics', title: 'Acompanhamento Metabólico', desc: 'Visualização clara de dados para suas métricas de saúde.' },
              { icon: 'school', title: 'Educação Baseada em Evidências', desc: 'Conteúdos nutricionais validados por profissionais.' },
              { icon: 'verified_user', title: 'Conformidade LGPD', desc: 'Seus dados protegidos com segurança empresarial.' },
            ].map((item, i) => (
              <div key={item.icon} className={`flex items-start gap-4 animate-slide-up stagger-${i + 1}`}>
                <div className="w-11 h-11 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[22px]">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-label-lg text-label-lg text-on-surface">{item.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direita: Formulário de Auth */}
        <div className="w-full max-w-[460px] flex-shrink-0 animate-slide-up">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgba(7,30,39,0.06)] relative overflow-hidden">
            {/* Barra de acento */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-fixed to-primary" />

            {/* Logo mobile */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8 text-primary">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">NutriGuide</h1>
            </div>

            {/* Abas */}
            <div className="flex border-b border-outline-variant mb-6">
              <button
                className={`flex-1 pb-3 font-label-lg text-label-lg transition-all ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                onClick={() => { setIsLogin(false); setErrors({}); setFormError(''); }}
              >
                Criar Conta
              </button>
              <button
                className={`flex-1 pb-3 font-label-lg text-label-lg transition-all ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                onClick={() => { setIsLogin(true); setErrors({}); setFormError(''); }}
              >
                Entrar
              </button>
            </div>

            {/* Banner de erro */}
            {formError && (
              <div className="mb-4 p-3 bg-error-container rounded-lg flex items-center gap-2 animate-slide-down" role="alert">
                <span className="material-symbols-outlined text-error text-[18px]">error</span>
                <p className="font-body-sm text-body-sm text-on-error-container">{formError}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {/* Nome */}
              {!isLogin && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="fullName">Nome Completo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
                    </div>
                    <input
                      className={`w-full bg-surface-bright border rounded-lg pl-10 pr-3 py-3 font-body-md text-body-md text-on-surface transition-all focus:outline-none focus:ring-2 ${errors.name ? 'border-error focus:ring-error' : 'border-outline-variant focus:ring-primary'}`}
                      id="fullName" placeholder="Maria Silva" type="text" value={name}
                      onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                    />
                  </div>
                  {errors.name && <p className="font-body-sm text-body-sm text-error">{errors.name}</p>}
                </div>
              )}

              {/* E-mail */}
              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">mail</span>
                  </div>
                  <input
                    className={`w-full bg-surface-bright border rounded-lg pl-10 pr-3 py-3 font-body-md text-body-md text-on-surface transition-all focus:outline-none focus:ring-2 ${errors.email ? 'border-error focus:ring-error' : 'border-outline-variant focus:ring-primary'}`}
                    id="email" placeholder="maria@exemplo.com" type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                  />
                </div>
                {errors.email && <p className="font-body-sm text-body-sm text-error">{errors.email}</p>}
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
                  </div>
                  <input
                    className={`w-full bg-surface-bright border rounded-lg pl-10 pr-10 py-3 font-body-md text-body-md text-on-surface transition-all focus:outline-none focus:ring-2 ${errors.password ? 'border-error focus:ring-error' : 'border-outline-variant focus:ring-primary'}`}
                    id="password" placeholder="••••••••" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
                {errors.password && <p className="font-body-sm text-body-sm text-error">{errors.password}</p>}
                {!isLogin && <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Mínimo de 8 caracteres.</p>}
              </div>

              {/* Força da senha */}
              {!isLogin && password && (
                <div className="animate-fade-in">
                  <div className="flex gap-1.5 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : 'bg-surface-container-highest'}`} />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Força: <span className="font-semibold">{strength.label}</span>
                    </p>
                  )}
                </div>
              )}

              {/* LGPD */}
              {!isLogin && (
                <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/50 space-y-3 animate-fade-in">
                  <h4 className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary">policy</span>
                    Privacidade e Consentimento (LGPD)
                  </h4>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input className="w-4 h-4 mt-0.5 text-primary bg-surface border-outline rounded focus:ring-primary focus:ring-2 cursor-pointer flex-shrink-0" type="checkbox" checked={acceptedPrivacy} onChange={e => { setAcceptedPrivacy(e.target.checked); setErrors(p => ({ ...p, privacy: '' })); }} />
                    <span className={`font-body-sm text-body-sm group-hover:text-primary transition-colors ${errors.privacy ? 'text-error' : 'text-on-surface'}`}>
                      Eu consinto com o processamento de dados conforme a <a className="text-primary underline" href="#">Política de Privacidade</a>.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input className="w-4 h-4 mt-0.5 text-primary bg-surface border-outline rounded focus:ring-primary focus:ring-2 cursor-pointer flex-shrink-0" type="checkbox" checked={acceptedTerms} onChange={e => { setAcceptedTerms(e.target.checked); setErrors(p => ({ ...p, terms: '' })); }} />
                    <span className={`font-body-sm text-body-sm group-hover:text-primary transition-colors ${errors.terms ? 'text-error' : 'text-on-surface'}`}>
                      Eu aceito os <a className="text-primary underline" href="#">Termos de Uso</a> e compreendo meus direitos.
                    </span>
                  </label>
                </div>
              )}

              {/* Esqueceu a senha */}
              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-primary hover:underline font-label-md text-label-md">Esqueceu a senha?</a>
                </div>
              )}

              {/* Botão submit */}
              <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} icon="arrow_forward" className="!rounded-full mt-2 shadow-[0_4px_16px_rgba(13,99,27,0.2)]">
                {isLogin ? 'Acessar Painel' : 'Criar Conta'}
              </Button>
            </form>

            {/* Rodapé */}
            {!isLogin && (
              <div className="mt-6 pt-4 border-t border-outline-variant text-center">
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Ao se registrar, você reconhece nosso compromisso com a{' '}
                  <a className="text-secondary hover:underline font-medium" href="#">Conformidade LGPD</a>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
