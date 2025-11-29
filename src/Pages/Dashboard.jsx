const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-base-content mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">1,234</div>
            <div className="stat-desc">↗︎ 12% (30 days)</div>
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Active Suppliers</div>
            <div className="stat-value text-secondary">456</div>
            <div className="stat-desc">↗︎ 8% (30 days)</div>
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Transactions</div>
            <div className="stat-value text-accent">789</div>
            <div className="stat-desc">↘︎ 3% (30 days)</div>
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Revenue</div>
            <div className="stat-value text-success">$12.5K</div>
            <div className="stat-desc">↗︎ 15% (30 days)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Activities</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content">
                  👤
                </div>
                <div className="flex-1">
                  <p className="font-medium">New customer registered</p>
                  <p className="text-sm text-base-content/60">5 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn btn-primary">Add Customer</button>
              <button className="btn btn-secondary">Add Supplier</button>
              <button className="btn btn-accent">New Transaction</button>
              <button className="btn btn-info">View Reports</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;