const express = require('express');
const { connectDB, HealthMetrics } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const metrics = await HealthMetrics.findOne({ user_id: req.user.id });

    if (!metrics) {
      return res.json({
        metricas: {
          bmi: null, bmr: null, hydrationGoal: 2500, hydrationCurrent: 0, bodyFatPercentage: null, tdee: null,
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

router.put('/', async (req, res) => {
  try {
    const { bmi, bmr, hydrationGoal, hydrationCurrent, bodyFatPercentage, tdee } = req.body;
    await connectDB();

    const updateData = { updated_at: new Date() };
    if (bmi !== undefined) updateData.bmi = bmi;
    if (bmr !== undefined) updateData.bmr = bmr;
    if (hydrationGoal !== undefined) updateData.hydration_goal = hydrationGoal;
    if (hydrationCurrent !== undefined) updateData.hydration_current = hydrationCurrent;
    if (bodyFatPercentage !== undefined) updateData.body_fat_percentage = bodyFatPercentage;
    if (tdee !== undefined) updateData.tdee = tdee;

    const updated = await HealthMetrics.findOneAndUpdate(
      { user_id: req.user.id },
      { $set: updateData },
      { new: true, upsert: true }
    );

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
