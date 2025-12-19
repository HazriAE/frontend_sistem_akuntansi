// ==================== FILE: src/hooks/useSupplier.js ====================

import { useQuery } from '@tanstack/react-query';
import supplierApi from '../api/supplierApi';

export const supplierKeys = {
  all: ['suppliers'],
  lists: () => [...supplierKeys.all, 'list'],
  list: (filters) => [...supplierKeys.lists(), { filters }],
  details: () => [...supplierKeys.all, 'detail'],
  detail: (id) => [...supplierKeys.details(), id]
};

export const useSuppliers = (filters = {}) => {
  return useQuery({
    queryKey: supplierKeys.list(filters),
    queryFn: () => supplierApi.getAll(filters),
  });
};

export const useSupplier = (id) => {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => supplierApi.getById(id),
    enabled: !!id,
  });
};
