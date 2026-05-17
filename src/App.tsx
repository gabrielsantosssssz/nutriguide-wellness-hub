import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { HealthDataProvider } from './contexts/HealthDataContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Calculators from './pages/Calculators';
import Blog from './pages/Blog';
import Habits from './pages/Habits';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <HealthDataProvider>
          <ToastProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/calculadoras" element={<ProtectedRoute><Calculators /></ProtectedRoute>} />
                <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
                <Route path="/habitos" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
                <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                {/* 404 */}
                <Route path="*" element={
                  <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface p-6 text-center">
                    <span className="material-symbols-outlined text-[72px] text-on-surface-variant mb-4">explore_off</span>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Página não encontrada</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">A página que você procura não existe ou foi movida.</p>
                    <a href="/dashboard" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-lg text-label-lg hover:bg-primary-container transition-colors">Voltar ao Painel</a>
                  </div>
                } />
              </Routes>
            </Router>
          </ToastProvider>
        </HealthDataProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

export default App;
