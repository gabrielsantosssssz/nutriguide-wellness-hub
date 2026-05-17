const express = require('express');
const { connectDB, User, HealthMetrics, Habit, CalculatorHistory } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/eu', (req, res) => {
  res.json({
    usuario: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      age: req.user.age,
      weight: req.user.weight,
      height: req.user.height,
      gender: req.user.gender,
      createdAt: req.user.created_at,
    }
  });
});

router.put('/eu', async (req, res) => {
  try {
    const { name, age, weight, height, gender } = req.body;
    await connectDB();

    if (name) req.user.name = name;
    if (age !== undefined) req.user.age = age;
    if (weight !== undefined) req.user.weight = weight;
    if (height !== undefined) req.user.height = height;
    if (gender) req.user.gender = gender;

    await req.user.save();

    res.json({
      usuario: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        age: req.user.age,
        weight: req.user.weight,
        height: req.user.height,
        gender: req.user.gender,
        createdAt: req.user.created_at,
      }
    });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

router.delete('/eu', async (req, res) => {
  try {
    await connectDB();
    const userId = req.user.id;

    await HealthMetrics.deleteOne({ user_id: userId });
    await Habit.deleteMany({ user_id: userId });
    await CalculatorHistory.deleteMany({ user_id: userId });
    await User.deleteOne({ id: userId });

    res.json({ mensagem: 'Conta e todos os dados foram excluídos permanentemente.' });
  } catch (err) {
    console.error('Erro ao excluir conta:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

router.get('/eu/exportar', async (req, res) => {
  try {
    await connectDB();
    const userId = req.user.id;

    const metricas = await HealthMetrics.findOne({ user_id: userId }).lean();
    const habitos = await Habit.find({ user_id: userId }).sort({ date: -1 }).lean();
    const historicoCalculadora = await CalculatorHistory.find({ user_id: userId }).sort({ date: -1 }).lean();

    res.json({
      exportDate: new Date().toISOString(),
      usuario: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        age: req.user.age,
        weight: req.user.weight,
        height: req.user.height,
        gender: req.user.gender,
        createdAt: req.user.created_at,
      },
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
