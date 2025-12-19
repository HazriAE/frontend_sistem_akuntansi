// ==================== FILE: src/api/itemApi.js ====================

import api from "../lib/axios";

const itemApi = {
  // Get all items
  getAll: async (params = {}) => {
    const response = await api.get('/items', { params });
    return response.data;
  },

  // Get item by ID
  getById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // Create item
  create: async (data) => {
    const response = await api.post('/items', data);
    return response.data;
  },

  // Update item
  update: async (id, data) => {
    const response = await api.put(`/items/${id}`, data);
    return response.data;
  },

  // Delete item
  delete: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  // Get item stock
  getStock: async (id) => {
    const response = await api.get(`/stock/${id}`);
    return response.data;
  }
};

export default itemApi;

