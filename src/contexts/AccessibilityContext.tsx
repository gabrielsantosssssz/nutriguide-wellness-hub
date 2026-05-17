import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { AccessibilityPreferences } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  toggleHighContrast: () => void;
  toggleLargeFont: () => void;
  toggleReadingMode: () => void;
  toggleReduceAnimations: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: AccessibilityPreferences = {
  highContrast: false,
  largeFont: false,
  readingMode: false,
  reduceAnimations: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useLocalStorage<AccessibilityPreferences>(
    'nutriguide_accessibility',
    defaultPreferences
  );

  // Aplicar classes CSS ao <html> baseado nas preferências
  useEffect(() => {
    const html = document.documentElement;
    
    html.classList.toggle('high-contrast', preferences.highContrast);
    html.classList.toggle('large-font', preferences.largeFont);
    html.classList.toggle('reading-mode', preferences.readingMode);
    html.classList.toggle('reduce-animations', preferences.reduceAnimations);
    
    return () => {
      html.classList.remove('high-contrast', 'large-font', 'reading-mode', 'reduce-animations');
    };
  }, [preferences]);

  const toggleHighContrast = () =>
    setPreferences(prev => ({ ...prev, highContrast: !prev.highContrast }));

  const toggleLargeFont = () =>
    setPreferences(prev => ({ ...prev, largeFont: !prev.largeFont }));

  const toggleReadingMode = () =>
    setPreferences(prev => ({ ...prev, readingMode: !prev.readingMode }));

  const toggleReduceAnimations = () =>
    setPreferences(prev => ({ ...prev, reduceAnimations: !prev.reduceAnimations }));

  const resetPreferences = () => setPreferences(defaultPreferences);

  return (
    <AccessibilityContext.Provider value={{
      preferences,
      toggleHighContrast,
      toggleLargeFont,
      toggleReadingMode,
      toggleReduceAnimations,
      resetPreferences,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider');
  }
  return context;
};
