import api from './api';

/**
 * Serviço para gerenciar as requisições relacionadas ao painel administrativo
 */
export const adminService = {
  // Equipes
  getTeams: async () => {
    const response = await api.get('/teams');
    return response.data;
  },
  
  getTeamById: async (id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },
  
  createTeam: async (teamData) => {
    const response = await api.post('/teams', teamData);
    return response.data;
  },
  
  updateTeam: async (id, teamData) => {
    const response = await api.put(`/teams/${id}`, teamData);
    return response.data;
  },
  
  deleteTeam: async (id) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },
  
  // Clientes
  getClients: async () => {
    const response = await api.get('/clients');
    return response.data;
  },
  
  getClientById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  
  createClient: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },
  
  updateClient: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },
  
  deleteClient: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
  
  // Agendamentos/Visitas
  getVisits: async (filters = {}) => {
    const response = await api.get('/visits', { params: filters });
    return response.data;
  },
  
  getVisitById: async (id) => {
    const response = await api.get(`/visits/${id}`);
    return response.data;
  },
  
  createVisit: async (visitData) => {
    const response = await api.post('/visits', visitData);
    return response.data;
  },
  
  updateVisit: async (id, visitData) => {
    const response = await api.put(`/visits/${id}`, visitData);
    return response.data;
  },
  
  deleteVisit: async (id) => {
    const response = await api.delete(`/visits/${id}`);
    return response.data;
  },
  
  // Serviços
  getServices: async () => {
    const response = await api.get('/services');
    return response.data;
  },
  
  getServiceById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },
  
  createService: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },
  
  updateService: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },
  
  deleteService: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
  
  // Relatórios
  getVisitReports: async (params) => {
    const response = await api.get('/reports/visits', { params });
    return response.data;
  },
  
  getTeamPerformanceReport: async (params) => {
    const response = await api.get('/reports/teams/performance', { params });
    return response.data;
  },
  
  getClientActivityReport: async (params) => {
    const response = await api.get('/reports/clients/activity', { params });
    return response.data;
  }
};

export default adminService;