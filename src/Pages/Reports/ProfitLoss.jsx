import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

import ReportFilter from './ReportFilter';

const ProfitLoss = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['profit-loss', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const { data } = await api.get(`/laporan/laba-rugi?${params}`);
      return data;
    },
    enabled: !!endDate,
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
        <span>Gagal memuat data laporan</span>
        <button className="btn btn-sm" onClick={() => refetch()}>
          Coba Lagi
        </button>
      </div>
    );
  }

  // Extract data from the response structure
  const data = response?.data || {};
  const pendapatan = data?.pendapatan || [];
  const beban = data?.beban || [];
  const totalPendapatan = data?.totalPendapatan || 0;
  const totalBeban = data?.totalBeban || 0;
  const labaRugi = data?.labaRugi || (totalPendapatan - totalBeban);

  return (
    <div className="space-y-6">

      {/* ===== Reusable Filter Component ===== */}
      <ReportFilter
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        onSubmit={refetch}
        onPrint={() => window.print()}
        onExport={() => alert('Export belum dibuat')}
      />

      {/* ===== Report Header ===== */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold">LAPORAN LABA RUGI</h2>
        <p className="text-sm text-base-content/60 mt-2">
          Periode: {startDate ? new Date(startDate).toLocaleDateString('id-ID') : 'Awal'} 
          {' '}s/d{' '}
          {new Date(endDate).toLocaleDateString('id-ID')}
        </p>
      </div>

      {/* ===== Pendapatan & Beban Tables ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pendapatan */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-bold text-lg mb-4 text-success">PENDAPATAN</h3>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Akun</th>
                      <th className="text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendapatan.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-center py-4 text-base-content/60">
                          Tidak ada data pendapatan
                        </td>
                      </tr>
                    ) : (
                      pendapatan.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="font-mono text-xs text-base-content/60">
                              {item.kodeAkun}
                            </div>
                            <div className="font-medium">{item.namaAkun}</div>
                          </td>
                          <td className="text-right font-mono">
                            Rp {item.jumlah.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="bg-success/10 font-bold">
                    <tr>
                      <td>TOTAL PENDAPATAN</td>
                      <td className="text-right">
                        Rp {totalPendapatan.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Beban */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="font-bold text-lg mb-4 text-error">BEBAN</h3>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Akun</th>
                      <th className="text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beban.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-center py-4 text-base-content/60">
                          Tidak ada data beban
                        </td>
                      </tr>
                    ) : (
                      beban.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="font-mono text-xs text-base-content/60">
                              {item.kodeAkun}
                            </div>
                            <div className="font-medium">{item.namaAkun}</div>
                          </td>
                          <td className="text-right font-mono">
                            Rp {item.jumlah.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="bg-error/10 font-bold">
                    <tr>
                      <td>TOTAL BEBAN</td>
                      <td className="text-right">
                        Rp {totalBeban.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Laba/Rugi Summary */}
        <div className={`card shadow-lg ${labaRugi >= 0 ? 'bg-success text-success-content' : 'bg-error text-error-content'}`}>
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">
                {labaRugi >= 0 ? 'LABA BERSIH' : 'RUGI BERSIH'}
              </h3>
              <div className="text-4xl font-bold">
                Rp {Math.abs(labaRugi).toLocaleString('id-ID')}
              </div>
            </div>
            <div className="divider my-2"></div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="opacity-80">Total Pendapatan</p>
                <p className="font-mono">Rp {totalPendapatan.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="opacity-80">Total Beban</p>
                <p className="font-mono">Rp {totalBeban.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-title">Margin</div>
            <div className="stat-value text-primary">
              {totalPendapatan > 0 ? ((labaRugi / totalPendapatan) * 100).toFixed(2) : 0}%
            </div>
            <div className="stat-desc">
              {labaRugi >= 0 ? 'Profit Margin' : 'Loss Margin'}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Pendapatan Rata-rata</div>
            <div className="stat-value text-success">
              Rp {pendapatan.length > 0 ? (totalPendapatan / pendapatan.length / 1000).toFixed(0) : 0}K
            </div>
            <div className="stat-desc">Per akun pendapatan</div>
          </div>
          <div className="stat">
            <div className="stat-title">Beban Rata-rata</div>
            <div className="stat-value text-error">
              Rp {beban.length > 0 ? (totalBeban / beban.length / 1000).toFixed(0) : 0}K
            </div>
            <div className="stat-desc">Per akun beban</div>
          </div>
        </div>

    </div>
  );
};


export default ProfitLoss;
