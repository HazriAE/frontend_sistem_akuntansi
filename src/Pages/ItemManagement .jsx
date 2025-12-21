// src/pages/ItemManagement.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPackage, FiPlus } from 'react-icons/fi';
import itemService from '../api/itemService';
import Toast from '../components/Toast';
import ItemStats from '../components/ItemStats';
import ItemFilters from '../components/ItemFilters';
import ItemTable from '../components/ItemTable';
import ItemFormModal from '../components/ItemFormModal';
import DeleteModal from '../components/DeleteModal';

const ItemManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [showLowStock, setShowLowStock] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState(null);

  const queryClient = useQueryClient();

  // Fetch items
  const { data: itemsData, isLoading } = useQuery({
    queryKey: ['items', searchTerm, categoryFilter, statusFilter, showLowStock],
    queryFn: () => itemService.getAll({
      search: searchTerm,
      category: categoryFilter,
      status: statusFilter,
      lowStock: showLowStock,
    }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: itemService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['items']);
      showToast('Item berhasil dihapus!', 'success');
      setIsDeleteOpen(false);
      setDeleteItem(null);
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Gagal menghapus item', 'error');
    },
  });

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item) => {
    setDeleteItem(item);
    setIsDeleteOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditItem(null);
  };

  const handleConfirmDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const items = itemsData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FiPackage className="text-primary" />
                Manajemen Item
              </h1>
              <p className="text-gray-600 mt-1">Kelola data item dan inventori</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn btn-primary gap-2"
            >
              <FiPlus /> Tambah Item
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <ItemFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showLowStock={showLowStock}
          setShowLowStock={setShowLowStock}
        />

        {/* Stats */}
        <ItemStats items={items} />

        {/* Table */}
        <ItemTable
          items={items}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modals */}
      <ItemFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editItem={editItem}
        onSuccess={showToast}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        item={deleteItem}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ItemManagement;