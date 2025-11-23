import api from './api';

// Auth Services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await api.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },
};

// Inventory Services
export const inventoryService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/inventory?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/inventory', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/inventory/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/inventory/dashboard');
    return response.data;
  },
};

// Recipe Services
export const recipeService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/recipes?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/recipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/recipes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  finishCooking: async (id) => {
    const response = await api.post(`/recipes/${id}/finish`);
    return response.data;
  },
};

// History Services
export const historyService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/history?${params}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/history/stats');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  },

  clearAll: async () => {
    const response = await api.delete('/history');
    return response.data;
  },
};
