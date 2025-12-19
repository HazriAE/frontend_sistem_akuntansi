import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MdDateRange, MdPrint, MdDownload, MdRefresh, MdTrendingUp, MdAssessment } from 'react-icons/md';
import { FiFileText } from 'react-icons/fi';
import api from '../lib/axios';
import LabaRugiMultipleStep from '../components/Reports/LabaRugiMultipleStep'

const LabaRugi = () => {
  // State untuk filter periode
  const [periode, setPeriode] = useState({
    dari: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // 1 Jan tahun ini
    sampai: new Date().toISOString().split('T')[0] // Hari ini
  });

  const [tempPeriode, setTempPeriode] = useState(periode);

  // Fetch data laba rugi
  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['laba-rugi', periode],
    queryFn: async () => {
      const { data } = await api.get('/laporan/laba-rugi-multiple-step', {
        params: {
          dari: periode.dari,
          sampai: periode.sampai
        }
      });
      return data;
    }
  });

  const labaRugiData = response?.data;

  // Handle apply filter
  const handleApplyFilter = () => {
    setPeriode(tempPeriode);
  };

  // Handle reset filter
  const handleResetFilter = () => {
    const defaultPeriode = {
      dari: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      sampai: new Date().toISOString().split('T')[0]
    };
    setTempPeriode(defaultPeriode);
    setPeriode(defaultPeriode);
  };

  // Handle quick filter
  const handleQuickFilter = (type) => {
    const today = new Date();
    let dari, sampai;

    switch (type) {
      case 'today':
        dari = sampai = today.toISOString().split('T')[0];
        break;
      case 'this-week':
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        dari = startOfWeek.toISOString().split('T')[0];
        sampai = new Date().toISOString().split('T')[0];
        break;
      case 'this-month':
        dari = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        sampai = new Date().toISOString().split('T')[0];
        break;
      case 'this-year':
        dari = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        sampai = new Date().toISOString().split('T')[0];
        break;
      case 'last-month':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        dari = lastMonth.toISOString().split('T')[0];
        sampai = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
        break;
      default:
        return;
    }

    const newPeriode = { dari, sampai };
    setTempPeriode(newPeriode);
    setPeriode(newPeriode);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle download PDF (placeholder)
  const handleDownloadPDF = () => {
    alert('Fitur download PDF akan segera tersedia!');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-base-content/60">Memuat laporan laba rugi...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="alert alert-error shadow-lg max-w-2xl mx-auto mt-8">
        <div>
          <MdAssessment size={24} />
          <div>
            <h3 className="font-bold">Gagal Memuat Laporan</h3>
            <div className="text-xs">{error?.response?.data?.message || 'Terjadi kesalahan saat memuat data'}</div>
          </div>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={() => refetch()}>
          <MdRefresh size={18} /> Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
            <MdAssessment className="text-primary" size={36} />
            Laporan Laba Rugi
          </h1>
          <p className="text-base-content/60 mt-1">Multiple Step Income Statement</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 print:hidden">
          <button 
            className="btn btn-outline btn-primary gap-2"
            onClick={() => refetch()}
          >
            <MdRefresh size={18} />
            Refresh
          </button>
          <button 
            className="btn btn-outline gap-2"
            onClick={handlePrint}
          >
            <MdPrint size={18} />
            Print
          </button>
          <button 
            className="btn btn-primary gap-2"
            onClick={handleDownloadPDF}
          >
            <MdDownload size={18} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card bg-base-100 shadow-lg print:hidden">
        <div className="card-body">
          <h3 className="card-title text-lg flex items-center gap-2">
            <MdDateRange className="text-primary" />
            Filter Periode
          </h3>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button 
              className="btn btn-sm btn-ghost"
              onClick={() => handleQuickFilter('today')}
            >
              Hari Ini
            </button>
            <button 
              className="btn btn-sm btn-ghost"
              onClick={() => handleQuickFilter('this-week')}
            >
              Minggu Ini
            </button>
            <button 
              className="btn btn-sm btn-ghost"
              onClick={() => handleQuickFilter('this-month')}
            >
              Bulan Ini
            </button>
            <button 
              className="btn btn-sm btn-ghost"
              onClick={() => handleQuickFilter('this-year')}
            >
              Tahun Ini
            </button>
            <button 
              className="btn btn-sm btn-ghost"
              onClick={() => handleQuickFilter('last-month')}
            >
              Bulan Lalu
            </button>
          </div>

          <div className="divider my-2"></div>

          {/* Custom Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Dari Tanggal</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={tempPeriode.dari}
                onChange={(e) => setTempPeriode({ ...tempPeriode, dari: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Sampai Tanggal</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={tempPeriode.sampai}
                onChange={(e) => setTempPeriode({ ...tempPeriode, sampai: e.target.value })}
              />
            </div>

            <button 
              className="btn btn-primary gap-2"
              onClick={handleApplyFilter}
            >
              <MdDateRange size={18} />
              Terapkan Filter
            </button>

            <button 
              className="btn btn-ghost gap-2"
              onClick={handleResetFilter}
            >
              <MdRefresh size={18} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {labaRugiData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
          {/* Laba Kotor */}
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Laba Kotor</p>
                  <h3 className="text-2xl font-bold text-blue-900">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(labaRugiData.labaKotor)}
                  </h3>
                  <p className="text-xs text-blue-600 mt-1">
                    Margin: {labaRugiData.ratios.grossProfitMargin}%
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <MdTrendingUp className="text-blue-700" size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Laba Operasional */}
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Laba Operasional</p>
                  <h3 className="text-2xl font-bold text-green-900">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(labaRugiData.labaOperasional)}
                  </h3>
                  <p className="text-xs text-green-600 mt-1">
                    Margin: {labaRugiData.ratios.operatingProfitMargin}%
                  </p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <FiFileText className="text-green-700" size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Laba Sebelum Pajak */}
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Laba Sebelum Pajak</p>
                  <h3 className="text-2xl font-bold text-purple-900">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(labaRugiData.labaSebelumPajak)}
                  </h3>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <MdAssessment className="text-purple-700" size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Laba Bersih */}
          <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-primary shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">Laba Bersih</p>
                  <h3 className="text-2xl font-bold text-orange-900">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(labaRugiData.labaBersih)}
                  </h3>
                  <p className="text-xs text-orange-600 mt-1">
                    Margin: {labaRugiData.ratios.netProfitMargin}%
                  </p>
                </div>
                <div className="p-3 bg-primary/20 rounded-xl">
                  <MdTrendingUp className="text-primary" size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Laporan Detail */}
      {labaRugiData ? (
        <LabaRugiMultipleStep data={labaRugiData} />
      ) : (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center py-16">
            <MdAssessment size={64} className="mx-auto text-base-content/20" />
            <h3 className="text-xl font-semibold text-base-content/60 mt-4">
              Tidak ada data laporan
            </h3>
            <p className="text-base-content/40">
              Silakan pilih periode untuk melihat laporan laba rugi
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabaRugi;