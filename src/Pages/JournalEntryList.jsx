import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import api from "../lib/axios";

const JournalEntryList = () => {
  const { data: journals } = useQuery({
    queryKey: ['journals'],
    queryFn: async () => {
      const { data } = await api.get('/jurnal');
      return data.data;
    }
  });

  const postMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.post(`/jurnal/${id}/post`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['journals']);
      alert('Jurnal berhasil di-post!');
    }
  });

  const voidMutation = useMutation({
    mutationFn: async ({ id, alasan }) => {
      const { data } = await api.post(`/jurnal/${id}/void`, { alasan });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['journals']);
      alert('Jurnal berhasil di-void!');
    }
  });

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>No Jurnal</th>
            <th>Tanggal</th>
            <th>Deskripsi</th>
            <th>Total</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {journals?.map((journal) => (
            <tr key={journal._id}>
              <td>{journal.nomorJurnal}</td>
              <td>{new Date(journal.tanggal).toLocaleDateString('id-ID')}</td>
              <td>{journal.deskripsi}</td>
              <td>Rp {journal.totalDebit.toLocaleString('id-ID')}</td>
              <td>
                <span className={`badge ${
                  journal.status === 'draft' ? 'badge-warning' :
                  journal.status === 'posted' ? 'badge-success' :
                  'badge-error'
                }`}>
                  {journal.status}
                </span>
              </td>
              <td>
                {journal.status === 'draft' && (
                  <>
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => postMutation.mutate(journal._id)}
                    >
                      Post
                    </button>
                    <button className="btn btn-sm btn-ghost">Edit</button>
                  </>
                )}
                {journal.status === 'posted' && (
                  <button 
                    className="btn btn-sm btn-error"
                    onClick={() => {
                      const alasan = prompt('Alasan void:');
                      if (alasan) {
                        voidMutation.mutate({ id: journal._id, alasan });
                      }
                    }}
                  >
                    Void
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JournalEntryList