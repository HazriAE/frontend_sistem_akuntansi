import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { 
  FaMoneyBillWave, FaChartLine, FaWallet, 
  FaBalanceScale, FaPercent 
} from 'react-icons/fa';
import { dashboardService, formatCurrency, formatCurrencyCompact } from '../api/dashboardApi.js';
import {
  processSummaryData,
  processCashFlowData,
  processRevenueExpenseData,
  processAssetComposition,
  processExpenseBreakdown,
  processTopAssets,
  processCashFlowTrend,
  processEquityStructure,
  calculateRatios,
} from '../utils/dashboardUtils.js';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  
  const data = dashboardService.getDashboardData

  const summary = processSummaryData(
    data.neracaSaldo,
    data.labaRugi,
    data.arusKas
  );

  const cashFlowData = processCashFlowData(data.arusKas);
  const revenueExpenseData = processRevenueExpenseData(data.labaRugi);
  const assetComposition = processAssetComposition(data.neracaSaldo);
  const expenseBreakdown = processExpenseBreakdown(data.labaRugi);
  const topAssets = processTopAssets(data.neracaSaldo);
  const cashFlowTrend = processCashFlowTrend(data.arusKas);
  const equityStructure = processEquityStructure(data.perubahanEkuitas);
  const ratios = calculateRatios(data.neracaSaldo, data.labaRugi);

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2">
          Dashboard Keuangan
        </h1>
        <p className="text-base-content/60">
          {data.labaRugi?.namaPerusahaan || 'AZKO Hardware'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <SummaryCard
          icon={<FaWallet />}
          title="Total Kas"
          value={formatCurrencyCompact(summary.totalKas)}
          color="bg-blue-500"
        />
        <SummaryCard
          icon={<FaBalanceScale />}
          title="Total Aset"
          value={formatCurrencyCompact(summary.totalAset)}
          color="bg-green-500"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          title="Liabilitas"
          value={formatCurrencyCompact(summary.totalLiabilitas)}
          color="bg-orange-500"
        />
        <SummaryCard
          icon={<FaChartLine />}
          title="Ekuitas"
          value={formatCurrencyCompact(summary.totalEkuitas)}
          color="bg-purple-500"
        />
        <SummaryCard
          // icon={<FaTrendingUp />}
          title="Laba Bersih"
          value={formatCurrencyCompact(summary.labaBersih)}
          color={summary.labaBersih >= 0 ? 'bg-green-500' : 'bg-red-500'}
        />
        <SummaryCard
          icon={<FaPercent />}
          title="GP Margin"
          value={`${summary.grossProfitMargin.toFixed(2)}%`}
          color="bg-indigo-500"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Cash Flow Trend */}
        <ChartCard title="Tren Kas">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cashFlowTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(val) => formatCurrencyCompact(val)} />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Area 
                type="monotone" 
                dataKey="saldo" 
                stroke="#3b82f6" 
                fill="#3b82f680" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue vs Expense */}
        <ChartCard title="Pendapatan vs Beban">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(val) => formatCurrencyCompact(val)} />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Legend />
              <Bar dataKey="Pendapatan" fill="#10b981" />
              <Bar dataKey="Beban" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Asset Composition */}
        <ChartCard title="Komposisi Aset">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetComposition}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${formatCurrencyCompact(entry.value)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {assetComposition.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Expense Breakdown */}
        <ChartCard title="Breakdown Beban">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={(entry) => entry.name}
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cash Flow by Category */}
        <ChartCard title="Arus Kas per Kategori">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(val) => formatCurrencyCompact(val)} />
              <YAxis type="category" dataKey="name" />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Bar dataKey="value" fill="#8b5cf6">
                {cashFlowData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.value >= 0 ? '#10b981' : '#ef4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Assets */}
        <ChartCard title="Top 5 Aset Terbesar">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topAssets} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(val) => formatCurrencyCompact(val)} />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Equity Structure */}
        <ChartCard title="Struktur Ekuitas">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={equityStructure}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis tickFormatter={(val) => formatCurrencyCompact(val)} />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Legend />
              <Bar dataKey="saldoAwal" fill="#8b5cf6" name="Saldo Awal" />
              <Bar dataKey="saldoAkhir" fill="#ec4899" name="Saldo Akhir" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Financial Ratios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-sm">Current Ratio</h3>
            <p className="text-2xl font-bold text-primary">{ratios.currentRatio}</p>
            <p className="text-xs text-base-content/60">Aset Lancar / Liabilitas Lancar</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-sm">Debt to Equity</h3>
            <p className="text-2xl font-bold text-warning">{ratios.debtToEquity}</p>
            <p className="text-xs text-base-content/60">Total Liabilitas / Total Ekuitas</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-sm">Gross Profit Margin</h3>
            <p className="text-2xl font-bold text-success">
              {data.labaRugi?.labaKotor?.persentase || '0%'}
            </p>
            <p className="text-xs text-base-content/60">Laba Kotor / Penjualan</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-sm">Net Profit Margin</h3>
            <p className="text-2xl font-bold text-error">
              {data.labaRugi?.labaBersih?.persentase || '0%'}
            </p>
            <p className="text-xs text-base-content/60">Laba Bersih / Penjualan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon, title, value, color }) => (
  <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
    <div className="card-body p-4">
      <div className="flex items-center gap-3">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-base-content/60 uppercase">{title}</p>
          <p className="text-lg font-bold truncate">{value}</p>
        </div>
      </div>
    </div>
  </div>
);

// Chart Card Component
const ChartCard = ({ title, children }) => (
  <div className="card bg-base-100 shadow-lg">
    <div className="card-body">
      <h2 className="card-title text-lg mb-4">{title}</h2>
      {children}
    </div>
  </div>
);

export default Dashboard;