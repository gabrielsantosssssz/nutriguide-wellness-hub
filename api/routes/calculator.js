const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { connectDB, CalculatorHistory } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/historico', async (req, res) => {
  try {
    await connectDB();
    const rows = await CalculatorHistory.find({ user_id: req.user.id })
      .sort({ date: -1 })
      .limit(50);

    const historico = rows.map(row => ({
      id: row.id,
      type: row.type,
      value: row.value,
      label: row.label,
      date: row.date,
      inputs: row.inputs || {},
    }));

    res.json({ historico });
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

router.post('/historico', async (req, res) => {
  try {
    const { id, type, value, label, date, inputs } = req.body;

    if (!type || value === undefined || !label) {
      return res.status(400).json({ erro: 'Tipo, valor e rótulo são obrigatórios.' });
    }

    await connectDB();
    const entryId = id || uuidv4();
    const entryDate = date || new Date().toISOString();

    const newEntry = new CalculatorHistory({
      id: entryId,
      user_id: req.user.id,
      type,
      value,
      label,
      date: entryDate,
      inputs: inputs || {},
    });

    await newEntry.save();

    res.status(201).json({
      resultado: { id: entryId, type, value, label, date: entryDate, inputs: inputs || {} },
    });
  } catch (err) {
    console.error('Erro ao salvar resultado:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

module.exports = router;
