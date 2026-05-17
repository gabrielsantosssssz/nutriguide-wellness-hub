import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();

  if (!isOpen) return null;

  const links = [
    { to: '/dashboard', label: 'Painel', icon: 'dashboard' },
    { to: '/calculadoras', label: 'Calculadoras', icon: 'calculate' },
    { to: '/blog', label: 'Educação', icon: 'school' },
    { to: '/habitos', label: 'Hábitos', icon: 'checklist' },
    { to: '/perfil', label: 'Perfil', icon: 'person' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[80] animate-fade-in md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className="fixed top-0 left-0 h-full w-72 bg-surface-container-lowest shadow-[8px_0_32px_rgba(7,30,39,0.1)] z-[85] animate-slide-in-left md:hidden flex flex-col"
        role="navigation"
        aria-label="Menu principal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              spa
            </span>
            <span className="font-headline-md text-headline-md text-primary">NutriGuide</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
            aria-label="Fechar menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 py-4 px-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-lg text-label-lg transition-all duration-200 ${
                isActive(link.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined" style={isActive(link.to) ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant">
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error font-label-lg text-label-lg hover:bg-error/5 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            Sair
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
