import { useState, Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MdPrint, MdFileDownload, MdCalendarToday, MdTrendingUp, MdTrendingDown, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { FaBalanceScale, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import api from '../../lib/axios';

const LaporanPerubahanEkuitas = () => {
  const [startDate, setStartDate] = useState(new Date(2025, 0, 2).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(2025, 3, 1).toISOString().split('T')[0]);
  const [expandedRows, setExpandedRows] = useState({});

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['laporan-ekuitas', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const { data } = await api.get(`/laporan/perubahan-equitas?${params}`);
      return data.data;
    },
    enabled: !!endDate
  });

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const toggleRow = (kodeAkun) => {
    setExpandedRows(prev => ({
      ...prev,
      [kodeAkun]: !prev[kodeAkun]
    }));
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

  const komponenEkuitas = data?.komponenEkuitas || [];
  const summary = data?.summary || {};
  const labaRugi = data?.labaRugiPeriode || 0;

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <FaChartLine className="text-4xl" />
              <div>
                <h1 className="card-title text-3xl font-bold">Laporan Perubahan Ekuitas</h1>
                <p className="text-sm opacity-80">Statement of Changes in Equity</p>
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
          <div className="card-body text-center py-6">
            <h2 className="text-2xl font-bold">LAPORAN PERUBAHAN EKUITAS</h2>
            <p className="text-sm text-base-content/60 mt-2">
              Periode: {new Date(data?.periode?.dari).toLocaleDateString('id-ID')} s/d {new Date(data?.periode?.sampai).toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="stats shadow bg-base-100">
            <div className="stat p-4">
              <div className="stat-figure text-primary">
                <FaBalanceScale className="text-2xl" />
              </div>
              <div className="stat-title text-xs">Ekuitas Awal</div>
              <div className="stat-value text-primary text-lg">
                {formatRupiah(summary.totalEkuitasAwal)}
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat p-4">
              <div className="stat-figure text-success">
                <MdTrendingUp className="text-2xl" />
              </div>
              <div className="stat-title text-xs">Penambahan</div>
              <div className="stat-value text-success text-lg">
                {formatRupiah(summary.totalPenambahan)}
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat p-4">
              <div className="stat-figure text-error">
                <MdTrendingDown className="text-2xl" />
              </div>
              <div className="stat-title text-xs">Pengurangan</div>
              <div className="stat-value text-error text-lg">
                {formatRupiah(summary.totalPengurangan)}
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat p-4">
              <div className={`stat-figure ${labaRugi >= 0 ? 'text-success' : 'text-error'}`}>
                <FaChartLine className="text-2xl" />
              </div>
              <div className="stat-title text-xs">{labaRugi >= 0 ? 'Laba' : 'Rugi'}</div>
              <div className={`stat-value text-lg ${labaRugi >= 0 ? 'text-success' : 'text-error'}`}>
                {formatRupiah(Math.abs(labaRugi))}
              </div>
            </div>
          </div>

          <div className="stats shadow bg-base-100">
            <div className="stat p-4">
              <div className="stat-figure text-info">
                <FaMoneyBillWave className="text-2xl" />
              </div>
              <div className="stat-title text-xs">Ekuitas Akhir</div>
              <div className="stat-value text-info text-lg">
                {formatRupiah(summary.totalEkuitasAkhir)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-base-200">
                  <tr>
                    <th className="w-12"></th>
                    <th className="min-w-[250px]">Komponen Ekuitas</th>
                    <th className="text-right min-w-[150px]">Saldo Awal</th>
                    <th className="text-right min-w-[150px]">Penambahan</th>
                    <th className="text-right min-w-[150px]">Pengurangan</th>
                    <th className="text-right min-w-[150px]">Mutasi Neto</th>
                    <th className="text-right min-w-[150px]">Saldo Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {komponenEkuitas.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-base-content/60">
                        Tidak ada data ekuitas untuk periode ini
                      </td>
                    </tr>
                  ) : (
                    komponenEkuitas.map((item, index) => (
                      <Fragment key={index}>
                        <tr className="hover">
                          <td>
                            {item.mutasiDetail && item.mutasiDetail.length > 0 && (
                              <button
                                className="btn btn-ghost btn-xs btn-circle"
                                onClick={() => toggleRow(item.akun.kodeAkun)}
                              >
                                {expandedRows[item.akun.kodeAkun] ? (
                                  <MdExpandLess size={18} />
                                ) : (
                                  <MdExpandMore size={18} />
                                )}
                              </button>
                            )}
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <BiLineChart className="text-primary" />
                              <div>
                                <div className="font-medium">{item.akun.namaAkun}</div>
                                <div className="text-xs text-base-content/60 font-mono">
                                  {item.akun.kodeAkun}
                                </div>
                                <div className="badge badge-ghost badge-sm mt-1">
                                  {item.akun.kategori}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right font-mono">
                            {formatRupiah(item.saldoAwal)}
                          </td>
                          <td className="text-right font-mono">
                            {item.penambahan > 0 ? (
                              <span className="text-success font-semibold">
                                {formatRupiah(item.penambahan)}
                              </span>
                            ) : (
                              <span className="text-base-content/30">-</span>
                            )}
                          </td>
                          <td className="text-right font-mono">
                            {item.pengurangan > 0 ? (
                              <span className="text-error font-semibold">
                                {formatRupiah(item.pengurangan)}
                              </span>
                            ) : (
                              <span className="text-base-content/30">-</span>
                            )}
                          </td>
                          <td className="text-right font-mono">
                            <span className={item.mutasiNet >= 0 ? 'text-success' : 'text-error'}>
                              {formatRupiah(item.mutasiNet)}
                            </span>
                          </td>
                          <td className="text-right font-mono font-bold">
                            {formatRupiah(item.saldoAkhir)}
                          </td>
                        </tr>

                        {/* Expanded Detail */}
                        {expandedRows[item.akun.kodeAkun] && item.mutasiDetail && item.mutasiDetail.length > 0 && (
                          <tr>
                            <td colSpan="7" className="bg-base-200 p-0">
                              <div className="p-4">
                                <h4 className="font-bold text-sm mb-3">Detail Mutasi:</h4>
                                <table className="table table-sm">
                                  <thead>
                                    <tr className="bg-base-300">
                                      <th>Tanggal</th>
                                      <th>No. Jurnal</th>
                                      <th>Keterangan</th>
                                      <th className="text-right">Debit</th>
                                      <th className="text-right">Kredit</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.mutasiDetail.map((mutasi, idx) => (
                                      <tr key={idx}>
                                        <td className="text-sm">
                                          {new Date(mutasi.tanggal).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="font-mono text-sm">{mutasi.nomorJurnal}</td>
                                        <td className="text-sm">{mutasi.keterangan}</td>
                                        <td className="text-right font-mono text-sm">
                                          {mutasi.debit > 0 ? formatRupiah(mutasi.debit) : '-'}
                                        </td>
                                        <td className="text-right font-mono text-sm">
                                          {mutasi.kredit > 0 ? formatRupiah(mutasi.kredit) : '-'}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))
                  )}

                  {/* Laba/Rugi Periode Berjalan Row */}
                  <tr className="bg-info/10 font-semibold">
                    <td></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FaChartLine className={labaRugi >= 0 ? 'text-success' : 'text-error'} />
                        <span>{labaRugi >= 0 ? 'Laba' : 'Rugi'} Periode Berjalan</span>
                      </div>
                    </td>
                    <td className="text-right">-</td>
                    <td className="text-right font-mono">
                      {labaRugi >= 0 ? formatRupiah(labaRugi) : '-'}
                    </td>
                    <td className="text-right font-mono">
                      {labaRugi < 0 ? formatRupiah(Math.abs(labaRugi)) : '-'}
                    </td>
                    <td className="text-right font-mono">
                      <span className={labaRugi >= 0 ? 'text-success' : 'text-error'}>
                        {formatRupiah(labaRugi)}
                      </span>
                    </td>
                    <td className="text-right font-mono font-bold">
                      {formatRupiah(labaRugi)}
                    </td>
                  </tr>
                </tbody>

                {/* Total Footer */}
                <tfoot className="bg-primary text-primary-content">
                  <tr className="font-bold text-base">
                    <td colSpan="2">
                      <div className="flex items-center gap-2">
                        <FaBalanceScale className="text-xl" />
                        TOTAL EKUITAS
                      </div>
                    </td>
                    <td className="text-right">{formatRupiah(summary.totalEkuitasAwal)}</td>
                    <td className="text-right">{formatRupiah(summary.totalPenambahan + (labaRugi > 0 ? labaRugi : 0))}</td>
                    <td className="text-right">{formatRupiah(summary.totalPengurangan + (labaRugi < 0 ? Math.abs(labaRugi) : 0))}</td>
                    <td className="text-right">
                      {formatRupiah(summary.totalEkuitasAkhir - summary.totalEkuitasAwal)}
                    </td>
                    <td className="text-right">{formatRupiah(summary.totalEkuitasAkhir)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Net Change Summary */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">
              <BiLineChart className="text-2xl" />
              Ringkasan Perubahan
            </h3>
            <div className="divider my-2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-base-200 rounded-lg">
                <p className="text-sm text-base-content/60 mb-2">Perubahan Neto</p>
                <p className={`text-3xl font-bold ${
                  (summary.totalEkuitasAkhir - summary.totalEkuitasAwal) >= 0 ? 'text-success' : 'text-error'
                }`}>
                  {formatRupiah(summary.totalEkuitasAkhir - summary.totalEkuitasAwal)}
                </p>
              </div>
              <div className="text-center p-4 bg-base-200 rounded-lg">
                <p className="text-sm text-base-content/60 mb-2">Persentase Perubahan</p>
                <p className={`text-3xl font-bold ${
                  (summary.totalEkuitasAkhir - summary.totalEkuitasAwal) >= 0 ? 'text-success' : 'text-error'
                }`}>
                  {summary.totalEkuitasAwal > 0 
                    ? ((summary.totalEkuitasAkhir - summary.totalEkuitasAwal) / summary.totalEkuitasAwal * 100).toFixed(2)
                    : 0
                  }%
                </p>
              </div>
              <div className="text-center p-4 bg-base-200 rounded-lg">
                <p className="text-sm text-base-content/60 mb-2">Status</p>
                <p className={`text-2xl font-bold ${
                  (summary.totalEkuitasAkhir - summary.totalEkuitasAwal) >= 0 ? 'text-success' : 'text-error'
                }`}>
                  {(summary.totalEkuitasAkhir - summary.totalEkuitasAwal) >= 0 ? 'Meningkat ↗' : 'Menurun ↘'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanPerubahanEkuitas;