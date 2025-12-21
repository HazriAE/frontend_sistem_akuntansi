import api from '../lib/axios';

// Dashboard Service
export const dashboardService = {
  // Fetch semua data untuk dashboard
  async getDashboardData() {
    try {
      const [
        jurnalRes,
        bukuBesarRes,
        neracaRes,
        labaRugiRes,
        arusKasRes,
        perubahanEkuitasRes,
      ] = await Promise.all([
        api.get('/jurnal'),
        api.get('/laporan/buku-besar-all'),
        api.get('/laporan/neraca-saldo'),
        api.get('/laporan/laba-rugi-multiple-step'),
        api.get('/laporan/arus-kas'),
        api.get('/laporan/perubahan-equitas'),
      ]);

      return {
        jurnal: jurnalRes.data.data,
        bukuBesar: bukuBesarRes.data.data,
        neracaSaldo: neracaRes.data.data,
        labaRugi: labaRugiRes.data.data,
        arusKas: arusKasRes.data.data,
        perubahanEkuitas: perubahanEkuitasRes.data.data,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Fetch individual endpoints
  async getJurnal() {
    const res = await api.get('/jurnal');
    return res.data.data;
  },

  async getBukuBesar() {
    const res = await api.get('/laporan/buku-besar-all');
    return res.data.data;
  },

  async getNeracaSaldo() {
    const res = await api.get('/laporan/neraca-saldo');
    return res.data.data;
  },

  async getLabaRugi() {
    const res = await api.get('/laporan/laba-rugi-multiple-step');
    return res.data.data;
  },

  async getArusKas() {
    const res = await api.get('/laporan/arus-kas');
    return res.data.data;
  },

  async getPerubahanEkuitas() {
    const res = await api.get('/laporan/perubahan-equitas');
    return res.data.data;
  },
};

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
  console.log(absAmount)

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

  const result = Math.floor(value * 100) / 100;

  const formatted = `Rp ${result} ${suffix}`;
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