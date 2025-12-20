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
      case 'Triwulan-1':
        const year = 2025;

        dari = new Date(year, 0, 2)   // 1 Januari 2025
            .toISOString()
            .split('T')[0];

        sampai = new Date(year, 2, 32) // 31 Maret 2025
            .toISOString()
            .split('T')[0];
        break;
      // case 'this-week':
      //   const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      //   dari = startOfWeek.toISOString().split('T')[0];
      //   sampai = new Date().toISOString().split('T')[0];
      //   break;
      // case 'this-month':
      //   dari = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      //   sampai = new Date().toISOString().split('T')[0];
      //   break;
      // case 'this-year':
      //   dari = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
      //   sampai = new Date().toISOString().split('T')[0];
      //   break;
      // case 'last-month':
      //   const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      //   dari = lastMonth.toISOString().split('T')[0];
      //   sampai = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
      //   break;
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
              onClick={() => handleQuickFilter('Triwulan-1')}
            >
              Triwulan-1
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