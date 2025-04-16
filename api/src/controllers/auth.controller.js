const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

/**
 * Login de usuário
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.login = async (req, res) => {
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
      { 
        id: user.id,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retorna os dados do usuário e o token
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teamId: user.teamId
      },
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

/**
 * Logout de usuário
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
exports.logout = async (req, res) => {
  // Como estamos usando JWT, o logout é gerenciado pelo cliente
  // O cliente deve descartar o token
  return res.json({ message: 'Logout realizado com sucesso' });
};