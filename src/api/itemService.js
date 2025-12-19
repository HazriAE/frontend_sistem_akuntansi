// src/api/itemService.js
import api from "../lib/axios";

export const itemService = {
  getAll: async (params) => {
    const { data } = await api.get('/items', { params });
    return data;
  },
  
  getById: async (id) => {
    const { data } = await api.get(`/items/${id}`);
    return data;
  },
  
  create: async (itemData) => {
    const { data } = await api.post('/items', itemData);
    return data;
  },
  
  update: async ({ id, ...itemData }) => {
    const { data } = await api.put(`/items/${id}`, itemData);
    return data;
  },
  
  delete: async (id) => {
    const { data } = await api.delete(`/items/${id}`);
    return data;
  },
};

export default itemService;