import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdAdd, MdPeople, MdLocalShipping, MdSearch, MdEdit, MdDelete, MdArrowBack, MdHistory } from 'react-icons/md';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../lib/axios';
import PageWithTabs from '../components/PageWithTabs';

// Validation Schema
const validationSchema = Yup.object({
  nama: Yup.string().required('Nama wajib diisi').min(3, 'Nama minimal 3 karakter'),
  email: Yup.string().email('Email tidak valid'),
  telepon: Yup.string().required('Telepon wajib diisi'),
  alamat: Yup.string(),
  tipe: Yup.string().required('Tipe wajib dipilih').oneOf(['customer', 'supplier', 'both']),
  aktif: Yup.boolean()
});

const Contacts = () => {
  const [activeTab, setActiveTab] = useState('customer'); // customer | supplier
  const [mode, setMode] = useState('list'); // list | add | edit | detail
  const [selectedContact, setSelectedContact] = useState(null);
  const [search, setSearch] = useState('');
  const [filterAktif, setFilterAktif] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch contacts based on active tab
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['kontak', activeTab, filterAktif, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('tipe', activeTab);
      if (filterAktif) params.append('aktif', filterAktif);
      if (search) params.append('search', search);
      
      const { data } = await api.get(`/kontak?${params}`);
      return data;
    }
  });

  // Fetch contact detail with transactions
  const { data: detailResponse } = useQuery({
    queryKey: ['kontak-detail', selectedContact?._id],
    queryFn: async () => {
      const { data } = await api.get(`/kontak/${selectedContact._id}/transactions`);
      return data;
    },
    enabled: mode === 'detail' && !!selectedContact?._id
  });

  const contacts = response?.data || [];
  const contactDetail = detailResponse?.data;

  // Statistics
  const active = contacts.filter(c => c.aktif === true).length;
  const inactive = contacts.filter(c => c.aktif === false).length;
  const totalContacts = contacts.length;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (values) => {
      const { data } = await api.post('/kontak', values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['kontak']);
      setMode('list');
      formik.resetForm();
      alert('Kontak berhasil ditambahkan!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Gagal menambahkan kontak');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, values }) => {
      const { data } = await api.put(`/kontak/${id}`, values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['kontak']);
      setMode('list');
      setSelectedContact(null);
      formik.resetForm();
      alert('Kontak berhasil diupdate!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Gagal mengupdate kontak');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/kontak/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['kontak']);
      alert('Kontak berhasil dihapus!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Gagal menghapus kontak');
    }
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      kode: '',
      nama: '',
      email: '',
      telepon: '',
      alamat: '',
      tipe: activeTab,
      aktif: true
    },
    validationSchema,
    onSubmit: (values) => {
      if (mode === 'edit' && selectedContact) {
        updateMutation.mutate({ id: selectedContact._id, values });
      } else {
        createMutation.mutate(values);
      }
    }
  });

  const handleEdit = (contact) => {
    setMode('edit');
    setSelectedContact(contact);
    formik.setValues({
      kode: contact.kode || '',
      nama: contact.nama,
      email: contact.email || '',
      telepon: contact.telepon,
      alamat: contact.alamat || '',
      tipe: contact.tipe,
      aktif: contact.aktif
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus kontak ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewDetail = (contact) => {
    setSelectedContact(contact);
    setMode('detail');
  };

  const handleBack = () => {
    setMode('list');
    setSelectedContact(null);
    formik.resetForm();
  };

  const handleAddNew = () => {
    setMode('add');
    formik.setValues({
      kode: '',
      nama: '',
      email: '',
      telepon: '',
      alamat: '',
      tipe: activeTab,
      aktif: true
    });
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (isLoading && mode === 'list') {
    return (
      <PageWithTabs title="Kontak" subtitle="Manajemen">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </PageWithTabs>
    );
  }

  if (isError && mode === 'list') {
    return (
      <PageWithTabs title="Kontak" subtitle="Manajemen">
        <div className="alert alert-error">
          <span>Gagal memuat data kontak</span>
        </div>
      </PageWithTabs>
    );
  }

  return (
    <PageWithTabs title="Kontak" subtitle="Manajemen">
      <div className="space-y-6">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          {mode === 'list' ? (
            <>
              {/* Tabs */}
              <div role="tablist" className="tabs tabs-boxed">
                <button
                  role="tab"
                  className={`tab ${activeTab === 'customer' ? 'tab-active' : ''}`}
                  onClick={() => {
                    setActiveTab('customer');
                    setSearch('');
                  }}
                >
                  <MdPeople className="mr-2" />
                  Customer
                </button>
                <button
                  role="tab"
                  className={`tab ${activeTab === 'supplier' ? 'tab-active' : ''}`}
                  onClick={() => {
                    setActiveTab('supplier');
                    setSearch('');
                  }}
                >
                  <MdLocalShipping className="mr-2" />
                  Supplier
                </button>
              </div>

              <button 
                className="btn btn-primary"
                onClick={handleAddNew}
              >
                <MdAdd size={20} />
                Add {activeTab === 'customer' ? 'Customer' : 'Supplier'}
              </button>
            </>
          ) : (
            <button 
              className="btn btn-ghost"
              onClick={handleBack}
            >
              <MdArrowBack size={20} />
              Back to List
            </button>
          )}
        </div>

        {/* LIST VIEW */}
        {mode === 'list' && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stats shadow bg-base-100">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <MdPeople className="text-3xl" />
                  </div>
                  <div className="stat-title">Total {activeTab === 'customer' ? 'Customers' : 'Suppliers'}</div>
                  <div className="stat-value text-primary">{totalContacts}</div>
                </div>
              </div>

              <div className="stats shadow bg-base-100">
                <div className="stat">
                  <div className="stat-figure text-success">
                    <MdPeople className="text-3xl" />
                  </div>
                  <div className="stat-title">Active</div>
                  <div className="stat-value text-success">{active}</div>
                  <div className="stat-desc">
                    {totalContacts > 0 ? ((active / totalContacts) * 100).toFixed(0) : 0}% of total
                  </div>
                </div>
              </div>

              <div className="stats shadow bg-base-100">
                <div className="stat">
                  <div className="stat-figure text-error">
                    <MdPeople className="text-3xl" />
                  </div>
                  <div className="stat-title">Inactive</div>
                  <div className="stat-value text-error">{inactive}</div>
                  <div className="stat-desc">
                    {totalContacts > 0 ? ((inactive / totalContacts) * 100).toFixed(0) : 0}% of total
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="form-control flex-1 min-w-[200px]">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search by name or code..."
                        className="input input-bordered w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <select
                    className="select select-bordered"
                    value={filterAktif}
                    onChange={(e) => setFilterAktif(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="card bg-base-100 shadow-lg overflow-x-auto">
              <div className="card-body p-0">
                <table className="table table-zebra">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Kode</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-base-content/60">
                          Tidak ada data {activeTab === 'customer' ? 'customer' : 'supplier'}
                        </td>
                      </tr>
                    ) : (
                      contacts.map((c) => (
                        <tr key={c._id} className="hover">
                          <td className="font-mono">{c.kode}</td>
                          <td>
                            <button
                              className="link link-primary font-medium"
                              onClick={() => handleViewDetail(c)}
                            >
                              {c.nama}
                            </button>
                          </td>
                          <td>{c.email || '-'}</td>
                          <td>{c.telepon}</td>
                          <td>
                            <span className="badge badge-ghost capitalize">{c.tipe}</span>
                          </td>
                          <td>
                            {c.aktif ? (
                              <span className="badge badge-success">Active</span>
                            ) : (
                              <span className="badge badge-error">Inactive</span>
                            )}
                          </td>
                          <td>
                            <div className="flex gap-2 justify-center">
                              <button
                                className="btn btn-sm btn-ghost text-info"
                                onClick={() => handleEdit(c)}
                              >
                                <MdEdit size={18} />
                              </button>
                              <button
                                className="btn btn-sm btn-ghost text-error"
                                onClick={() => handleDelete(c._id)}
                              >
                                <MdDelete size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ADD/EDIT FORM */}
        {(mode === 'add' || mode === 'edit') && (
          <div className="card bg-base-100 shadow-lg max-w-4xl mx-auto">
            <div className="card-body">
              <h2 className="card-title mb-4">
                {mode === 'edit' ? 'Edit Contact' : 'Add New Contact'}
              </h2>
              
              <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Kode</span>
                  </label>
                  <input 
                    type="text"
                    name="kode"
                    className="input input-bordered"
                    placeholder="AUTO (optional)"
                    value={formik.values.kode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Nama <span className="text-error">*</span>
                    </span>
                  </label>
                  <input 
                    type="text"
                    name="nama"
                    className={`input input-bordered ${formik.touched.nama && formik.errors.nama ? 'input-error' : ''}`}
                    placeholder="Enter name"
                    value={formik.values.nama}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.nama && formik.errors.nama && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formik.errors.nama}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input 
                    type="email"
                    name="email"
                    className={`input input-bordered ${formik.touched.email && formik.errors.email ? 'input-error' : ''}`}
                    placeholder="Enter email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formik.errors.email}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Phone <span className="text-error">*</span>
                    </span>
                  </label>
                  <input 
                    type="text"
                    name="telepon"
                    className={`input input-bordered ${formik.touched.telepon && formik.errors.telepon ? 'input-error' : ''}`}
                    placeholder="Enter phone"
                    value={formik.values.telepon}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.telepon && formik.errors.telepon && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formik.errors.telepon}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Type <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    name="tipe"
                    className="select select-bordered"
                    value={formik.values.tipe}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="customer">Customer</option>
                    <option value="supplier">Supplier</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Status</span>
                  </label>
                  <select
                    name="aktif"
                    className="select select-bordered"
                    value={formik.values.aktif.toString()}
                    onChange={(e) => formik.setFieldValue('aktif', e.target.value === 'true')}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">Address</span>
                  </label>
                  <textarea
                    name="alamat"
                    className="textarea textarea-bordered h-24"
                    placeholder="Enter address"
                    value={formik.values.alamat}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <button 
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleBack}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Saving...
                      </>
                    ) : (
                      mode === 'edit' ? 'Update Contact' : 'Save Contact'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DETAIL VIEW */}
        {mode === 'detail' && selectedContact && (
          <div className="space-y-6">
            {/* Contact Info Card */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-2xl">{selectedContact.nama}</h2>
                    <p className="text-sm text-base-content/60 font-mono">{selectedContact.kode}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(selectedContact)}
                    >
                      <MdEdit size={18} />
                      Edit
                    </button>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-semibold">Email:</span> {selectedContact.email || '-'}</p>
                      <p><span className="font-semibold">Phone:</span> {selectedContact.telepon}</p>
                      <p><span className="font-semibold">Address:</span> {selectedContact.alamat || '-'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-3">Status</h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-semibold">Type:</span>{' '}
                        <span className="badge badge-ghost capitalize">{selectedContact.tipe}</span>
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>{' '}
                        {selectedContact.aktif ? (
                          <span className="badge badge-success">Active</span>
                        ) : (
                          <span className="badge badge-error">Inactive</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">
                  <MdHistory className="text-2xl" />
                  Transaction History
                </h3>

                <div className="divider"></div>

                {contactDetail ? (
                  <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="stats shadow">
                        <div className="stat">
                          <div className="stat-title">Total Transactions</div>
                          <div className="stat-value text-primary">
                            {contactDetail.totalTransactions || 0}
                          </div>
                        </div>
                      </div>

                      <div className="stats shadow">
                        <div className="stat">
                          <div className="stat-title">Total Amount</div>
                          <div className="stat-value text-success">
                            {formatRupiah(contactDetail.totalAmount || 0)}
                          </div>
                        </div>
                      </div>

                      <div className="stats shadow">
                        <div className="stat">
                          <div className="stat-title">Outstanding</div>
                          <div className="stat-value text-warning">
                            {formatRupiah(contactDetail.outstanding || 0)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transactions Table */}
                    {contactDetail.transactions && contactDetail.transactions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <thead className="bg-base-200">
                            <tr>
                              <th>Date</th>
                              <th>No. Journal</th>
                              <th>Description</th>
                              <th className="text-right">Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contactDetail.transactions.map((trx, idx) => (
                              <tr key={idx}>
                                <td>{new Date(trx.tanggal).toLocaleDateString('id-ID')}</td>
                                <td className="font-mono">{trx.nomorJurnal}</td>
                                <td>{trx.deskripsi}</td>
                                <td className="text-right font-mono">
                                  {formatRupiah(trx.jumlah)}
                                </td>
                                <td>
                                  <span className={`badge ${
                                    trx.status === 'paid' ? 'badge-success' :
                                    trx.status === 'pending' ? 'badge-warning' :
                                    'badge-error'
                                  }`}>
                                    {trx.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-base-content/60">
                        No transaction history
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </PageWithTabs>
  );
};

export default Contacts;