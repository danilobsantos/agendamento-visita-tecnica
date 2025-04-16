const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, isAdmin, isAdminOrSeller } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();

/**
 * @route   GET /api/clients
 * @desc    Listar todos os clientes
 * @access  Privado
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    return res.json(clients);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return res.status(500).json({ message: 'Erro ao listar clientes', error: error.message });
  }
});

/**
 * @route   GET /api/clients/:id
 * @desc    Obter um cliente específico
 * @access  Privado
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        visits: true
      }
    });

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    return res.json(client);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
  }
});

/**
 * @route   POST /api/clients
 * @desc    Criar um novo cliente
 * @access  Privado (Admin ou Vendedor)
 */
router.post('/', authenticate, isAdminOrSeller, async (req, res) => {
  try {
    const { name, address, city, state, zipCode, phone, email } = req.body;

    // Cria o cliente
    const client = await prisma.client.create({
      data: {
        name,
        address,
        city,
        state,
        zipCode,
        phone,
        email
      }
    });

    return res.status(201).json(client);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
  }
});

/**
 * @route   PUT /api/clients/:id
 * @desc    Atualizar um cliente
 * @access  Privado (Admin ou Vendedor)
 */
router.put('/:id', authenticate, isAdminOrSeller, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, state, zipCode, phone, email } = req.body;

    // Verifica se o cliente existe
    const existingClient = await prisma.client.findUnique({
      where: { id }
    });

    if (!existingClient) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Atualiza o cliente
    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        name,
        address,
        city,
        state,
        zipCode,
        phone,
        email
      }
    });

    return res.json(updatedClient);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
});

/**
 * @route   DELETE /api/clients/:id
 * @desc    Remover um cliente
 * @access  Privado (Admin)
 */
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o cliente existe
    const existingClient = await prisma.client.findUnique({
      where: { id }
    });

    if (!existingClient) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Remove o cliente
    await prisma.client.delete({
      where: { id }
    });

    return res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover cliente:', error);
    return res.status(500).json({ message: 'Erro ao remover cliente', error: error.message });
  }
});

module.exports = router;