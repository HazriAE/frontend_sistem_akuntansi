import { MdAdd } from "react-icons/md"
import Card from "../components/utils/Card"

const Customer = () => {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-base-content mb-6">Customer</h1>
        <button 
          className="btn btn-primary"
          onClick={() => null}
        >
          <MdAdd size={20} />
          Buat Akun Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        
        <div className="stats shadow bg-base-100">
          <Card item={{ title: "Total Customer", count: 10}} />
        </div>

      </div>
    </div>
  )
}

export default Customer