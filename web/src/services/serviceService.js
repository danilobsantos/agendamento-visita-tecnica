import api from './api';

/**
 * Serviço para gerenciar as requisições relacionadas aos serviços disponíveis
 */
export const serviceService = {
  // Listar todos os serviços
  getServices: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  // Obter um serviço específico
  getServiceById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Criar um novo serviço
  createService: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  // Atualizar um serviço
  updateService: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Remover um serviço
  deleteService: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  }
};