// src/components/DeleteModal.jsx
import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const DeleteModal = ({ isOpen, onClose, item, onConfirm, isLoading }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <FiTrash2 className="text-red-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Hapus Item</h3>
            <p className="text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6">
          Apakah Anda yakin ingin menghapus item <strong>{item.name}</strong> ({item.sku})?
        </p>

        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Batal
          </button>
          <button 
            onClick={() => onConfirm(item._id)} 
            className="btn btn-error"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Menghapus...
              </>
            ) : (
              'Hapus'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;