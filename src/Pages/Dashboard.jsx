const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-base-content mb-6">Dashboard</h1>
      
      {/* BAGIAN 1: STATS KARTU (STATISTICS CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Users */}
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">1,234</div>
            <div className="stat-desc">↗︎ 12% (30 days)</div>
          </div>
        </div>

        {/* Active Suppliers */}
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Active Suppliers</div>
            <div className="stat-value text-secondary">456</div>
            <div className="stat-desc">↗︎ 8% (30 days)</div>
          </div>
        </div>

        {/* Transactions */}
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Transactions</div>
            <div className="stat-value text-accent">789</div>
            <div className="stat-desc">↘︎ 3% (30 days)</div>
          </div>
        </div>

        {/* Revenue */}
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Revenue</div>
            <div className="stat-value text-success">$12.5K</div>
            <div className="stat-desc">↗︎ 15% (30 days)</div>
          </div>
        </div>
      </div>
      
      {/* BAGIAN 2: PERINGATAN (ALERTS) & QUICK ACTIONS BARU */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Widget Peringatan Penting (Menggunakan 2/3 lebar di layar besar) */}
        <div className="lg:col-span-2 card bg-warning shadow-xl">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-warning-content text-xl">⚠️ Peringatan Penting (Action Required)</h2>
            <div className="space-y-2 text-warning-content">
              <div className="flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="flex-1">
                  **Faktur INV-2030** dari Supplier A akan **JATUH TEMPO HARI INI**. Jumlah: $950.00.
                </p>
                <button className="btn btn-sm btn-warning btn-outline">Bayar</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions (Menggunakan 1/3 lebar di layar besar) */}
        <div className="lg:col-span-1 card bg-base-100 shadow-xl">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-lg">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn btn-sm btn-primary">Add Customer</button>
              <button className="btn btn-sm btn-secondary">Add Supplier</button>
              <button className="btn btn-sm btn-accent">New Transaction</button>
              <button className="btn btn-sm btn-info">View Reports</button>
            </div>
          </div>
        </div>
      </div>


      {/* BAGIAN 3: RECENT ACTIVITIES (TIMELINE) */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        
        {/* Recent Activities (Timeline) */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🗓️ Recent Activities</h2>
            
            {/* Implementasi Timeline */}
            <ul className="timeline timeline-vertical">
              
              {/* Aktivitas 1: New Customer (Success) */}
              <li>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-3 6h6m-6-6h-6m6 0a6 6 0 100-12m6 12a6 6 0 100-12" /></svg>
                </div>
                <div className="timeline-end timeline-box bg-base-200 p-3 shadow-md">
                  <time className="font-mono italic text-sm text-success">5 Menit Lalu</time>
                  <div className="text-lg font-bold">Pelanggan Baru Terdaftar</div>
                  <p className="text-sm">Akun **PT. Makmur Sejahtera** berhasil dibuat. <a href="/customer/450" className="link link-hover text-success">Lihat Detail</a></p>
                </div>
                <hr className="bg-success"/>
              </li>

              {/* Aktivitas 2: Payment Received (Info) */}
              <li>
                <hr className="bg-info"/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <div className="timeline-start timeline-box bg-base-200 p-3 shadow-md">
                  <time className="font-mono italic text-sm text-info">1 Jam Lalu</time>
                  <div className="text-lg font-bold">Pembayaran Diterima</div>
                  <p className="text-sm">Pembayaran **$450.00** untuk Faktur **INV-9003** dari ABC Corp. <a href="/invoice/9003" className="link link-hover text-info">Lihat Faktur</a></p>
                </div>
                <hr className="bg-warning"/>
              </li>
              
              {/* Aktivitas 3: New Vendor Bill (Warning) */}
              <li>
                <hr className="bg-warning"/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2-4V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2z" /></svg>
                </div>
                <div className="timeline-end timeline-box bg-base-200 p-3 shadow-md">
                  <time className="font-mono italic text-sm text-warning">Kemarin</time>
                  <div className="text-lg font-bold">Tagihan Pemasok Baru</div>
                  <p className="text-sm">Tagihan **#BLL-45** dari CV. Mitra Jaya telah dimasukkan. Jumlah **$1,200.00**. <a href="/bill/45" className="link link-hover text-warning">Bayar Sekarang</a></p>
                </div>
                <hr className="bg-base-300"/>
              </li>

              {/* Aktivitas 4: Inventory Update (Default) */}
              <li>
                <hr className="bg-base-300"/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m4 4v10m8-10v10m0 0l-4-2m4 2l4-2" /></svg>
                </div>
                <div className="timeline-start timeline-box bg-base-200 p-3 shadow-md">
                  <time className="font-mono italic text-sm">2 Hari Lalu</time>
                  <div className="text-lg font-bold">Update Stok Inventaris</div>
                  <p className="text-sm">Stok Produk **Buku Kas 001** disesuaikan. Perubahan: +50 unit.</p>
                </div>
              </li>

            </ul>
            
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-sm btn-outline">Lihat Semua Aktivitas</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;