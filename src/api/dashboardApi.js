import api from '../lib/axios';
import { data_offline } from '../data/dataOflline';

// Dashboard Service
export const dashboardService = {

  getDashboardData: {
    jurnal: data_offline.jurnal_umum.data,
    bukuBesar: data_offline.buku_besar.data,
    neracaSaldo: data_offline.neraca_saldo.data,
    labaRugi: data_offline.laba_rugi.data,
    arusKas: data_offline.arus_kas.data,
    perubahanEkuitas: data_offline.perubahan_equitas.data,
  },
}

// Helper function untuk format currency
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Rp 0';
  
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);

  return amount < 0 ? `(${formatted})` : formatted;
};

// Helper function untuk format currency compact (Miliar, Juta)
export const formatCurrencyCompact = (amount) => {
  if (!amount && amount !== 0) return 'Rp 0';
  
  const absAmount = Math.abs(amount);
  let value, suffix;

  if (absAmount >= 1000000000) {
    value = absAmount / 1000000000;
    suffix = 'M'; // Miliar
  } else if (absAmount >= 1000000) {
    value = absAmount / 1000000;
    suffix = 'Jt'; // Juta
  } else if (absAmount >= 1000) {
    value = absAmount / 1000;
    suffix = 'Rb'; // Ribu
  } else {
    return formatCurrency(amount);
  }

  const formatted = `Rp ${value.toFixed(2)} ${suffix}`;
  return amount < 0 ? `(${formatted})` : formatted;
};

// Helper function untuk format percentage
export const formatPercentage = (value) => {
  if (!value && value !== 0) return '0%';
  return `${parseFloat(value).toFixed(2)}%`;
};

// Helper function untuk parse percentage string dari API
export const parsePercentage = (percentStr) => {
  if (!percentStr) return 0;
  return parseFloat(percentStr.replace('%', ''));
};

export default api;