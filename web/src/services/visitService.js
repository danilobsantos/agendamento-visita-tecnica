import api from './api';

/**
 * Serviço para gerenciar as requisições relacionadas às visitas
 */
export const visitService = {
  // Listar todas as visitas
  getVisits: async (filters = {}) => {
    const response = await api.get('/visits', { params: filters });
    return response.data;
  },

  // Obter uma visita específica
  getVisitById: async (id) => {
    const response = await api.get(`/visits/${id}`);
    return response.data;
  },

  // Criar uma nova visita
  createVisit: async (visitData) => {
    const response = await api.post('/visits', visitData);
    return response.data;
  },

  // Atualizar uma visita
  updateVisit: async (id, visitData) => {
    const response = await api.put(`/visits/${id}`, visitData);
    return response.data;
  },

  // Cancelar uma visita
  cancelVisit: async (id) => {
    const response = await api.delete(`/visits/${id}`);
    return response.data;
  },

  // Marcar visita como concluída
  completeVisit: async (id) => {
    const response = await api.put(`/visits/${id}/complete`);
    return response.data;
  },

  // Obter relatório de visitas por equipe
  getTeamReport: async (teamId) => {
    const response = await api.get(`/reports/team/${teamId}`);
    return response.data;
  },

  // Obter relatório de visitas por cliente
  getClientReport: async (clientId) => {
    const response = await api.get(`/reports/client/${clientId}`);
    return response.data;
  },

  // Obter relatório de horas trabalhadas
  getHoursReport: async () => {
    const response = await api.get('/reports/hours');
    return response.data;
  }
};