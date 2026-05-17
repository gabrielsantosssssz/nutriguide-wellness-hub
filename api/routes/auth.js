const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { connectDB, User, HealthMetrics } = require('../database');

const router = express.Router();

router.post('/registrar', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ erro: 'A senha deve ter no mínimo 8 caracteres.' });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);
    const token = uuidv4();

    const newUser = new User({
      id,
      name,
      email,
      password_hash,
      token,
    });

    await newUser.save();

    const initialMetrics = new HealthMetrics({
      user_id: id,
    });
    await initialMetrics.save();

    res.status(201).json({
      token,
      usuario: { id, name, email, createdAt: newUser.created_at },
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

router.post('/entrar', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const newToken = uuidv4();
    user.token = newToken;
    await user.save();

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
