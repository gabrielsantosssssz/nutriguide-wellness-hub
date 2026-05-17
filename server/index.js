const express = require('express');
const cors = require('cors');
const { getDb, closeDb } = require('./database');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const metricsRoutes = require('./routes/metrics');
const habitsRoutes = require('./routes/habits');
const calculatorRoutes = require('./routes/calculator');

const app = express();
const PORT = 3001;

// Middleware global
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'], credentials: true }));
app.use(express.json());

// Inicializar banco
getDb();

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/metricas', metricsRoutes);
app.use('/api/habitos', habitsRoutes);
app.use('/api/calculadora', calculatorRoutes);

// Health check
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', mensagem: 'NutriGuide API está funcionando! 🌿' });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ erro: 'Erro interno no servidor.' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🌿 NutriGuide API rodando em http://localhost:${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/api/status\n`);
});

// Graceful shutdown
process.on('SIGINT', () => { closeDb(); process.exit(0); });
process.on('SIGTERM', () => { closeDb(); process.exit(0); });
