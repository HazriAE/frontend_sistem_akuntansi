// Utility functions untuk memproses data dashboard

// Process data untuk Summary Cards
export const processSummaryData = (neracaSaldo, labaRugi, arusKas) => {
  const totalAset = neracaSaldo?.akun
    ?.filter(a => a.tipeAkun === 'aset')
    .reduce((sum, a) => sum + a.debit - a.kredit, 0) || 0;

  const totalLiabilitas = neracaSaldo?.akun
    ?.filter(a => a.tipeAkun === 'liabilitas')
    .reduce((sum, a) => sum + a.kredit - a.debit, 0) || 0;

  const totalEkuitas = neracaSaldo?.akun
    ?.filter(a => a.tipeAkun === 'ekuitas')
    .reduce((sum, a) => sum + a.kredit - a.debit, 0) || 0;

  const kas = neracaSaldo?.akun?.find(a => a.kodeAkun === '1-1101');
  const totalKas = kas ? kas.debit - kas.kredit : 0;

  const labaBersih = labaRugi?.labaBersih?.jumlah || 0;
  const grossProfitMargin = parseFloat(labaRugi?.labaKotor?.persentase?.replace('%', '') || 0);

  return {
    totalKas,
    totalAset,
    totalLiabilitas,
    totalEkuitas,
    labaBersih,
    grossProfitMargin,
  };
};

// Process data untuk Cash Flow Chart
export const processCashFlowData = (arusKas) => {
  if (!arusKas) return [];

  const operasi = arusKas.arusKasOperasi?.net || 0;
  const investasi = arusKas.arusKasInvestasi?.net || 0;
  const pendanaan = arusKas.arusKasPendanaan?.net || 0;

  return [
    { name: 'Operasi', value: operasi },
    { name: 'Investasi', value: investasi },
    { name: 'Pendanaan', value: pendanaan },
  ];
};

// Process data untuk Revenue vs Expense Chart
export const processRevenueExpenseData = (labaRugi) => {
  if (!labaRugi) return [];

  return [
    {
      category: 'Keuangan',
      Pendapatan: labaRugi.penjualan?.totalPenjualan || 0,
      Beban: (labaRugi.bebanPokokPenjualan?.total || 0) + (labaRugi.bebanUsaha?.total || 0),
    },
  ];
};

// Process data untuk Asset Composition
export const processAssetComposition = (neracaSaldo) => {
  if (!neracaSaldo?.akun) return [];

  const asetLancar = neracaSaldo.akun
    .filter(a => a.tipeAkun === 'aset' && a.kodeAkun.startsWith('1-1'))
    .reduce((sum, a) => sum + (a.debit - a.kredit), 0);

  const asetTetap = neracaSaldo.akun
    .filter(a => a.tipeAkun === 'aset' && a.kodeAkun.startsWith('1-2'))
    .reduce((sum, a) => sum + (a.debit - a.kredit), 0);

  return [
    { name: 'Aset Lancar', value: asetLancar },
    { name: 'Aset Tetap', value: asetTetap },
  ];
};

// Process data untuk Expense Breakdown
export const processExpenseBreakdown = (labaRugi) => {
  if (!labaRugi) return [];

  const hpp = labaRugi.bebanPokokPenjualan?.total || 0;
  const usaha = labaRugi.bebanUsaha?.total || 0;
  const pajak = labaRugi.bebanPajak?.total || 0;

  return [
    { name: 'HPP', value: hpp },
    { name: 'Beban Usaha', value: usaha },
    { name: 'Pajak', value: pajak },
  ].filter(item => item.value > 0);
};

// Process data untuk Top Assets
export const processTopAssets = (neracaSaldo) => {
  if (!neracaSaldo?.akun) return [];

  return neracaSaldo.akun
    .filter(a => a.tipeAkun === 'aset')
    .map(a => ({
      name: a.namaAkun,
      value: a.debit - a.kredit,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};

// Process data untuk Cash Flow Trend
export const processCashFlowTrend = (arusKas) => {
  if (!arusKas) return [];

  const allTransactions = [
    ...(arusKas.arusKasOperasi?.transaksi || []),
    ...(arusKas.arusKasInvestasi?.transaksi || []),
    ...(arusKas.arusKasPendanaan?.transaksi || []),
  ].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  let runningBalance = arusKas.kasAwal || 0;
  const trendData = [];

  // Group by month
  const monthlyData = {};
  allTransactions.forEach(t => {
    const date = new Date(t.tanggal);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        date: monthKey,
        masuk: 0,
        keluar: 0,
      };
    }
    
    monthlyData[monthKey].masuk += t.masuk || 0;
    monthlyData[monthKey].keluar += t.keluar || 0;
  });

  // Convert to array and calculate running balance
  Object.keys(monthlyData).sort().forEach(key => {
    const data = monthlyData[key];
    runningBalance += data.masuk - data.keluar;
    
    trendData.push({
      month: formatMonthYear(key),
      saldo: runningBalance,
    });
  });

  return trendData;
};

// Process data untuk Equity Structure
export const processEquityStructure = (perubahanEkuitas) => {
  if (!perubahanEkuitas?.komponenEkuitas) return [];

  return perubahanEkuitas.komponenEkuitas.map(k => ({
    name: k.akun.namaAkun,
    saldoAwal: k.saldoAwal,
    saldoAkhir: k.saldoAkhir,
  }));
};

// Helper: Format month-year
const formatMonthYear = (dateStr) => {
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Des'];
  return `${months[parseInt(month) - 1]} ${year}`;
};

// Calculate financial ratios
export const calculateRatios = (neracaSaldo, labaRugi) => {
  const asetLancar = neracaSaldo?.akun
    ?.filter(a => a.tipeAkun === 'aset' && a.kodeAkun.startsWith('1-1'))
    .reduce((sum, a) => sum + (a.debit - a.kredit), 0) || 0;

  const liabilitasLancar = neracaSaldo?.akun
    ?.filter(a => a.tipeAkun === 'liabilitas' && a.kodeAkun.startsWith('2-1'))
    .reduce((sum, a) => sum + (a.kredit - a.debit), 0) || 0;

  const totalLiabilitas = neracaSaldo?.akun
    ?.filter(a => a.tipeAkun === 'liabilitas')
    .reduce((sum, a) => sum + a.kredit - a.debit, 0) || 0;

  const totalEkuitas = neracaSaldo?.akun
    ?.filter(a => a.tipeAkun === 'ekuitas')
    .reduce((sum, a) => sum + a.kredit - a.debit, 0) || 0;

  const currentRatio = liabilitasLancar > 0 ? asetLancar / liabilitasLancar : 0;
  const debtToEquity = totalEkuitas > 0 ? totalLiabilitas / totalEkuitas : 0;

  return {
    currentRatio: currentRatio.toFixed(2),
    debtToEquity: debtToEquity.toFixed(2),
  };
};