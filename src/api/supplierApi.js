// ==================== FILE: src/api/supplierApi.js ====================

import api from "../lib/axios";

const supplierApi = {
  // Get all suppliers
  getAll: async (params = {}) => {
    const response = await api.get('/supplier', { params });
    return response.data;
  },

  // Get supplier by ID
  getById: async (id) => {
    const response = await api.get(`/supplier/${id}`);
    return response.data;
  },

  // Create supplier
  create: async (data) => {
    const response = await api.post('/supplier', data);
    return response.data;
  },

  // Update supplier
  update: async (id, data) => {
    const response = await api.put(`/supplier/${id}`, data);
    return response.data;
  },

  // Delete supplier
  delete: async (id) => {
    const response = await api.delete(`/supplier/${id}`);
    return response.data;
  }
};

export default supplierApi;