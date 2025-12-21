// src/components/ItemFilters.jsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { CATEGORIES, STATUS_OPTIONS } from '../constants/itemConstants';

const ItemFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  statusFilter, 
  setStatusFilter,
  showLowStock,
  setShowLowStock 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              placeholder="Cari SKU atau nama..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <select
          className="select select-bordered"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>

        {/* Low Stock Toggle */}
        <label className="label cursor-pointer justify-start gap-3 border rounded-lg px-4">
          <input
            type="checkbox"
            className="toggle toggle-warning"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
          />
          <span className="label-text font-medium">Stok Rendah</span>
        </label>
      </div>
    </div>
  );
};

export default ItemFilters;