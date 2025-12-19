import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdExpandMore, MdExpandLess, MdEdit, MdDelete, MdCheckCircle, MdCancel, MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

const JournalEntryList = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const [filterStatus, setFilterStatus] = useState('posted');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['journals', filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const { data } = await api.get(`/jurnal?${params}`);
      return data;
    }
  });

  const journals = response?.data ? [...response.data].sort((a, b) => a.tanggal - b.tanggal) : [];

  const postMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.post(`/jurnal/${id}/post`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['journals']);
      alert('Jurnal berhasil di-post!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Gagal memposting jurnal');
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
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Gagal void jurnal');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/jurnal/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['journals']);
      alert('Jurnal berhasil dihapus!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Gagal menghapus jurnal');
    }
  });

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleEdit = (id) => {
    navigate(`/journal_entries/${id}/edit`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus jurnal ini? Data yang sudah dihapus tidak bisa dikembalikan.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleVoid = (id) => {
    const alasan = prompt('Alasan void jurnal:');
    if (alasan) {
      voidMutation.mutate({ id, alasan });
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>Gagal memuat data jurnal</span>
        <button className="btn btn-sm" onClick={() => refetch()}>
          Coba Lagi
        </button>
      </div>
    );
  }

  // Statistics
  const stats = {
    total: journals.length,
    draft: journals.filter(j => j.status === 'draft').length,
    posted: journals.filter(j => j.status === 'posted').length,
    void: journals.filter(j => j.status === 'void').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Jurnal Entries</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/journal_entries/new')}
        >
          <MdAdd size={20} />
          Buat Jurnal Baru
        </button>
      </div>

      {/* Statistics */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Jurnal</div>
          <div className="stat-value text-primary">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Draft</div>
          <div className="stat-value text-warning">{stats.draft}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Posted</div>
          <div className="stat-value text-success">{stats.posted}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Void</div>
          <div className="stat-value text-error">{stats.void}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <div className="flex gap-4">
            <select
              className="select select-bordered"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="posted">Posted</option>
              <option value="void">Void</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200">
                <tr>
                  <th className="w-12"></th>
                  <th>No Jurnal</th>
                  <th>Tanggal</th>
                  <th>Deskripsi</th>
                  <th>Jenis</th>
                  <th className="text-right">Total Debit</th>
                  <th className="text-right">Total Kredit</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {journals.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-8 text-base-content/60">
                      Tidak ada data jurnal
                    </td>
                  </tr>
                ) : (
                  journals.map((journal) => (
                    <>
                      {/* Main Row */}
                      <tr key={journal._id} className="hover">
                        <td>
                          <button
                            className="btn btn-ghost btn-xs btn-circle"
                            onClick={() => toggleRow(journal._id)}
                          >
                            {expandedRows[journal._id] ? (
                              <MdExpandLess size={20} />
                            ) : (
                              <MdExpandMore size={20} />
                            )}
                          </button>
                        </td>
                        <td className="font-mono font-semibold">{journal.nomorJurnal}</td>
                        <td>{new Date(journal.tanggal).toLocaleDateString('id-ID')}</td>
                        <td className="max-w-xs">
                          <div className="truncate">{journal.deskripsi}</div>
                        </td>
                        <td>
                          <span className="badge badge-ghost capitalize">
                            {journal.jenisTransaksi}
                          </span>
                        </td>
                        <td className="text-right font-mono text-success">
                          {formatRupiah(journal.totalDebit)}
                        </td>
                        <td className="text-right font-mono text-error">
                          {formatRupiah(journal.totalKredit)}
                        </td>
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
                          <div className="flex gap-2 justify-center">
                            {journal.status === 'draft' && (
                              <>
                                <button 
                                  className="btn btn-sm btn-success gap-1"
                                  onClick={() => postMutation.mutate(journal._id)}
                                  disabled={postMutation.isPending}
                                >
                                  <MdCheckCircle size={16} />
                                  Post
                                </button>
                                <button 
                                  className="btn btn-sm btn-ghost"
                                  onClick={() => handleEdit(journal._id)}
                                >
                                  <MdEdit size={16} />
                                </button>
                                <button 
                                  className="btn btn-sm btn-ghost text-error"
                                  onClick={() => handleDelete(journal._id)}
                                >
                                  <MdDelete size={16} />
                                </button>
                              </>
                            )}
                            {journal.status === 'posted' && (
                              <button 
                                className="btn btn-sm btn-error gap-1"
                                onClick={() => handleVoid(journal._id)}
                                disabled={voidMutation.isPending}
                              >
                                <MdCancel size={16} />
                                Void
                              </button>
                            )}
                            {journal.status === 'void' && (
                              <span className="text-sm text-base-content/60">
                                No actions
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Detail Row */}
                      {expandedRows[journal._id] && (
                        <tr>
                          <td colSpan="9" className="bg-base-200 p-0">
                            <div className="p-6">
                              <h4 className="font-bold text-lg mb-4">Detail Transaksi</h4>
                              
                              <div className="overflow-x-auto">
                                <table className="table table-sm">
                                  <thead>
                                    <tr className="bg-base-300">
                                      <th>Kode Akun</th>
                                      <th>Nama Akun</th>
                                      <th>Keterangan</th>
                                      <th className="text-right">Debit</th>
                                      <th className="text-right">Kredit</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {journal.items && journal.items.map((item, idx) => (
                                      <tr key={idx}>
                                        <td className="font-mono text-sm">{item.kodeAkun}</td>
                                        <td>{item.namaAkun}</td>
                                        <td className="text-sm text-base-content/60">
                                          {item.keterangan || '-'}
                                        </td>
                                        <td className="text-right font-mono">
                                          {item.debit > 0 ? (
                                            <span className="text-success font-semibold">
                                              {formatRupiah(item.debit)}
                                            </span>
                                          ) : (
                                            <span className="text-base-content/30">-</span>
                                          )}
                                        </td>
                                        <td className="text-right font-mono">
                                          {item.kredit > 0 ? (
                                            <span className="text-error font-semibold">
                                              {formatRupiah(item.kredit)}
                                            </span>
                                          ) : (
                                            <span className="text-base-content/30">-</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot className="bg-base-300 font-bold">
                                    <tr>
                                      <td colSpan="3" className="text-right">TOTAL</td>
                                      <td className="text-right text-success">
                                        {formatRupiah(journal.totalDebit)}
                                      </td>
                                      <td className="text-right text-error">
                                        {formatRupiah(journal.totalKredit)}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>

                              {/* Additional Info */}
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-base-content/60">Dibuat Oleh</p>
                                  <p className="font-semibold">{journal.dibuatOleh || 'System'}</p>
                                </div>
                                {journal.status === 'posted' && journal.postedAt && (
                                  <div>
                                    <p className="text-sm text-base-content/60">Posted At</p>
                                    <p className="font-semibold">
                                      {new Date(journal.postedAt).toLocaleString('id-ID')}
                                    </p>
                                  </div>
                                )}
                                {journal.status === 'void' && journal.voidReason && (
                                  <div className="md:col-span-2">
                                    <p className="text-sm text-base-content/60">Alasan Void</p>
                                    <p className="font-semibold text-error">{journal.voidReason}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryList;