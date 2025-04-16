const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();

/**
 * @route   GET /api/services
 * @desc    Listar todos os serviços
 * @access  Privado
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    return res.json(services);
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    return res.status(500).json({ message: 'Erro ao listar serviços', error: error.message });
  }
});

/**
 * @route   GET /api/services/:id
 * @desc    Obter um serviço específico
 * @access  Privado
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        visits: true
      }
    });

    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    return res.json(service);
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    return res.status(500).json({ message: 'Erro ao buscar serviço', error: error.message });
  }
});

/**
 * @route   POST /api/services
 * @desc    Criar um novo serviço
 * @access  Privado (Admin)
 */
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, description, duration } = req.body;

    // Cria o serviço
    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration
      }
    });

    return res.status(201).json(service);
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return res.status(500).json({ message: 'Erro ao criar serviço', error: error.message });
  }
});

/**
 * @route   PUT /api/services/:id
 * @desc    Atualizar um serviço
 * @access  Privado (Admin)
 */
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration } = req.body;

    // Verifica se o serviço existe
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    // Atualiza o serviço
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        duration
      }
    });

    return res.json(updatedService);
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    return res.status(500).json({ message: 'Erro ao atualizar serviço', error: error.message });
  }
});

/**
 * @route   DELETE /api/services/:id
 * @desc    Remover um serviço
 * @access  Privado (Admin)
 */
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o serviço existe
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    // Remove o serviço
    await prisma.service.delete({
      where: { id }
    });

    return res.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover serviço:', error);
    return res.status(500).json({ message: 'Erro ao remover serviço', error: error.message });
  }
});

module.exports = router;