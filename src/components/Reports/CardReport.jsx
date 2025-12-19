import { useNavigate } from "react-router-dom"

const CardReport = ({ report }) => {
  const navigate = useNavigate()

  return (
    <div className="card w-full bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{report.title}</h2>
        <p>{report.desc}</p>
        <div className="card-actions justify-end">
          <button 
            className="btn btn-primary"
            onClick={() => {
              navigate(report.path)
            }}
          >Lihat Laporan</button>
        </div>
      </div>
    </div>
  )
}

export default CardReport