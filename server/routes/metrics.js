const express = require('express');
const { getDb } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * GET /api/metricas
 * Retorna as métricas de saúde do usuário.
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const metrics = db.prepare(
      'SELECT bmi, bmr, hydration_goal, hydration_current, body_fat_percentage, tdee FROM health_metrics WHERE user_id = ?'
    ).get(req.user.id);

    if (!metrics) {
      return res.json({
        metricas: {
          bmi: null,
          bmr: null,
          hydrationGoal: 2500,
          hydrationCurrent: 0,
          bodyFatPercentage: null,
          tdee: null,
        },
      });
    }

    res.json({
      metricas: {
        bmi: metrics.bmi,
        bmr: metrics.bmr,
        hydrationGoal: metrics.hydration_goal,
        hydrationCurrent: metrics.hydration_current,
        bodyFatPercentage: metrics.body_fat_percentage,
        tdee: metrics.tdee,
      },
    });
  } catch (err) {
    console.error('Erro ao buscar métricas:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

/**
 * PUT /api/metricas
 * Atualiza as métricas de saúde do usuário.
 */
router.put('/', (req, res) => {
  try {
    const { bmi, bmr, hydrationGoal, hydrationCurrent, bodyFatPercentage, tdee } = req.body;
    const db = getDb();
    const now = new Date().toISOString();

    // Upsert
    const existing = db.prepare('SELECT id FROM health_metrics WHERE user_id = ?').get(req.user.id);

    if (existing) {
      db.prepare(`
        UPDATE health_metrics SET
          bmi = COALESCE(?, bmi),
          bmr = COALESCE(?, bmr),
          hydration_goal = COALESCE(?, hydration_goal),
          hydration_current = COALESCE(?, hydration_current),
          body_fat_percentage = COALESCE(?, body_fat_percentage),
          tdee = COALESCE(?, tdee),
          updated_at = ?
        WHERE user_id = ?
      `).run(
        bmi ?? null, bmr ?? null, hydrationGoal ?? null,
        hydrationCurrent ?? null, bodyFatPercentage ?? null, tdee ?? null,
        now, req.user.id
      );
    } else {
      db.prepare(`
        INSERT INTO health_metrics (user_id, bmi, bmr, hydration_goal, hydration_current, body_fat_percentage, tdee, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        req.user.id,
        bmi ?? null, bmr ?? null, hydrationGoal ?? 2500,
        hydrationCurrent ?? 0, bodyFatPercentage ?? null, tdee ?? null, now
      );
    }

    // Retornar métricas atualizadas
    const updated = db.prepare(
      'SELECT bmi, bmr, hydration_goal, hydration_current, body_fat_percentage, tdee FROM health_metrics WHERE user_id = ?'
    ).get(req.user.id);

    res.json({
      metricas: {
        bmi: updated.bmi,
        bmr: updated.bmr,
        hydrationGoal: updated.hydration_goal,
        hydrationCurrent: updated.hydration_current,
        bodyFatPercentage: updated.body_fat_percentage,
        tdee: updated.tdee,
      },
    });
  } catch (err) {
    console.error('Erro ao atualizar métricas:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

module.exports = router;
