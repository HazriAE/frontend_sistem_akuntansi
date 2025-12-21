// src/utils/itemUtils.js

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

export const calculateProfitMargin = (costPrice, sellPrice) => {
  if (costPrice === 0) return 0;
  return (((sellPrice - costPrice) / costPrice) * 100).toFixed(2);
};

export const isLowStock = (currentStock, reorderPoint) => {
  return currentStock <= reorderPoint;
};

export const calculateTotalStockValue = (items) => {
  return items.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);
};

export const calculateAverageProfitMargin = (items) => {
  if (items.length === 0) return 0;
  const totalMargin = items.reduce(
    (sum, item) => sum + parseFloat(calculateProfitMargin(item.costPrice, item.sellPrice)), 
    0
  );
  return (totalMargin / items.length).toFixed(2);
};

export const countLowStockItems = (items) => {
  return items.filter(item => isLowStock(item.currentStock, item.reorderPoint)).length;
};