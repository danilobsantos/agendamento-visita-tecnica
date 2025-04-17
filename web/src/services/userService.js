import api from './api';

/**
 * Serviço para gerenciar as requisições relacionadas aos usuários
 */
export const userService = {
  // Listar todos os usuários
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Obter um usuário específico
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Criar um novo usuário
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Atualizar um usuário
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Remover um usuário
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Obter usuários por equipe
  getUsersByTeam: async (teamId) => {
    const response = await api.get(`/teams/${teamId}/users`);
    return response.data;
  }
};