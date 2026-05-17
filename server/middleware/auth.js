const { getDb } = require('../database');

/**
 * Middleware de autenticação.
 * Verifica o token no header Authorization e injeta req.user.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const db = getDb();
    const user = db.prepare('SELECT id, name, email, age, weight, height, gender, created_at FROM users WHERE token = ?').get(token);

    if (!user) {
      return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Erro na autenticação:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
}

module.exports = authMiddleware;
