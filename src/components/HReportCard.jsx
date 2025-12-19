import { FaBalanceScale } from "react-icons/fa"
import { MdCalendarToday, MdFileDownload, MdPrint } from "react-icons/md"

const HReportCard = ({ title, startDate, endDate, setStartDate, setEndDate, refetch }) => {
  return (
    <div className="card bg-azko-error text-primary-content shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-3 mb-4">
          <FaBalanceScale className="text-4xl" />
          <div>
            <h1 className="card-title text-3xl font-bold">{title}</h1>
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
              className="btn btn-info"
              // onClick={handlePrint}
            >
              <MdPrint size={20} />
              Cetak
            </button>
            <button 
              className="btn btn-success"
              // onClick={handleExport}
            >
              <MdFileDownload size={20} />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HReportCard