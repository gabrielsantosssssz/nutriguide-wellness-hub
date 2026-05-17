const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const metricsRoutes = require('./routes/metrics');
const habitsRoutes = require('./routes/habits');
const calculatorRoutes = require('./routes/calculator');

const app = express();

// Configure CORS for production (Vercel) and development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.use(cors({ origin: true, credentials: true })); // Em prod, você pode restringir o origin
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/metricas', metricsRoutes);
app.use('/api/habitos', habitsRoutes);
app.use('/api/calculadora', calculatorRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', mensagem: 'NutriGuide API (Serverless) está funcionando! 🚀' });
});

app.use((err, req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ erro: 'Erro interno no servidor.' });
});

// IMPORTANT: Export the app instead of app.listen() for Vercel Serverless
module.exports = app;
