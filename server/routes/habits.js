const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * GET /api/habitos
 * Retorna todos os hábitos do usuário.
 */
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare(
      'SELECT id, date, water, exercise, healthy_food, sleep, supplements FROM habits WHERE user_id = ? ORDER BY date DESC'
    ).all(req.user.id);

    const habitos = rows.map(row => ({
      id: row.id,
      date: row.date,
      habits: {
        water: !!row.water,
        exercise: !!row.exercise,
        healthyFood: !!row.healthy_food,
        sleep: !!row.sleep,
        supplements: !!row.supplements,
      },
    }));

    res.json({ habitos });
  } catch (err) {
    console.error('Erro ao buscar hábitos:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

/**
 * POST /api/habitos
 * Alterna (toggle) um hábito para uma data específica.
 * Body: { date: "2026-05-17", habit: "water" }
 */
router.post('/', (req, res) => {
  try {
    const { date, habit } = req.body;

    if (!date || !habit) {
      return res.status(400).json({ erro: 'Data e hábito são obrigatórios.' });
    }

    // Mapear nomes do frontend para colunas do banco
    const habitColumnMap = {
      water: 'water',
      exercise: 'exercise',
      healthyFood: 'healthy_food',
      sleep: 'sleep',
      supplements: 'supplements',
    };

    const column = habitColumnMap[habit];
    if (!column) {
      return res.status(400).json({ erro: 'Hábito inválido.' });
    }

    const db = getDb();
    const existing = db.prepare(
      'SELECT * FROM habits WHERE user_id = ? AND date = ?'
    ).get(req.user.id, date);

    if (existing) {
      // Toggle o hábito
      const currentValue = existing[column];
      db.prepare(
        `UPDATE habits SET ${column} = ? WHERE id = ?`
      ).run(currentValue ? 0 : 1, existing.id);

      const updated = db.prepare('SELECT * FROM habits WHERE id = ?').get(existing.id);
      res.json({
        habito: {
          id: updated.id,
          date: updated.date,
          habits: {
            water: !!updated.water,
            exercise: !!updated.exercise,
            healthyFood: !!updated.healthy_food,
            sleep: !!updated.sleep,
            supplements: !!updated.supplements,
          },
        },
      });
    } else {
      // Criar novo registro com o hábito ativado
      const id = uuidv4();
      const values = { water: 0, exercise: 0, healthy_food: 0, sleep: 0, supplements: 0 };
      values[column] = 1;

      db.prepare(
        'INSERT INTO habits (id, user_id, date, water, exercise, healthy_food, sleep, supplements) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(id, req.user.id, date, values.water, values.exercise, values.healthy_food, values.sleep, values.supplements);

      res.status(201).json({
        habito: {
          id,
          date,
          habits: {
            water: !!values.water,
            exercise: !!values.exercise,
            healthyFood: !!values.healthy_food,
            sleep: !!values.sleep,
            supplements: !!values.supplements,
          },
        },
      });
    }
  } catch (err) {
    console.error('Erro ao alternar hábito:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

module.exports = router;
