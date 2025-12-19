// src/components/ItemStats.jsx
import React from 'react';
import { FiPackage, FiDollarSign, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi';
import { formatCurrency, calculateTotalStockValue, countLowStockItems, calculateAverageProfitMargin } from '../utils/itemUtils';

const ItemStats = ({ items }) => {
  const stats = [
    {
      title: 'Total Item',
      value: items.length,
      icon: FiPackage,
      color: 'text-primary',
    },
    {
      title: 'Total Nilai Stok',
      value: formatCurrency(calculateTotalStockValue(items)),
      icon: FiDollarSign,
      color: 'text-success',
      valueClass: 'text-2xl',
    },
    {
      title: 'Stok Rendah',
      value: countLowStockItems(items),
      icon: FiAlertTriangle,
      color: 'text-warning',
    },
    {
      title: 'Avg Profit Margin',
      value: `${calculateAverageProfitMargin(items)}%`,
      icon: FiTrendingUp,
      color: 'text-error',
      valueClass: 'text-2xl',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="stats shadow">
          <div className="stat">
            <div className={`stat-figure ${stat.color}`}>
              <stat.icon className="text-3xl" />
            </div>
            <div className="stat-title">{stat.title}</div>
            <div className={`stat-value ${stat.color} ${stat.valueClass || ''}`}>
              {stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemStats;