import React from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const {
    preferences,
    toggleHighContrast,
    toggleLargeFont,
    toggleReadingMode,
    toggleReduceAnimations,
    resetPreferences,
  } = useAccessibility();

  if (!isOpen) return null;

  const toggles = [
    {
      label: 'Alto Contraste',
      description: 'Aumenta o contraste entre texto e fundo para melhor legibilidade.',
      icon: 'contrast',
      active: preferences.highContrast,
      onToggle: toggleHighContrast,
    },
    {
      label: 'Fonte Grande',
      description: 'Aumenta o tamanho base da fonte em 20%.',
      icon: 'format_size',
      active: preferences.largeFont,
      onToggle: toggleLargeFont,
    },
    {
      label: 'Modo Leitura',
      description: 'Simplifica a interface para foco no conteúdo textual.',
      icon: 'menu_book',
      active: preferences.readingMode,
      onToggle: toggleReadingMode,
    },
    {
      label: 'Reduzir Animações',
      description: 'Desativa animações e transições visuais.',
      icon: 'animation',
      active: preferences.reduceAnimations,
      onToggle: toggleReduceAnimations,
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[90] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface-container-lowest shadow-[-8px_0_32px_rgba(7,30,39,0.1)] z-[95] animate-slide-in-right flex flex-col"
        role="dialog"
        aria-label="Configurações de Acessibilidade"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              accessibility_new
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Acessibilidade</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
            aria-label="Fechar painel de acessibilidade"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Toggles */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {toggles.map((toggle) => (
            <button
              key={toggle.label}
              onClick={toggle.onToggle}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                toggle.active
                  ? 'bg-primary/5 border-primary'
                  : 'bg-surface-container-low border-outline-variant hover:border-primary/40'
              }`}
              aria-pressed={toggle.active}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    toggle.active ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{toggle.icon}</span>
                  </div>
                  <div>
                    <span className="font-label-lg text-label-lg text-on-surface block">{toggle.label}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{toggle.description}</span>
                  </div>
                </div>
                {/* Toggle Switch */}
                <div className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${
                  toggle.active ? 'bg-primary' : 'bg-outline-variant'
                }`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    toggle.active ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant">
          <button
            onClick={resetPreferences}
            className="w-full py-3 px-4 text-on-surface-variant hover:text-error font-label-lg text-label-lg border border-outline-variant rounded-lg hover:border-error/40 transition-colors"
          >
            Restaurar Padrões
          </button>
        </div>
      </aside>
    </>
  );
};

export default AccessibilityPanel;
