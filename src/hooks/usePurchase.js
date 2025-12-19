// ==================== FILE: src/hooks/usePurchase.js ====================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import purchaseApi from '../api/purchaseApi';

// Query keys
export const purchaseKeys = {
  all: ['purchases'],
  lists: () => [...purchaseKeys.all, 'list'],
  list: (filters) => [...purchaseKeys.lists(), { filters }],
  details: () => [...purchaseKeys.all, 'detail'],
  detail: (id) => [...purchaseKeys.details(), id],
  outstanding: (supplierId) => [...purchaseKeys.all, 'outstanding', supplierId],
  agingReport: () => [...purchaseKeys.all, 'aging-report']
};

// Get all purchases with filters
export const usePurchases = (filters = {}) => {
  return useQuery({
    queryKey: purchaseKeys.list(filters),
    queryFn: () => purchaseApi.getAll(filters),
    staleTime: 30000, // 30 seconds
  });
};

// Get single purchase by ID
export const usePurchase = (id) => {
  return useQuery({
    queryKey: purchaseKeys.detail(id),
    queryFn: () => purchaseApi.getById(id),
    enabled: !!id, // Only run if id exists
  });
};

// Get outstanding purchases
export const useOutstandingPurchases = (supplierId) => {
  return useQuery({
    queryKey: purchaseKeys.outstanding(supplierId),
    queryFn: () => purchaseApi.getOutstanding(supplierId),
  });
};

// Get aging report
export const useAgingReport = () => {
  return useQuery({
    queryKey: purchaseKeys.agingReport(),
    queryFn: () => purchaseApi.getAgingReport(),
  });
};

// Create purchase mutation
export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => purchaseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
    },
  });
};

// Update purchase mutation
export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => purchaseApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseKeys.detail(variables.id) });
    },
  });
};

// Delete purchase mutation
export const useDeletePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => purchaseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
    },
  });
};

// Approve purchase mutation
export const useApprovePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, approvedBy }) => purchaseApi.approve(id, approvedBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseKeys.detail(variables.id) });
    },
  });
};

// Receive purchase mutation
export const useReceivePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, receivedBy }) => purchaseApi.receive(id, receivedBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseKeys.detail(variables.id) });
    },
  });
};

// Cancel purchase mutation
export const useCancelPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason, cancelledBy }) => purchaseApi.cancel(id, reason, cancelledBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseKeys.detail(variables.id) });
    },
  });
};