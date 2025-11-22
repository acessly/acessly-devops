import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://acessly-api.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

let cachedUser = null;

api.interceptors.request.use(
  async (config) => {
    const publicRoutes = ['/auth/login', '/users'];
    const isPublicRoute = publicRoutes.some(route => 
      config.url.includes(route) && config.method === 'post'
    );
    
    if (!isPublicRoute) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Erro ao buscar token:', error);
      }
    } else {
      delete config.headers.Authorization;
    }
    
    return config;
  },
  (error) => {
    console.error('Erro no interceptor request:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Erro da API:', error.response.data);
    } else if (error.request) {
      console.error('Sem resposta da API');
    } else {
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    cachedUser = null;
    
    const loginResponse = await api.post('/auth/login', { email, password });
    
    if (loginResponse.data.token) {
      await AsyncStorage.setItem('token', loginResponse.data.token);
      await AsyncStorage.setItem('userEmail', email);
    }
    
    return loginResponse.data;
  },

  logout: async () => {
    cachedUser = null;
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userEmail');
  },

  getCurrentUser: async () => {
    try {
      if (cachedUser) {
        return cachedUser;
      }

      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        throw new Error('Usuário não autenticado');
      }

      const usersResponse = await api.get(`/users?page=0&size=100`);
      const user = usersResponse.data.content.find(u => u.email === email);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      let candidateId = null;
      if (user.userRole === 'CANDIDATE') {
        try {
          const candidatesResponse = await api.get(`/candidates?page=0&size=100`);
          const candidate = candidatesResponse.data.content.find(c => c.userId === user.id);
          
          if (candidate) {
            candidateId = candidate.id.toString();
          }
        } catch (error) {
          console.error('Erro ao buscar candidato:', error.message);
        }
      }

      let companyId = null;
      if (user.userRole === 'COMPANY') {
        try {
          const companiesResponse = await api.get(`/companies?page=0&size=100`);
          const company = companiesResponse.data.content.find(c => c.userId === user.id);
          
          if (company) {
            companyId = company.id.toString();
          }
        } catch (error) {
          console.error('Erro ao buscar empresa:', error.message);
        }
      }

      const userData = {
        userId: user.id.toString(),
        candidateId,
        companyId,
        email: user.email,
        name: user.name,
        role: user.userRole,
      };

      cachedUser = userData;
      return userData;

    } catch (error) {
      console.error('Erro em getCurrentUser:', error);
      throw error;
    }
  },

  refreshUser: async () => {
    cachedUser = null;
    return await authService.getCurrentUser();
  },
};

export const userService = {
  criar: async (dados) => {
    const response = await api.post('/users', dados);
    return response.data;
  },

  listar: async (page = 0, size = 10) => {
    const response = await api.get(`/users?page=${page}&size=${size}`);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/users/${id}`, dados);
    cachedUser = null;
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export const candidateService = {
  criar: async (dados) => {
    const response = await api.post('/candidates', dados);
    cachedUser = null;
    return response.data;
  },

  listar: async (page = 0, size = 10, filters = {}) => {
    let url = `/candidates?page=${page}&size=${size}`;
    if (filters.disabilityType) url += `&disabilityType=${filters.disabilityType}`;
    if (filters.skills) url += `&skills=${filters.skills}`;
    const response = await api.get(url);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/candidates/${id}`, dados);
    cachedUser = null;
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/candidates/${id}`);
    cachedUser = null;
    return response.data;
  },
};

export const companyService = {
  criar: async (dados) => {
    const response = await api.post('/companies', dados);
    return response.data;
  },

  listar: async (page = 0, size = 10, filters = {}) => {
    let url = `/companies?page=${page}&size=${size}`;
    if (filters.name) url += `&name=${filters.name}`;
    if (filters.sector) url += `&sector=${filters.sector}`;
    const response = await api.get(url);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/companies/${id}`, dados);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },
};

export const vacancyService = {
  criar: async (dados) => {
    const response = await api.post('/vacancies', dados);
    return response.data;
  },

  listar: async (page = 0, size = 10, filters = {}) => {
    let url = `/vacancies?page=${page}&size=${size}`;
    if (filters.title) url += `&title=${filters.title}`;
    if (filters.city) url += `&city=${filters.city}`;
    if (filters.vacancyType) url += `&vacancyType=${filters.vacancyType}`;
    const response = await api.get(url);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/vacancies/${id}`);
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/vacancies/${id}`, dados);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/vacancies/${id}`);
    return response.data;
  },
};

export const candidacyService = {
  criar: async (dados) => {
    const response = await api.post('/candidacies', dados);
    return response.data;
  },

  listar: async (page = 0, size = 10) => {
    const response = await api.get(`/candidacies?page=${page}&size=${size}`);
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/candidacies/${id}`);
    return response.data;
  },

  listarPorCandidato: async (candidateId, page = 0, size = 10) => {
    const response = await api.get(`/candidacies/candidates/${candidateId}?page=${page}&size=${size}`);
    return {
      content: Array.isArray(response.data) ? response.data : [],
      totalElements: Array.isArray(response.data) ? response.data.length : 0,
    };
  },

  listarPorVaga: async (vacancyId, page = 0, size = 10) => {
    const response = await api.get(`/candidacies/vacancy/${vacancyId}?page=${page}&size=${size}`);
    return response.data;
  },

  atualizarStatus: async (id, status) => {
    const response = await api.patch(`/candidacies/${id}/status?status=${status}`);
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/candidacies/${id}`);
    return response.data;
  },
};

export default api;
