// src/components/ItemTable.jsx
import React from 'react';
import { FiEdit2, FiTrash2, FiAlertTriangle, FiPackage } from 'react-icons/fi';
import { CATEGORIES, STATUS_OPTIONS } from '../constants/itemConstants';
import { formatCurrency, calculateProfitMargin, isLowStock } from '../utils/itemUtils';

const ItemTable = ({ items, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="text-center py-12">
          <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Tidak ada item ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>SKU</th>
              <th>Nama Item</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Harga Beli</th>
              <th>Harga Jual</th>
              <th>Margin</th>
              <th>Status</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const lowStock = isLowStock(item.currentStock, item.reorderPoint);
              const profitMargin = calculateProfitMargin(item.costPrice, item.sellPrice);

              return (
                <tr key={item._id} className={lowStock ? 'bg-warning bg-opacity-10' : ''}>
                  <td className="font-mono font-semibold">{item.sku}</td>
                  <td>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline">
                      {CATEGORIES.find(c => c.value === item.category)?.label}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {lowStock && <FiAlertTriangle className="text-warning" />}
                      <span className={lowStock ? 'font-bold text-warning' : ''}>
                        {item.currentStock} {item.unit}
                      </span>
                    </div>
                  </td>
                  <td>{formatCurrency(item.costPrice)}</td>
                  <td>{formatCurrency(item.sellPrice)}</td>
                  <td>
                    <span className={`badge ${
                      profitMargin > 30 ? 'badge-success' : 
                      profitMargin > 10 ? 'badge-warning' : 
                      'badge-error'
                    }`}>
                      {profitMargin}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      item.status === 'active' ? 'badge-success' :
                      item.status === 'inactive' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {STATUS_OPTIONS.find(s => s.value === item.status)?.label}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="btn btn-sm btn-ghost text-primary"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="btn btn-sm btn-ghost text-error"
                        title="Hapus"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemTable;