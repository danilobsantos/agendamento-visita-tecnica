const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();

/**
 * @route   GET /api/users
 * @desc    Listar todos os usuários
 * @access  Privado (Admin)
 */
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        teamId: true,
        createdAt: true,
        updatedAt: true,
        // Exclui o campo password
      }
    });
    return res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro ao listar usuários', error: error.message });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Obter um usuário específico
 * @access  Privado (Admin ou próprio usuário)
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica se o usuário está tentando acessar seus próprios dados ou é um admin
    if (req.userId !== id && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        teamId: true,
        createdAt: true,
        updatedAt: true,
        // Exclui o campo password
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
});

/**
 * @route   POST /api/users
 * @desc    Criar um novo usuário
 * @access  Privado (Admin)
 */
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role, teamId } = req.body;

    // Verifica se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        teamId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        teamId: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Atualizar um usuário
 * @access  Privado (Admin ou próprio usuário)
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, teamId } = req.body;

    // Verifica se o usuário está tentando atualizar seus próprios dados ou é um admin
    if (req.userId !== id && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    // Apenas admin pode alterar a role
    if (role && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Apenas administradores podem alterar o tipo de usuário' });
    }

    // Verifica se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Prepara os dados para atualização
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role && req.userRole === 'ADMIN') updateData.role = role;
    if (teamId && req.userRole === 'ADMIN') updateData.teamId = teamId;

    // Atualiza o usuário
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        teamId: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Remover um usuário
 * @access  Privado (Admin)
 */
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Remove o usuário
    await prisma.user.delete({
      where: { id }
    });

    return res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    return res.status(500).json({ message: 'Erro ao remover usuário', error: error.message });
  }
});

module.exports = router;