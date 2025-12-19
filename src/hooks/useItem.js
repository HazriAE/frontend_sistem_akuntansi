// ==================== FILE: src/hooks/useItem.js ====================

import { useQuery } from '@tanstack/react-query';
import itemApi from '../api/itemApi';

export const itemKeys = {
  all: ['items'],
  lists: () => [...itemKeys.all, 'list'],
  list: (filters) => [...itemKeys.lists(), { filters }],
  details: () => [...itemKeys.all, 'detail'],
  detail: (id) => [...itemKeys.details(), id]
};

export const useItems = (filters = {}) => {
  return useQuery({
    queryKey: itemKeys.list(filters),
    queryFn: () => itemApi.getAll(filters),
  });
};

export const useItem = (id) => {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: () => itemApi.getById(id),
    enabled: !!id,
  });
};