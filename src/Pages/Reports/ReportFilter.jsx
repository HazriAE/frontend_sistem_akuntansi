import { MdPrint, MdFileDownload, MdCalendarToday } from "react-icons/md";

const ReportFilter = ({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onSubmit,
  onPrint,
  onExport
}) => {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4">
        <div className="flex flex-wrap gap-4 items-end">

          {/* Start Date */}
          <div className="form-control flex-1 min-w-[200px]">
            <label className="label">
              <span className="label-text font-semibold">Dari Tanggal</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={startDate}
              onChange={(e) => onStartChange(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="form-control flex-1 min-w-[200px]">
            <label className="label">
              <span className="label-text font-semibold">Sampai Tanggal</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={endDate}
              onChange={(e) => onEndChange(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button className="btn btn-primary" onClick={onSubmit}>
            <MdCalendarToday size={20} />
            Tampilkan
          </button>

          {/* Print & Export */}
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={onPrint}>
              <MdPrint size={20} />
              Cetak
            </button>

            <button className="btn btn-outline btn-success" onClick={onExport}>
              <MdFileDownload size={20} />
              Export
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};


export default ReportFilter;
