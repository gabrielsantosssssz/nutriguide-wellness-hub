import { useState, useEffect, useCallback } from 'react';

/**
 * Hook genérico para persistência em localStorage com tipagem TypeScript.
 * Sincroniza estado React com localStorage automaticamente.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      console.warn(`Erro ao ler localStorage key "${key}"`);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {
        console.warn(`Erro ao salvar localStorage key "${key}"`);
      }
      return valueToStore;
    });
  }, [key]);

  // Sincronizar entre abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // ignora parse errors
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
