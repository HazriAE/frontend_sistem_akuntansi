import { MdAdd } from "react-icons/md"
import { useNavigate } from "react-router-dom";
import JournalEntryList from "./JournalEntryList";

const JurnalUmum = () => {
  const navigate = useNavigate();


  return (
    <div>
      JurnalUmum
      <button 
        className="btn btn-info"
        onClick={() => navigate('/journal_entries/new')}
      >
        <MdAdd size={20} />
        Buat Jurnal Umum
      </button>
      <JournalEntryList />
    </div>
  )
}

export default JurnalUmum