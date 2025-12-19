import { useState, Fragment } from 'react';
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaFilter, FaBook, FaMoneyBillWave } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import { MdAccountBalance } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

const BukuBesarTable = () => {
  const [expandedRows, setExpandedRows] = useState({});

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["laporan-buku-besar"],
    queryFn: async () => {
      const { data } = await api.get("/laporan/buku-besar-all");
      return data.data;
    },
  });

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
        <span>Gagal memuat data</span>
        <button className="btn btn-sm" onClick={() => refetch()}>
          Coba Lagi
        </button>
      </div>
    );
  }

  const toggleRow = (id, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <FaBook className="text-4xl" />
              <h1 className="card-title text-3xl font-bold">Buku Besar</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stats shadow bg-base-100 text-base-content">
                <div className="stat p-4">
                  <div className="stat-figure text-primary">
                    <FaCalendarAlt className="text-2xl" />
                  </div>
                  <div className="stat-title text-xs">Periode Dari</div>
                  <div className="stat-value text-lg">{data.periode.dari}</div>
                </div>
              </div>

              <div className="stats shadow bg-base-100 text-base-content">
                <div className="stat p-4">
                  <div className="stat-figure text-secondary">
                    <FaCalendarAlt className="text-2xl" />
                  </div>
                  <div className="stat-title text-xs">Sampai</div>
                  <div className="stat-value text-lg">{data.periode.sampai}</div>
                </div>
              </div>

              <div className="stats shadow bg-base-100 text-base-content">
                <div className="stat p-4">
                  <div className="stat-figure text-accent">
                    <FaFilter className="text-2xl" />
                  </div>
                  <div className="stat-title text-xs">Tipe Akun</div>
                  <div className="stat-value text-lg">{data.filter.tipeAkun}</div>
                </div>
              </div>

              <div className="stats shadow bg-base-100 text-base-content">
                <div className="stat p-4">
                  <div className="stat-figure text-info">
                    <MdAccountBalance className="text-3xl" />
                  </div>
                  <div className="stat-title text-xs">Jumlah Akun</div>
                  <div className="stat-value text-lg">{data.jumlahAkun}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="bg-base-200">
                    <th className="w-12"></th>
                    <th>
                      <div className="flex items-center gap-2">
                        <BiLineChart className="text-lg" />
                        Kode
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center gap-2">
                        <MdAccountBalance className="text-lg" />
                        Nama Akun
                      </div>
                    </th>
                    <th>Tipe</th>
                    <th className="text-right">Saldo Awal</th>
                    <th className="text-right">Total Debit</th>
                    <th className="text-right">Total Kredit</th>
                    <th className="text-right">Mutasi</th>
                    <th className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <FaMoneyBillWave className="text-lg" />
                        Saldo Akhir
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.akun && data.akun.length > 0 ? (
                    data.akun.map((item) => {
                      const rowId = item.akun.id;
                      const hasTransactions = item.transaksi && item.transaksi.length > 0;
                      
                      return (
                        <Fragment key={rowId}>
                          {/* Main Row */}
                          <tr className="hover">
                            <td>
                              {hasTransactions ? (
                                <button 
                                  className="btn btn-ghost btn-xs btn-circle"
                                  onClick={(e) => toggleRow(rowId, e)}
                                >
                                  {expandedRows[rowId] ? (
                                    <FaChevronUp className="text-lg" />
                                  ) : (
                                    <FaChevronDown className="text-lg" />
                                  )}
                                </button>
                              ) : (
                                <span className="text-base-content/30">-</span>
                              )}
                            </td>
                            <td>
                              <span className="font-mono font-semibold">{item.akun.kodeAkun}</span>
                            </td>
                            <td>
                              <span className="font-medium">{item.akun.namaAkun}</span>
                            </td>
                            <td>
                              <div className={`badge ${getBadgeColor(item.akun.tipeAkun)} badge-md`}>
                                {item.akun.tipeAkun}
                              </div>
                            </td>
                            <td className="text-right font-medium">{formatRupiah(item.akun.saldoAwal)}</td>
                            <td className="text-right font-medium text-success">{formatRupiah(item.totalDebit)}</td>
                            <td className="text-right font-medium text-error">{formatRupiah(item.totalKredit)}</td>
                            <td className="text-right font-medium">
                              <span className={item.mutasi >= 0 ? 'text-success' : 'text-error'}>
                                {formatRupiah(item.mutasi)}
                              </span>
                            </td>
                            <td className="text-right">
                              <span className="font-bold text-lg">{formatRupiah(item.saldoAkhir)}</span>
                            </td>
                          </tr>

                          {/* Expanded Detail */}
                          {expandedRows[rowId] && hasTransactions && (
                            <tr>
                              <td colSpan="9" className="bg-base-200 p-0">
                                <div className="collapse collapse-open">
                                  <div className="collapse-content">
                                    <div className="p-4">
                                      <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                          <BiLineChart className="text-xl text-primary" />
                                          <h4 className="font-bold text-lg">Detail Transaksi - {item.akun.namaAkun}</h4>
                                        </div>
                                        <div className="badge badge-lg badge-primary">
                                          {item.jumlahTransaksi} Transaksi
                                        </div>
                                      </div>
                                      
                                      <div className="overflow-x-auto">
                                        <table className="table table-sm">
                                          <thead>
                                            <tr className="bg-base-300">
                                              <th>Tanggal</th>
                                              <th>No. Jurnal</th>
                                              <th>Deskripsi</th>
                                              <th>Keterangan</th>
                                              <th className="text-right">Debit</th>
                                              <th className="text-right">Kredit</th>
                                              <th className="text-right">Saldo</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {/* Saldo Awal Row */}
                                            <tr className="bg-base-200 font-semibold">
                                              <td colSpan="4">SALDO AWAL</td>
                                              <td className="text-right">-</td>
                                              <td className="text-right">-</td>
                                              <td className="text-right">{formatRupiah(item.akun.saldoAwal)}</td>
                                            </tr>
                                            
                                            {/* Transaction Rows */}
                                            {item.transaksi.map((trx, idx) => (
                                              <tr key={idx} className="hover">
                                                <td>
                                                  <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-primary text-sm" />
                                                    <span className="font-mono text-sm">
                                                      {new Date(trx.tanggal).toLocaleDateString('id-ID')}
                                                    </span>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="font-mono text-sm">{trx.nomorJurnal}</span>
                                                </td>
                                                <td className="max-w-xs">
                                                  <p className="truncate">{trx.deskripsi}</p>
                                                </td>
                                                <td className="max-w-xs">
                                                  <p className="truncate text-sm text-base-content/60">
                                                    {trx.keterangan || '-'}
                                                  </p>
                                                </td>
                                                <td className="text-right">
                                                  {trx.debit > 0 ? (
                                                    <span className="font-semibold text-success">
                                                      {formatRupiah(trx.debit)}
                                                    </span>
                                                  ) : (
                                                    <span className="text-base-content/40">-</span>
                                                  )}
                                                </td>
                                                <td className="text-right">
                                                  {trx.kredit > 0 ? (
                                                    <span className="font-semibold text-error">
                                                      {formatRupiah(trx.kredit)}
                                                    </span>
                                                  ) : (
                                                    <span className="text-base-content/40">-</span>
                                                  )}
                                                </td>
                                                <td className="text-right">
                                                  <span className="font-bold badge badge-outline badge-lg">
                                                    {formatRupiah(trx.saldo)}
                                                  </span>
                                                </td>
                                              </tr>
                                            ))}

                                            {/* Saldo Akhir Row */}
                                            <tr className="bg-primary text-primary-content font-bold">
                                              <td colSpan="4">SALDO AKHIR</td>
                                              <td className="text-right">{formatRupiah(item.totalDebit)}</td>
                                              <td className="text-right">{formatRupiah(item.totalKredit)}</td>
                                              <td className="text-right">{formatRupiah(item.saldoAkhir)}</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-8 text-base-content/60">
                        Tidak ada data akun
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <MdAccountBalance className="text-3xl" />
            </div>
            <div className="stat-title">Total Akun</div>
            <div className="stat-value text-primary">{data.jumlahAkun}</div>
            <div className="stat-desc">Aktif dalam periode ini</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-success">
              <FaMoneyBillWave className="text-3xl" />
            </div>
            <div className="stat-title">Total Debit</div>
            <div className="stat-value text-success">
              {formatRupiah(data.akun?.reduce((sum, item) => sum + (item.totalDebit || 0), 0) || 0)}
            </div>
            <div className="stat-desc">Semua akun</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-error">
              <FaMoneyBillWave className="text-3xl" />
            </div>
            <div className="stat-title">Total Kredit</div>
            <div className="stat-value text-error">
              {formatRupiah(data.akun?.reduce((sum, item) => sum + (item.totalKredit || 0), 0) || 0)}
            </div>
            <div className="stat-desc">Semua akun</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-info">
              <BiLineChart className="text-3xl" />
            </div>
            <div className="stat-title">Total Transaksi</div>
            <div className="stat-value text-info">
              {data.akun?.reduce((sum, item) => sum + (item.jumlahTransaksi || 0), 0) || 0}
            </div>
            <div className="stat-desc">Semua jurnal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BukuBesarTable;