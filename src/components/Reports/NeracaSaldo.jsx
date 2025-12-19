import { useState } from 'react';
import { MdPrint, MdFileDownload, MdCalendarToday, MdAccountBalance } from 'react-icons/md';
import { FaBalanceScale, FaMoneyBillWave, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

const NeracaSaldo = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['neraca-saldo', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const { data } = await api.get(`/laporan/neraca-saldo?${params}`);
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

  const getBadgeColor = (tipeAkun) => {
    const colors = {
      'aset': 'badge-info',
      'liabilitas': 'badge-warning',
      'ekuitas': 'badge-success',
      'pendapatan': 'badge-primary',
      'beban': 'badge-error'
    };
    return colors[tipeAkun?.toLowerCase()] || 'badge-ghost';
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

  const accounts = data?.akun || [];
  const totalDebit = data?.total?.debit || 0;
  const totalKredit = data?.total?.kredit || 0;
  const isBalanced = Math.abs(totalDebit - totalKredit) < 0.01; // Allow small floating point difference

  // Group accounts by type
  const groupedAccounts = accounts.reduce((acc, account) => {
    const type = account.tipeAkun;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(account);
    return acc;
  }, {});

  const accountOrder = ['aset', 'liabilitas', 'ekuitas', 'pendapatan', 'beban'];

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <FaBalanceScale className="text-4xl" />
              <div>
                <h1 className="card-title text-3xl font-bold">Neraca Saldo</h1>
                <p className="text-sm opacity-80">Trial Balance Report</p>
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
            <h2 className="text-2xl font-bold">NERACA SALDO</h2>
            <p className="text-sm text-base-content/60 mt-2">
              Per Tanggal: {new Date(data?.tanggal || endDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {startDate && (
              <p className="text-sm text-base-content/60">
                Periode: {new Date(startDate).toLocaleDateString('id-ID')} s/d {new Date(endDate).toLocaleDateString('id-ID')}
              </p>
            )}
          </div>
        </div>

        {/* Balance Status Alert */}
        {!isBalanced && (
          <div className="alert alert-warning">
            <FaExclamationTriangle className="text-2xl" />
            <div>
              <h3 className="font-bold">Neraca Tidak Seimbang!</h3>
              <div className="text-sm">
                Selisih: {formatRupiah(Math.abs(totalDebit - totalKredit))}
              </div>
            </div>
          </div>
        )}

        {isBalanced && (
          <div className="alert alert-success">
            <FaCheckCircle className="text-2xl" />
            <div>
              <h3 className="font-bold">Neraca Seimbang</h3>
              <div className="text-sm">Total Debit = Total Kredit</div>
            </div>
          </div>
        )}

        {/* Table by Account Type */}
        {accountOrder.map((type) => {
          const typeAccounts = groupedAccounts[type] || [];
          if (typeAccounts.length === 0) return null;

          const typeDebit = typeAccounts.reduce((sum, acc) => sum + (acc.debit || 0), 0);
          const typeKredit = typeAccounts.reduce((sum, acc) => sum + (acc.kredit || 0), 0);

          return (
            <div key={type} className="card bg-base-100 shadow-sm">
              <div className="card-body p-0">
                {/* Type Header */}
                <div className="bg-base-200 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <BiLineChart className="text-2xl" />
                    <h3 className="font-bold text-lg uppercase">{type}</h3>
                    <div className={`badge ${getBadgeColor(type)} badge-lg`}>
                      {typeAccounts.length} Akun
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-base-content/60">Subtotal</div>
                    <div className="font-bold">
                      Debit: {formatRupiah(typeDebit)} | Kredit: {formatRupiah(typeKredit)}
                    </div>
                  </div>
                </div>

                {/* Accounts Table */}
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr className="bg-base-300">
                        <th className="w-32">Kode Akun</th>
                        <th>Nama Akun</th>
                        <th className="text-right w-48">Debit</th>
                        <th className="text-right w-48">Kredit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {typeAccounts.map((account, idx) => (
                        <tr key={idx} className="hover">
                          <td>
                            <span className="font-mono font-semibold">{account.kodeAkun}</span>
                          </td>
                          <td>
                            <span className="font-medium">{account.namaAkun}</span>
                          </td>
                          <td className="text-right font-mono">
                            {account.debit > 0 ? (
                              <span className="font-semibold text-success">
                                {formatRupiah(account.debit)}
                              </span>
                            ) : (
                              <span className="text-base-content/30">-</span>
                            )}
                          </td>
                          <td className="text-right font-mono">
                            {account.kredit > 0 ? (
                              <span className="font-semibold text-error">
                                {formatRupiah(account.kredit)}
                              </span>
                            ) : (
                              <span className="text-base-content/30">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-base-200 font-bold">
                      <tr>
                        <td colSpan="2" className="text-right">
                          SUBTOTAL {type.toUpperCase()}
                        </td>
                        <td className="text-right text-success">
                          {formatRupiah(typeDebit)}
                        </td>
                        <td className="text-right text-error">
                          {formatRupiah(typeKredit)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          );
        })}

        {/* Grand Total */}
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-primary-content border-primary-content/20">
                    <th className="w-32"></th>
                    <th></th>
                    <th className="text-right w-48">Total Debit</th>
                    <th className="text-right w-48">Total Kredit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-primary-content text-xl font-bold">
                    <td colSpan="2" className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <FaBalanceScale className="text-2xl" />
                        TOTAL NERACA SALDO
                      </div>
                    </td>
                    <td className="text-right">
                      {formatRupiah(totalDebit)}
                    </td>
                    <td className="text-right">
                      {formatRupiah(totalKredit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <MdAccountBalance className="text-3xl" />
            </div>
            <div className="stat-title">Total Akun</div>
            <div className="stat-value text-primary">{accounts.length}</div>
            <div className="stat-desc">Semua tipe akun</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-success">
              <FaMoneyBillWave className="text-3xl" />
            </div>
            <div className="stat-title">Total Debit</div>
            <div className="stat-value text-success">
              {formatRupiah(totalDebit)}
            </div>
            <div className="stat-desc">Aset & Beban</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-error">
              <FaMoneyBillWave className="text-3xl" />
            </div>
            <div className="stat-title">Total Kredit</div>
            <div className="stat-value text-error">
              {formatRupiah(totalKredit)}
            </div>
            <div className="stat-desc">Liabilitas, Ekuitas & Pendapatan</div>
          </div>

          <div className="stat">
            <div className={`stat-figure ${isBalanced ? 'text-success' : 'text-error'}`}>
              {isBalanced ? <FaCheckCircle className="text-3xl" /> : <FaExclamationTriangle className="text-3xl" />}
            </div>
            <div className="stat-title">Status</div>
            <div className={`stat-value ${isBalanced ? 'text-success' : 'text-error'}`}>
              {isBalanced ? 'Balance' : 'Unbalanced'}
            </div>
            <div className="stat-desc">
              {isBalanced ? 'Seimbang sempurna' : `Selisih: ${formatRupiah(Math.abs(totalDebit - totalKredit))}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeracaSaldo;