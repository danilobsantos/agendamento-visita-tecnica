const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();

/**
 * @route   GET /api/teams
 * @desc    Listar todas as equipes
 * @access  Privado
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    return res.json(teams);
  } catch (error) {
    console.error('Erro ao listar equipes:', error);
    return res.status(500).json({ message: 'Erro ao listar equipes', error: error.message });
  }
});

/**
 * @route   GET /api/teams/:id
 * @desc    Obter uma equipe específica
 * @access  Privado
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        visits: true
      }
    });

    if (!team) {
      return res.status(404).json({ message: 'Equipe não encontrada' });
    }

    return res.json(team);
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    return res.status(500).json({ message: 'Erro ao buscar equipe', error: error.message });
  }
});

/**
 * @route   POST /api/teams
 * @desc    Criar uma nova equipe
 * @access  Privado (Admin)
 */
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, memberIds } = req.body;

    // Cria a equipe
    const team = await prisma.team.create({
      data: {
        name,
        members: memberIds ? {
          connect: memberIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return res.status(201).json(team);
  } catch (error) {
    console.error('Erro ao criar equipe:', error);
    return res.status(500).json({ message: 'Erro ao criar equipe', error: error.message });
  }
});

/**
 * @route   PUT /api/teams/:id
 * @desc    Atualizar uma equipe
 * @access  Privado (Admin)
 */
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, memberIds } = req.body;

    // Verifica se a equipe existe
    const existingTeam = await prisma.team.findUnique({
      where: { id },
      include: { members: true }
    });

    if (!existingTeam) {
      return res.status(404).json({ message: 'Equipe não encontrada' });
    }

    // Atualiza a equipe
    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        name,
        members: memberIds ? {
          set: memberIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return res.json(updatedTeam);
  } catch (error) {
    console.error('Erro ao atualizar equipe:', error);
    return res.status(500).json({ message: 'Erro ao atualizar equipe', error: error.message });
  }
});

/**
 * @route   DELETE /api/teams/:id
 * @desc    Remover uma equipe
 * @access  Privado (Admin)
 */
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se a equipe existe
    const existingTeam = await prisma.team.findUnique({
      where: { id }
    });

    if (!existingTeam) {
      return res.status(404).json({ message: 'Equipe não encontrada' });
    }

    // Remove a equipe
    await prisma.team.delete({
      where: { id }
    });

    return res.json({ message: 'Equipe removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover equipe:', error);
    return res.status(500).json({ message: 'Erro ao remover equipe', error: error.message });
  }
});

module.exports = router;