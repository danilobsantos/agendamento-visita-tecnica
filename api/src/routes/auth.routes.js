const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar usuário e gerar token
 * @access  Público
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Busca o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Verifica se o usuário existe
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retorna os dados do usuário e o token
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout do usuário (cliente implementa a lógica de remover o token)
 * @access  Privado
 */
router.post('/logout', (req, res) => {
  return res.json({ message: 'Logout realizado com sucesso' });
});

module.exports = router;