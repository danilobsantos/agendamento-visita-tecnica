const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();

/**
 * @route   GET /api/reports/team/:teamId
 * @desc    Relatório de visitas por equipe
 * @access  Privado (Admin)
 */
router.get('/team/:teamId', authenticate, isAdmin, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Constrói o filtro com base nos parâmetros
    const where = { teamId };
    
    // Adiciona filtro de data se fornecido
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    // Busca as visitas da equipe
    const visits = await prisma.visit.findMany({
      where,
      include: {
        client: true,
        services: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    // Calcula estatísticas
    const stats = {
      total: visits.length,
      completed: visits.filter(v => v.status === 'COMPLETED').length,
      inProgress: visits.filter(v => v.status === 'IN_PROGRESS').length,
      scheduled: visits.filter(v => v.status === 'SCHEDULED').length,
      cancelled: visits.filter(v => v.status === 'CANCELLED').length
    };
    
    return res.json({
      teamId,
      stats,
      visits
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de equipe:', error);
    return res.status(500).json({ message: 'Erro ao gerar relatório de equipe', error: error.message });
  }
});

/**
 * @route   GET /api/reports/client/:clientId
 * @desc    Relatório de visitas por cliente
 * @access  Privado
 */
router.get('/client/:clientId', authenticate, async (req, res) => {
  try {
    const { clientId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Constrói o filtro com base nos parâmetros
    const where = { clientId };
    
    // Adiciona filtro de data se fornecido
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    // Busca as visitas do cliente
    const visits = await prisma.visit.findMany({
      where,
      include: {
        team: true,
        services: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    // Busca informações do cliente
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });
    
    // Calcula estatísticas
    const stats = {
      total: visits.length,
      completed: visits.filter(v => v.status === 'COMPLETED').length,
      inProgress: visits.filter(v => v.status === 'IN_PROGRESS').length,
      scheduled: visits.filter(v => v.status === 'SCHEDULED').length,
      cancelled: visits.filter(v => v.status === 'CANCELLED').length
    };
    
    return res.json({
      client,
      stats,
      visits
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de cliente:', error);
    return res.status(500).json({ message: 'Erro ao gerar relatório de cliente', error: error.message });
  }
});

/**
 * @route   GET /api/reports/hours
 * @desc    Relatório de horas trabalhadas
 * @access  Privado (Admin)
 */
router.get('/hours', authenticate, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate, teamId } = req.query;
    
    // Verifica se as datas foram fornecidas
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Datas de início e fim são obrigatórias' });
    }
    
    // Constrói o filtro com base nos parâmetros
    const where = {
      status: 'COMPLETED',
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    };
    
    // Adiciona filtro de equipe se fornecido
    if (teamId) {
      where.teamId = teamId;
    }
    
    // Busca as visitas concluídas no período
    const visits = await prisma.visit.findMany({
      where,
      include: {
        team: true,
        client: true,
        services: true
      }
    });
    
    // Calcula as horas trabalhadas por equipe
    const teamHours = {};
    
    visits.forEach(visit => {
      const teamId = visit.teamId;
      const teamName = visit.team.name;
      
      if (!teamHours[teamId]) {
        teamHours[teamId] = {
          teamId,
          teamName,
          totalHours: 0,
          visits: []
        };
      }
      
      // Calcula a duração da visita em horas
      let hours = 0;
      if (visit.startTime && visit.endTime) {
        const start = new Date(visit.startTime);
        const end = new Date(visit.endTime);
        hours = (end - start) / (1000 * 60 * 60); // Converte milissegundos para horas
      }
      
      teamHours[teamId].totalHours += hours;
      teamHours[teamId].visits.push({
        id: visit.id,
        title: visit.title,
        date: visit.date,
        startTime: visit.startTime,
        endTime: visit.endTime,
        hours,
        client: visit.client.name
      });
    });
    
    return res.json({
      period: {
        startDate,
        endDate
      },
      teams: Object.values(teamHours)
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de horas:', error);
    return res.status(500).json({ message: 'Erro ao gerar relatório de horas', error: error.message });
  }
});

module.exports = router;