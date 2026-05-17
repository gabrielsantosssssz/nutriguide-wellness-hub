const express = require('express');
const { getDb } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * GET /api/usuarios/eu
 * Retorna dados do usuário autenticado.
 */
router.get('/eu', (req, res) => {
  res.json({ usuario: req.user });
});

/**
 * PUT /api/usuarios/eu
 * Atualiza dados do perfil do usuário.
 */
router.put('/eu', (req, res) => {
  try {
    const { name, age, weight, height, gender } = req.body;
    const db = getDb();

    db.prepare(`
      UPDATE users SET
        name = COALESCE(?, name),
        age = COALESCE(?, age),
        weight = COALESCE(?, weight),
        height = COALESCE(?, height),
        gender = COALESCE(?, gender)
      WHERE id = ?
    `).run(name || null, age || null, weight || null, height || null, gender || null, req.user.id);

    const updated = db.prepare(
      'SELECT id, name, email, age, weight, height, gender, created_at as createdAt FROM users WHERE id = ?'
    ).get(req.user.id);

    res.json({ usuario: updated });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

/**
 * DELETE /api/usuarios/eu
 * Exclui completamente a conta do usuário (LGPD).
 * Cascade deleta métricas, hábitos e histórico.
 */
router.delete('/eu', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM users WHERE id = ?').run(req.user.id);
    res.json({ mensagem: 'Conta e todos os dados foram excluídos permanentemente.' });
  } catch (err) {
    console.error('Erro ao excluir conta:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

/**
 * GET /api/usuarios/eu/exportar
 * Exporta todos os dados do usuário (LGPD - portabilidade).
 */
router.get('/eu/exportar', (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;

    const usuario = db.prepare(
      'SELECT id, name, email, age, weight, height, gender, created_at as createdAt FROM users WHERE id = ?'
    ).get(userId);

    const metricas = db.prepare(
      'SELECT bmi, bmr, hydration_goal, hydration_current, body_fat_percentage, tdee, updated_at FROM health_metrics WHERE user_id = ?'
    ).get(userId);

    const habitos = db.prepare(
      'SELECT id, date, water, exercise, healthy_food, sleep, supplements FROM habits WHERE user_id = ? ORDER BY date DESC'
    ).all(userId);

    const historicoCalculadora = db.prepare(
      'SELECT id, type, value, label, date, inputs FROM calculator_history WHERE user_id = ? ORDER BY date DESC'
    ).all(userId);

    // Parse inputs JSON
    historicoCalculadora.forEach(item => {
      if (item.inputs) {
        try { item.inputs = JSON.parse(item.inputs); } catch { /* keep as string */ }
      }
    });

    res.json({
      exportDate: new Date().toISOString(),
      usuario,
      metricas,
      habitos,
      historicoCalculadora,
    });
  } catch (err) {
    console.error('Erro ao exportar dados:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

module.exports = router;
