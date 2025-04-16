const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, isAdmin, isAdminOrSeller } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();

/**
 * @route   GET /api/visits
 * @desc    Listar todas as visitas (com filtros opcionais)
 * @access  Privado
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { date, teamId, status } = req.query;
    
    // Constrói o filtro com base nos parâmetros da query
    const where = {};
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }
    
    if (teamId) {
      where.teamId = teamId;
    }
    
    if (status) {
      where.status = status;
    }
    
    // Filtra por equipe se o usuário for da equipe de campo
    if (req.userRole === 'FIELD_TEAM') {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { teamId: true }
      });
      
      if (user && user.teamId) {
        where.teamId = user.teamId;
      }
    }
    
    const visits = await prisma.visit.findMany({
      where,
      include: {
        client: true,
        team: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        services: true
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    return res.json(visits);
  } catch (error) {
    console.error('Erro ao listar visitas:', error);
    return res.status(500).json({ message: 'Erro ao listar visitas', error: error.message });
  }
});

/**
 * @route   GET /api/visits/:id
 * @desc    Obter uma visita específica
 * @access  Privado
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const visit = await prisma.visit.findUnique({
      where: { id },
      include: {
        client: true,
        team: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        services: true
      }
    });
    
    if (!visit) {
      return res.status(404).json({ message: 'Visita não encontrada' });
    }
    
    return res.json(visit);
  } catch (error) {
    console.error('Erro ao buscar visita:', error);
    return res.status(500).json({ message: 'Erro ao buscar visita', error: error.message });
  }
});

/**
 * @route   POST /api/visits
 * @desc    Criar uma nova visita
 * @access  Privado (Admin ou Vendedor)
 */
router.post('/', authenticate, isAdminOrSeller, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      date, 
      startTime, 
      endTime, 
      clientId, 
      teamId, 
      serviceIds,
      location,
      notes
    } = req.body;
    
    // Cria a visita
    const visit = await prisma.visit.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        location,
        notes,
        client: {
          connect: { id: clientId }
        },
        team: {
          connect: { id: teamId }
        },
        createdBy: {
          connect: { id: req.userId }
        },
        services: serviceIds && serviceIds.length > 0 ? {
          connect: serviceIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        client: true,
        team: true,
        services: true
      }
    });
    
    return res.status(201).json(visit);
  } catch (error) {
    console.error('Erro ao criar visita:', error);
    return res.status(500).json({ message: 'Erro ao criar visita', error: error.message });
  }
});

/**
 * @route   PUT /api/visits/:id
 * @desc    Atualizar uma visita
 * @access  Privado (Admin, Vendedor ou Equipe responsável)
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      date, 
      startTime, 
      endTime, 
      status,
      clientId, 
      teamId, 
      serviceIds,
      location,
      notes,
      imageUrl
    } = req.body;
    
    // Busca a visita para verificar permissões
    const existingVisit = await prisma.visit.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            members: true
          }
        }
      }
    });
    
    if (!existingVisit) {
      return res.status(404).json({ message: 'Visita não encontrada' });
    }
    
    // Verifica permissões
    const isTeamMember = existingVisit.team.members.some(member => member.id === req.userId);
    const canEdit = req.userRole === 'ADMIN' || 
                   req.userRole === 'SELLER' || 
                   isTeamMember;
    
    if (!canEdit) {
      return res.status(403).json({ message: 'Sem permissão para editar esta visita' });
    }
    
    // Prepara os dados para atualização
    const updateData = {};
    
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date) updateData.date = new Date(date);
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (status) updateData.status = status;
    if (location !== undefined) updateData.location = location;
    if (notes !== undefined) updateData.notes = notes;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    
    // Relações
    if (clientId) {
      updateData.client = {
        connect: { id: clientId }
      };
    }
    
    if (teamId && (req.userRole === 'ADMIN' || req.userRole === 'SELLER')) {
      updateData.team = {
        connect: { id: teamId }
      };
    }
    
    if (serviceIds) {
      updateData.services = {
        set: serviceIds.map(id => ({ id }))
      };
    }
    
    // Atualiza a visita
    const updatedVisit = await prisma.visit.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        team: true,
        services: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });
    
    return res.json(updatedVisit);
  } catch (error) {
    console.error('Erro ao atualizar visita:', error);
    return res.status(500).json({ message: 'Erro ao atualizar visita', error: error.message });
  }
});

/**
 * @route   PUT /api/visits/:id/complete
 * @desc    Marcar visita como concluída
 * @access  Privado (Equipe de campo)
 */
router.put('/:id/complete', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, imageUrl } = req.body;
    
    // Busca a visita para verificar permissões
    const existingVisit = await prisma.visit.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            members: true
          }
        }
      }
    });
    
    if (!existingVisit) {
      return res.status(404).json({ message: 'Visita não encontrada' });
    }
    
    // Verifica se o usuário é membro da equipe responsável pela visita
    const isTeamMember = existingVisit.team.members.some(member => member.id === req.userId);
    
    if (!isTeamMember && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Sem permissão para completar esta visita' });
    }
    
    // Atualiza a visita para concluída
    const updatedVisit = await prisma.visit.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        notes: notes || existingVisit.notes,
        imageUrl: imageUrl || existingVisit.imageUrl,
        endTime: new Date()
      },
      include: {
        client: true,
        team: true,
        services: true
      }
    });
    
    return res.json(updatedVisit);
  } catch (error) {
    console.error('Erro ao completar visita:', error);
    return res.status(500).json({ message: 'Erro ao completar visita', error: error.message });
  }
});

/**
 * @route   DELETE /api/visits/:id
 * @desc    Cancelar uma visita
 * @access  Privado (Admin ou Vendedor)
 */
router.delete('/:id', authenticate, isAdminOrSeller, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica se a visita existe
    const existingVisit = await prisma.visit.findUnique({
      where: { id }
    });
    
    if (!existingVisit) {
      return res.status(404).json({ message: 'Visita não encontrada' });
    }
    
    // Atualiza o status para cancelado em vez de excluir
    const updatedVisit = await prisma.visit.update({
      where: { id },
      data: {
        status: 'CANCELLED'
      }
    });
    
    return res.json({ message: 'Visita cancelada com sucesso', visit: updatedVisit });
  } catch (error) {
    console.error('Erro ao cancelar visita:', error);
    return res.status(500).json({ message: 'Erro ao cancelar visita', error: error.message });
  }
});

module.exports = router;