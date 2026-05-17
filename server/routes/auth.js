const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');

const router = express.Router();

/**
 * POST /api/auth/registrar
 * Cria um novo usuário com senha criptografada.
 */
router.post('/registrar', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ erro: 'A senha deve ter no mínimo 8 caracteres.' });
    }

    const db = getDb();

    // Verificar se o e-mail já existe
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    const token = uuidv4();
    const createdAt = new Date().toISOString();

    db.prepare(
      'INSERT INTO users (id, name, email, password_hash, token, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, name, email, passwordHash, token, createdAt);

    // Criar métricas padrão para o novo usuário
    db.prepare(
      'INSERT INTO health_metrics (user_id, hydration_goal, hydration_current, updated_at) VALUES (?, 2500, 0, ?)'
    ).run(id, createdAt);

    res.status(201).json({
      token,
      usuario: { id, name, email, createdAt },
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

/**
 * POST /api/auth/entrar
 * Autentica um usuário e retorna o token.
 */
router.post('/entrar', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    // Gerar novo token a cada login
    const newToken = uuidv4();
    db.prepare('UPDATE users SET token = ? WHERE id = ?').run(newToken, user.id);

    res.json({
      token: newToken,
      usuario: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

module.exports = router;
