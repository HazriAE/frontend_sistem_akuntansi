
const Customer = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-base-content mb-6">Customer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Total Customer</div>
            <div className="stat-value text-primary">5</div>
            <div className="stat-desc">↗︎ 12% (30 days)</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Customer