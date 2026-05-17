/**
 * Cliente HTTP centralizado para comunicação com a API do NutriGuide.
 * Gerencia token de autenticação e base URL.
 */

const API_BASE_URL = 'http://localhost:3001/api';
const TOKEN_KEY = 'nutriguide_token';

// --- Gerenciamento de Token ---

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// --- Função base de requisição ---

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ erro: 'Erro desconhecido' }));
    throw new Error(errorData.erro || `Erro HTTP ${response.status}`);
  }

  return response.json();
}

// --- Auth ---

export interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    name: string;
    email: string;
    age?: number;
    weight?: number;
    height?: number;
    gender?: string;
    createdAt: string;
  };
}

export async function apiRegistrar(name: string, email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/registrar', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function apiEntrar(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/entrar', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// --- Usuário ---

export async function apiObterUsuario() {
  return request<{ usuario: AuthResponse['usuario'] }>('/usuarios/eu');
}

export async function apiAtualizarUsuario(data: Partial<AuthResponse['usuario']>) {
  return request<{ usuario: AuthResponse['usuario'] }>('/usuarios/eu', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiExcluirConta() {
  return request<{ mensagem: string }>('/usuarios/eu', { method: 'DELETE' });
}

export async function apiExportarDados() {
  return request<Record<string, unknown>>('/usuarios/eu/exportar');
}

// --- Métricas ---

export interface MetricasResponse {
  metricas: {
    bmi: number | null;
    bmr: number | null;
    hydrationGoal: number;
    hydrationCurrent: number;
    bodyFatPercentage: number | null;
    tdee: number | null;
  };
}

export async function apiObterMetricas(): Promise<MetricasResponse> {
  return request<MetricasResponse>('/metricas');
}

export async function apiAtualizarMetricas(data: Partial<MetricasResponse['metricas']>): Promise<MetricasResponse> {
  return request<MetricasResponse>('/metricas', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// --- Hábitos ---

export interface HabitoItem {
  id: string;
  date: string;
  habits: {
    water: boolean;
    exercise: boolean;
    healthyFood: boolean;
    sleep: boolean;
    supplements: boolean;
  };
}

export async function apiObterHabitos(): Promise<{ habitos: HabitoItem[] }> {
  return request<{ habitos: HabitoItem[] }>('/habitos');
}

export async function apiAlternarHabito(date: string, habit: string): Promise<{ habito: HabitoItem }> {
  return request<{ habito: HabitoItem }>('/habitos', {
    method: 'POST',
    body: JSON.stringify({ date, habit }),
  });
}

// --- Calculadora ---

export interface ResultadoCalc {
  id: string;
  type: string;
  value: number;
  label: string;
  date: string;
  inputs: Record<string, number | string>;
}

export async function apiObterHistoricoCalc(): Promise<{ historico: ResultadoCalc[] }> {
  return request<{ historico: ResultadoCalc[] }>('/calculadora/historico');
}

export async function apiSalvarResultadoCalc(resultado: ResultadoCalc): Promise<{ resultado: ResultadoCalc }> {
  return request<{ resultado: ResultadoCalc }>('/calculadora/historico', {
    method: 'POST',
    body: JSON.stringify(resultado),
  });
}
