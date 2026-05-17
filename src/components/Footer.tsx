import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center py-8 px-gutter max-w-container-max mx-auto w-full gap-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          <span className="font-label-lg text-label-lg font-bold text-primary">NutriGuide</span>
        </div>
        
        <p className="font-label-md text-label-md text-on-surface-variant text-center md:text-left">
          © 2026 NutriGuide Wellness Hub. Educação nutricional para todos.
        </p>
        
        <nav className="flex flex-wrap justify-center gap-4" aria-label="Links do rodapé">
          <Link to="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Política de Privacidade
          </Link>
          <Link to="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Termos de Uso
          </Link>
          <Link to="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Conformidade LGPD
          </Link>
          <Link to="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
            Aviso Legal Médico
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
