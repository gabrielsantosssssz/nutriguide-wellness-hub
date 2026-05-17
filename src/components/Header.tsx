import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessibilityPanel from './AccessibilityPanel';
import MobileNav from './MobileNav';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/dashboard', label: 'Painel' },
    { to: '/calculadoras', label: 'Calculadoras' },
    { to: '/blog', label: 'Educação' },
    { to: '/habitos', label: 'Hábitos' },
  ];

  return (
    <>
      <header className="bg-surface-container-lowest/80 backdrop-blur-lg border-b border-outline-variant sticky top-0 z-50">
        <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto w-full">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileNav(true)}
              className="md:hidden p-1 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Abrir menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            <Link to="/dashboard" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-1">
              <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              <span className="font-headline-md text-headline-md font-bold text-primary hidden sm:block">NutriGuide</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 ml-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg font-body-md text-body-md transition-all duration-200 ${
                    isActive(link.to)
                      ? 'text-primary bg-primary/[0.08] font-semibold'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowAccessibility(true)}
              className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-full"
              aria-label="Acessibilidade"
              title="Acessibilidade"
            >
              <span className="material-symbols-outlined text-[22px]">accessibility_new</span>
            </button>

            <div className="h-5 w-px bg-outline-variant mx-1 hidden sm:block" />

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-surface-container-high transition-colors"
                aria-label="Menu do usuário"
                aria-expanded={showUserMenu}
              >
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-lg text-label-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block font-body-sm text-body-sm text-on-surface-variant max-w-[100px] truncate">
                  {user?.name?.split(' ')[0] || 'Usuário'}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] hidden sm:block">
                  expand_more
                </span>
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-[0_8px_32px_rgba(7,30,39,0.12)] border border-outline-variant z-50 animate-slide-down overflow-hidden">
                    <div className="p-4 border-b border-outline-variant">
                      <p className="font-label-lg text-label-lg text-on-surface truncate">{user?.name}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/perfil"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-body-md text-body-md"
                      >
                        <span className="material-symbols-outlined text-[20px]">person</span>
                        Meu Perfil
                      </Link>
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-error hover:bg-error/5 transition-colors font-body-md text-body-md"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Sair
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AccessibilityPanel isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} />
      <MobileNav isOpen={showMobileNav} onClose={() => setShowMobileNav(false)} onLogout={logout} />
    </>
  );
};

export default Header;
