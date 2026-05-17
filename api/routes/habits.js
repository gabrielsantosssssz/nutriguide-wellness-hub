const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { connectDB, Habit } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const rows = await Habit.find({ user_id: req.user.id }).sort({ date: -1 });

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

router.post('/', async (req, res) => {
  try {
    const { date, habit } = req.body;

    if (!date || !habit) {
      return res.status(400).json({ erro: 'Data e hábito são obrigatórios.' });
    }

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

    await connectDB();

    const existing = await Habit.findOne({ user_id: req.user.id, date });

    if (existing) {
      existing[column] = !existing[column];
      await existing.save();

      res.json({
        habito: {
          id: existing.id,
          date: existing.date,
          habits: {
            water: !!existing.water,
            exercise: !!existing.exercise,
            healthyFood: !!existing.healthy_food,
            sleep: !!existing.sleep,
            supplements: !!existing.supplements,
          },
        },
      });
    } else {
      const id = uuidv4();
      const newHabit = new Habit({
        id,
        user_id: req.user.id,
        date,
        water: false,
        exercise: false,
        healthy_food: false,
        sleep: false,
        supplements: false,
      });

      newHabit[column] = true;
      await newHabit.save();

      res.status(201).json({
        habito: {
          id,
          date,
          habits: {
            water: !!newHabit.water,
            exercise: !!newHabit.exercise,
            healthyFood: !!newHabit.healthy_food,
            sleep: !!newHabit.sleep,
            supplements: !!newHabit.supplements,
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
