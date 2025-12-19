import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MdPrint, MdFileDownload, MdCalendarToday, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { FaExchangeAlt } from 'react-icons/fa';
import api from '../../lib/axios';

const LaporanArusKas = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['laporan-arus-kas', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const { data } = await api.get(`/laporan/arus-kas?${params}`);
      return data.data;
    },
    enabled: !!endDate
  });

  const formatRupiah = (amount) => {
    const absolute = Math.abs(amount || 0);
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0
    }).format(absolute);
    
    if (amount < 0) {
      return `(${formatted})`;
    }
    return formatted;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert('Export feature coming soon!');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>Gagal memuat data laporan</span>
        <button className="btn btn-sm" onClick={() => refetch()}>
          Coba Lagi
        </button>
      </div>
    );
  }

  const kasAwal = data?.kasAwal || 0;
  const kasAkhir = data?.kasAkhir || 0;
  const perubahanKas = data?.kenaikanPenurunanKas || 0;
  const operasi = data?.arusKasOperasi || {};
  const investasi = data?.arusKasInvestasi || {};
  const pendanaan = data?.arusKasPendanaan || {};

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="card bg-gradient-to-br from-info to-primary text-primary-content shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <FaExchangeAlt className="text-4xl" />
              <div>
                <h1 className="card-title text-3xl font-bold">Laporan Arus Kas</h1>
                <p className="text-sm opacity-80">Cash Flow Statement (Metode Tidak Langsung)</p>
              </div>
            </div>
            
            {/* Filter Section */}
            <div className="flex flex-wrap gap-4 items-end mt-4">
              <div className="form-control flex-1 min-w-[200px]">
                <label className="label">
                  <span className="label-text text-primary-content font-semibold">Dari Tanggal</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered bg-base-100 text-base-content"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-control flex-1 min-w-[200px]">
                <label className="label">
                  <span className="label-text text-primary-content font-semibold">Sampai Tanggal</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered bg-base-100 text-base-content"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <button 
                className="btn btn-accent"
                onClick={() => refetch()}
              >
                <MdCalendarToday size={20} />
                Tampilkan
              </button>

              <div className="flex gap-2">
                <button 
                  className="btn btn-outline btn-accent"
                  onClick={handlePrint}
                >
                  <MdPrint size={20} />
                  Cetak
                </button>
                <button 
                  className="btn btn-success"
                  onClick={handleExport}
                >
                  <MdFileDownload size={20} />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Header */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body py-4">
            <div className="text-center">
              <h2 className="text-xl font-bold">Laporan Arus Kas (Metode Tidak Langsung)</h2>
              <p className="text-sm text-base-content/60 mt-1">
                Periode yang berakhir, {new Date(data?.periode?.sampai || endDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stats shadow bg-base-100">
            <div className="stat p-4">
              <div className="stat-title text-xs">Kas Awal</div>
              <div className="stat-value text-info text-xl">{formatRupiah(kasAwal)}</div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat p-4">
              <div className="stat-title text-xs">Total Masuk</div>
              <div className="stat-value text-success text-xl">
                {formatRupiah(data?.summary?.totalKasMasuk || 0)}
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat p-4">
              <div className="stat-title text-xs">Total Keluar</div>
              <div className="stat-value text-error text-xl">
                {formatRupiah(data?.summary?.totalKasKeluar || 0)}
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat p-4">
              <div className="stat-title text-xs">Kas Akhir</div>
              <div className="stat-value text-primary text-xl">{formatRupiah(kasAkhir)}</div>
            </div>
          </div>
        </div>

        {/* Main Report */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6">
            
            {/* AKTIVITAS OPERASI */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-info">
                <h3 className="text-lg font-bold">Aktivitas Operasi</h3>
              </div>
              
              <div className="space-y-2">
                {operasi.transaksi && operasi.transaksi.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 hover:bg-base-200 px-2 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-base-content/60">{idx + 1}.</span>
                      <span>{item.deskripsi}</span>
                    </div>
                    <span className="font-mono">
                      {item.masuk > 0 ? formatRupiah(item.masuk) : `(${formatRupiah(item.keluar)})`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex bg-neutral-200 justify-between items-center mt-4 pt-3 border-t font-bold px-3 py-2 rounded">
                <span>Kas Diterima dari Aktivitas Operasi</span>
                <span className={`font-mono ${operasi.net >= 0 ? 'text-success' : 'text-error'}`}>
                  {formatRupiah(operasi.net)}
                </span>
              </div>
            </div>

            {/* AKTIVITAS INVESTASI */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-warning">
                <h3 className="text-lg font-bold">Aktivitas Investasi</h3>
              </div>
              
              <div className="space-y-2">
                {investasi.transaksi && investasi.transaksi.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 hover:bg-base-200 px-2 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-base-content/60">{idx + 1}.</span>
                      <span>{item.deskripsi}</span>
                    </div>
                    <span className="font-mono">
                      {item.masuk > 0 ? formatRupiah(item.masuk) : `(${formatRupiah(item.keluar)})`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex bg-neutral-200 justify-between items-center mt-4 pt-3 border-t font-bold px-3 py-2 rounded">
                <span>Kas Digunakan Untuk Aktivitas Investasi</span>
                <span className={`font-mono ${investasi.net >= 0 ? 'text-success' : 'text-error'}`}>
                  {formatRupiah(investasi.net)}
                </span>
              </div>
            </div>

            {/* AKTIVITAS PENDANAAN */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-success">
                <h3 className="text-lg font-bold">Aktivitas Pendanaan</h3>
              </div>
              
              <div className="space-y-2">
                {pendanaan.transaksi && pendanaan.transaksi.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 hover:bg-base-200 px-2 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-base-content/60">{idx + 1}.</span>
                      <span>{item.deskripsi}</span>
                    </div>
                    <span className="font-mono">
                      {item.masuk > 0 ? formatRupiah(item.masuk) : `(${formatRupiah(item.keluar)})`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t font-bold bg-neutral-200 px-3 py-2 rounded">
                <span>Kas Digunakan Untuk Aktivitas Pendanaan</span>
                <span className={`font-mono ${pendanaan.net >= 0 ? 'text-success' : 'text-error'}`}>
                  {formatRupiah(pendanaan.net)}
                </span>
              </div>
            </div>

            {/* SUMMARY SECTION */}
            <div className="border-t-2 border-primary pt-4 space-y-3">
              <div className="flex justify-between items-center font-semibold bg-base-200 px-3 py-2 rounded">
                <span>Kas (1 Januari {new Date(data?.periode?.dari).getFullYear() || new Date().getFullYear()})</span>
                <span className="font-mono">{formatRupiah(kasAwal)}</span>
              </div>

              <div className="flex justify-between items-center font-semibold px-3 py-2">
                <span>Kas Digunakan</span>
                <span className={`font-mono ${perubahanKas >= 0 ? 'text-success' : 'text-error'}`}>
                  {formatRupiah(perubahanKas)}
                </span>
              </div>

              <div className="flex justify-between items-center font-bold text-lg bg-primary text-primary-content px-3 py-3 rounded">
                <span>Kas (31 Desember {new Date(data?.periode?.sampai).getFullYear() || new Date().getFullYear()})</span>
                <span className="font-mono">{formatRupiah(kasAkhir)}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-info text-info-content shadow-lg">
            <div className="card-body p-4">
              <h4 className="font-bold text-sm mb-2">Operasi</h4>
              <p className="text-2xl font-bold">{formatRupiah(operasi.net)}</p>
              <p className="text-xs opacity-80">
                {operasi.net >= 0 ? 'Arus kas positif' : 'Arus kas negatif'}
              </p>
            </div>
          </div>

          <div className="card bg-warning text-warning-content shadow-lg">
            <div className="card-body p-4">
              <h4 className="font-bold text-sm mb-2">Investasi</h4>
              <p className="text-2xl font-bold">{formatRupiah(investasi.net)}</p>
              <p className="text-xs opacity-80">
                {investasi.net >= 0 ? 'Arus kas positif' : 'Arus kas negatif'}
              </p>
            </div>
          </div>

          <div className="card bg-success text-success-content shadow-lg">
            <div className="card-body p-4">
              <h4 className="font-bold text-sm mb-2">Pendanaan</h4>
              <p className="text-2xl font-bold">{formatRupiah(pendanaan.net)}</p>
              <p className="text-xs opacity-80">
                {pendanaan.net >= 0 ? 'Arus kas positif' : 'Arus kas negatif'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LaporanArusKas;