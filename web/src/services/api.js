import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  config => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  response => response,
  error => {
    // Se o erro for 401 (Não autorizado), pode ser que o token expirou
    if (error.response && error.response.status === 401) {
      // Limpa os dados de autenticação
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Redireciona para a página de login
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default api;