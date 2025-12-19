const LabaRugiMultipleStep = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-primary">
          <h1 className="text-3xl md:text-4xl font-bold text-base-content">{data.namaPerusahaan}</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-primary mt-2">{data.jenisLaporan}</h2>
          <p className="text-sm text-base-content/60 mt-1">{data.metode}</p>
          <p className="text-base-content/60 mt-2">
            Periode {formatDate(data.periode.dari)} s/d {formatDate(data.periode.sampai)}
          </p>
        </div>

        {/* Section 1: Penjualan */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-primary mb-4 uppercase flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded"></div>
            Penjualan
          </h3>
          
          <div className="ml-4 space-y-2">
            <div className="flex justify-between py-2 hover:bg-base-200 px-2 rounded transition-colors">
              <span className="text-base-content">Penjualan Bersih</span>
              <span className="font-semibold text-base-content">{formatCurrency(data.penjualan.penjualanBersih)}</span>
            </div>
            
            {data.penjualan.penjualanKonsinyasi > 0 && (
              <div className="flex justify-between py-2 hover:bg-base-200 px-2 rounded transition-colors">
                <span className="text-base-content">Penjualan Konsinyasi</span>
                <span className="font-semibold text-base-content">{formatCurrency(data.penjualan.penjualanKonsinyasi)}</span>
              </div>
            )}
            
            <div className="divider my-2"></div>
            <div className="flex justify-between py-3 font-bold text-lg bg-blue-50 px-3 rounded-lg">
              <span className="text-base-content">Total Penjualan</span>
              <span className="text-info">{formatCurrency(data.penjualan.totalPenjualan)}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Beban Pokok Penjualan */}
        <div className="mb-6">
          <div className="flex justify-between py-3 font-bold text-error bg-error/10 px-3 rounded-lg">
            <span>Beban Pokok Penjualan</span>
            <span>({formatCurrency(data.bebanPokokPenjualan.total)})</span>
          </div>
        </div>

        {/* Section 3: Laba Kotor */}
        <div className="mb-6 border-y-4 border-info py-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 gap-2">
            <span className="text-xl md:text-2xl font-bold text-blue-900">LABA KOTOR</span>
            <div className="text-right">
              <span className="text-2xl md:text-3xl font-bold text-info">
                {formatCurrency(data.labaKotor.jumlah)}
              </span>
              <div className="text-sm text-base-content/60 mt-1">
                Margin: {data.labaKotor.persentase}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Beban Usaha */}
        <div className="mb-6">
          <div className="flex justify-between py-3 font-bold text-error bg-error/10 px-3 rounded-lg">
            <span>Beban Usaha</span>
            <span>({formatCurrency(data.bebanUsaha.total)})</span>
          </div>
        </div>

        {/* Section 5: Laba Usaha */}
        <div className="mb-6 border-y-4 border-success py-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 gap-2">
            <span className="text-xl md:text-2xl font-bold text-green-900">LABA USAHA</span>
            <div className="text-right">
              <span className="text-2xl md:text-3xl font-bold text-success">
                {formatCurrency(data.labaUsaha.jumlah)}
              </span>
              <div className="text-sm text-base-content/60 mt-1">
                Margin: {data.labaUsaha.persentase}
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Pendapatan/Beban Lain */}
        {(data.pendapatanLain.total > 0 || data.bebanLain.total > 0 || data.bebanKeuangan.total > 0) && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-primary mb-4 uppercase flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded"></div>
              Pendapatan dan Beban Lain-lain
            </h3>
            
            <div className="ml-4 space-y-2">
              {data.pendapatanLain.total > 0 && (
                <div className="flex justify-between py-2 text-success hover:bg-base-200 px-2 rounded transition-colors">
                  <span>Pendapatan Lain-lain</span>
                  <span>{formatCurrency(data.pendapatanLain.total)}</span>
                </div>
              )}
              
              {data.bebanLain.total > 0 && (
                <div className="flex justify-between py-2 text-error hover:bg-base-200 px-2 rounded transition-colors">
                  <span>Beban Lain-lain</span>
                  <span>({formatCurrency(data.bebanLain.total)})</span>
                </div>
              )}

              {data.bebanKeuangan.total > 0 && (
                <div className="flex justify-between py-2 text-error hover:bg-base-200 px-2 rounded transition-colors">
                  <span>Beban Keuangan - Bersih</span>
                  <span>({formatCurrency(data.bebanKeuangan.total)})</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 7: Laba Sebelum Pajak */}
        <div className="mb-6 border-y-2 border-base-300 py-4 bg-base-200 rounded-lg px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <span className="text-lg font-bold text-base-content">LABA SEBELUM PAJAK</span>
            <div className="text-right">
              <span className="text-xl font-bold text-base-content">
                {formatCurrency(data.labaSebelumPajak.jumlah)}
              </span>
              <div className="text-sm text-base-content/60 mt-1">
                Margin: {data.labaSebelumPajak.persentase}
              </div>
            </div>
          </div>
        </div>

        {/* Section 8: Pajak */}
        {data.bebanPajak.total > 0 && (
          <div className="mb-6">
            <div className="flex justify-between py-3 font-bold text-error bg-error/10 px-3 rounded-lg">
              <span>Beban Pajak Penghasilan</span>
              <span>({formatCurrency(data.bebanPajak.total)})</span>
            </div>
          </div>
        )}

        {/* Section 9: Laba Bersih */}
        <div className="border-t-4 border-primary pt-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-6 rounded-xl shadow-lg gap-4">
            <span className="text-2xl md:text-3xl font-bold text-primary">LABA BERSIH</span>
            <div className="text-right">
              <span className="text-3xl md:text-4xl font-bold text-success">
                {formatCurrency(data.labaBersih.jumlah)}
              </span>
              <div className="text-sm text-base-content/60 mt-2">
                Net Profit Margin: <span className="font-bold">{data.labaBersih.persentase}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Box */}
        <div className="mb-6 bg-base-200 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded"></div>
            Ringkasan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between py-2 border-b border-base-300">
              <span className="text-base-content/70">Penjualan Bersih</span>
              <span className="font-semibold">{formatCurrency(data.summary.penjualanBersih)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-base-300">
              <span className="text-base-content/70">Beban Pokok Penjualan</span>
              <span className="font-semibold text-error">({formatCurrency(data.summary.bebanPokokPenjualan)})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-base-300">
              <span className="text-base-content/70">Laba Kotor</span>
              <span className="font-semibold text-info">{formatCurrency(data.summary.labaKotor)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-base-300">
              <span className="text-base-content/70">Beban Usaha</span>
              <span className="font-semibold text-error">({formatCurrency(data.summary.bebanUsaha)})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-base-300">
              <span className="text-base-content/70">Laba Usaha</span>
              <span className="font-semibold text-success">{formatCurrency(data.summary.labaUsaha)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-base-300">
              <span className="text-base-content/70">Laba Sebelum Pajak</span>
              <span className="font-semibold">{formatCurrency(data.summary.labaSebelumPajak)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-base-300">
              <span className="text-base-content/70">Beban Pajak</span>
              <span className="font-semibold text-error">({formatCurrency(data.summary.bebanPajak)})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-base-300">
              <span className="text-base-content/70">Laba Bersih</span>
              <span className="font-bold text-success">{formatCurrency(data.summary.labaBersih)}</span>
            </div>
          </div>
        </div>

        {/* Analisis Rasio */}
        <div className="mt-8 bg-gradient-to-r from-base-200 to-base-300 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded"></div>
            Analisis Rasio Profitabilitas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-base-100 rounded-xl shadow hover:shadow-lg transition-shadow">
              <p className="text-sm text-base-content/60 font-medium mb-2">Gross Profit Margin</p>
              <p className="text-3xl font-bold text-info">{data.ratios.grossProfitMargin}</p>
              <div className="mt-2">
                <progress 
                  className="progress progress-info w-full" 
                  value={parseFloat(data.ratios.grossProfitMargin)} 
                  max="100"
                ></progress>
              </div>
            </div>
            <div className="text-center p-4 bg-base-100 rounded-xl shadow hover:shadow-lg transition-shadow">
              <p className="text-sm text-base-content/60 font-medium mb-2">Operating Margin</p>
              <p className="text-3xl font-bold text-success">{data.ratios.operatingProfitMargin}</p>
              <div className="mt-2">
                <progress 
                  className="progress progress-success w-full" 
                  value={parseFloat(data.ratios.operatingProfitMargin)} 
                  max="100"
                ></progress>
              </div>
            </div>
            <div className="text-center p-4 bg-base-100 rounded-xl shadow hover:shadow-lg transition-shadow">
              <p className="text-sm text-base-content/60 font-medium mb-2">Net Profit Margin</p>
              <p className="text-3xl font-bold text-primary">{data.ratios.netProfitMargin}</p>
              <div className="mt-2">
                <progress 
                  className="progress progress-primary w-full" 
                  value={parseFloat(data.ratios.netProfitMargin)} 
                  max="100"
                ></progress>
              </div>
            </div>
            <div className="text-center p-4 bg-base-100 rounded-xl shadow hover:shadow-lg transition-shadow">
              <p className="text-sm text-base-content/60 font-medium mb-2">Tax Rate</p>
              <p className="text-3xl font-bold text-warning">{data.ratios.taxRate}</p>
              <div className="mt-2">
                <progress 
                  className="progress progress-warning w-full" 
                  value={parseFloat(data.ratios.taxRate)} 
                  max="100"
                ></progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabaRugiMultipleStep;