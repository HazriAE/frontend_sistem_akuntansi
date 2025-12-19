// ==================== FILE: src/api/purchaseApi.js ====================

import api from "../lib/axios";

const purchaseApi = {
  // Get all purchases with filters
  getAll: async (params = {}) => {
    const response = await api.get('/purchase', { params });
    return response.data;
  },

  // Get purchase by ID
  getById: async (id) => {
    const response = await api.get(`/purchase/${id}`);
    return response.data;
  },

  // Get outstanding purchases
  getOutstanding: async (supplierId) => {
    const params = supplierId ? { supplierId } : {};
    const response = await api.get('/purchase/outstanding', { params });
    return response.data;
  },

  // Get aging report
  getAgingReport: async () => {
    const response = await api.get('/purchase/aging-report');
    return response.data;
  },

  // Create new purchase
  create: async (data) => {
    const response = await api.post('/purchase', data);
    return response.data;
  },

  // Update purchase (draft only)
  update: async (id, data) => {
    const response = await api.put(`/purchase/${id}`, data);
    return response.data;
  },

  // Delete purchase (draft only)
  delete: async (id) => {
    const response = await api.delete(`/purchase/${id}`);
    return response.data;
  },

  // Approve purchase
  approve: async (id, approvedBy) => {
    const response = await api.post(`/purchase/${id}/approve`, { approvedBy });
    return response.data;
  },

  // Mark as received
  receive: async (id, receivedBy) => {
    const response = await api.post(`/purchase/${id}/receive`, { receivedBy });
    return response.data;
  },

  // Cancel purchase
  cancel: async (id, reason, cancelledBy) => {
    const response = await api.post(`/purchase/${id}/cancel`, { reason, cancelledBy });
    return response.data;
  }
};

export default purchaseApi;