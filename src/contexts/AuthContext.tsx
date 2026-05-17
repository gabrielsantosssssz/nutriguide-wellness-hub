import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { apiEntrar, apiRegistrar, apiAtualizarUsuario, apiObterUsuario, getToken, setToken, removeToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sessão ao montar se houver token salvo
  useEffect(() => {
    const token = getToken();
    if (token) {
      apiObterUsuario()
        .then(res => {
          setUser({
            id: res.usuario.id,
            name: res.usuario.name,
            email: res.usuario.email,
            age: res.usuario.age,
            weight: res.usuario.weight,
            height: res.usuario.height,
            gender: res.usuario.gender as User['gender'],
            createdAt: res.usuario.createdAt,
          });
        })
        .catch(() => {
          removeToken();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiEntrar(email, password);
      setToken(res.token);
      setUser({
        id: res.usuario.id,
        name: res.usuario.name,
        email: res.usuario.email,
        age: res.usuario.age,
        weight: res.usuario.weight,
        height: res.usuario.height,
        gender: res.usuario.gender as User['gender'],
        createdAt: res.usuario.createdAt,
      });
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiRegistrar(name, email, password);
      setToken(res.token);
      setUser({
        id: res.usuario.id,
        name: res.usuario.name,
        email: res.usuario.email,
        createdAt: res.usuario.createdAt,
      });
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    try {
      const res = await apiAtualizarUsuario(data);
      setUser(prev => prev ? {
        ...prev,
        ...res.usuario,
        gender: res.usuario.gender as User['gender'],
      } : null);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      // Fallback: atualizar localmente mesmo se a API falhar
      setUser(prev => prev ? { ...prev, ...data } : null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
