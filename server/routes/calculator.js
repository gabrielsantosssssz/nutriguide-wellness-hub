const express = require('express');
const { getDb } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/historico', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare(
      'SELECT id, type, value, label, date, inputs FROM calculator_history WHERE user_id = ? ORDER BY date DESC LIMIT 50'
    ).all(req.user.id);
    const historico = rows.map(row => ({
      id: row.id, type: row.type, value: row.value, label: row.label, date: row.date,
      inputs: row.inputs ? JSON.parse(row.inputs) : {},
    }));
    res.json({ historico });
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

router.post('/historico', (req, res) => {
  try {
    const { id, type, value, label, date, inputs } = req.body;
    if (!type || value === undefined || !label) {
      return res.status(400).json({ erro: 'Tipo, valor e rótulo são obrigatórios.' });
    }
    const db = getDb();
    const entryId = id || require('uuid').v4();
    const entryDate = date || new Date().toISOString();
    db.prepare(
      'INSERT INTO calculator_history (id, user_id, type, value, label, date, inputs) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(entryId, req.user.id, type, value, label, entryDate, inputs ? JSON.stringify(inputs) : null);
    res.status(201).json({ resultado: { id: entryId, type, value, label, date: entryDate, inputs: inputs || {} } });
  } catch (err) {
    console.error('Erro ao salvar resultado:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

module.exports = router;
