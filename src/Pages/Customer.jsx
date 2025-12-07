import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdAdd, MdArrowBack, MdPeople, MdPersonAdd, MdHighlightOff, MdNewReleases, MdSearch, MdEdit, MdDelete } from 'react-icons/md';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../lib/axios';

// Validation Schema
const validationSchema = Yup.object({
  nama: Yup.string().required('Nama wajib diisi').min(3, 'Nama minimal 3 karakter'),
  email: Yup.string().email('Email tidak valid'),
  telepon: Yup.string().required('Telepon wajib diisi'),
  alamat: Yup.string(),
  tipe: Yup.string().required('Tipe wajib dipilih').oneOf(['customer', 'supplier', 'both']),
  aktif: Yup.boolean()
});

const Customer = () => {
  const [mode, setMode] = useState("list"); // list | add | edit
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterTipe, setFilterTipe] = useState('customer');
  const [filterAktif, setFilterAktif] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch customers
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['kontak', filterTipe, filterAktif, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterTipe) params.append('tipe', filterTipe);
      if (filterAktif) params.append('aktif', filterAktif);
      if (search) params.append('search', search);
      
      const { data } = await api.get(`/kontak?${params}`);
      return data;
    }
  });

  const customers = response?.data || [];

  // Statistics
  const active = customers.filter(c => c.aktif === true).length;
  const inactive = customers.filter(c => c.aktif === false).length;
  const newCust = customers.filter(c => {
    const createdDate = new Date(c.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  }).length;

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
      alert('Customer berhasil ditambahkan!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Gagal menambahkan customer');
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
      setEditId(null);
      formik.resetForm();
      alert('Customer berhasil diupdate!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Gagal mengupdate customer');
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
      alert('Customer berhasil dihapus!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Gagal menghapus customer');
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
      tipe: 'customer',
      aktif: true
    },
    validationSchema,
    onSubmit: (values) => {
      if (mode === 'edit' && editId) {
        updateMutation.mutate({ id: editId, values });
      } else {
        createMutation.mutate(values);
      }
    }
  });

  const handleEdit = (customer) => {
    setMode('edit');
    setEditId(customer._id);
    formik.setValues({
      kode: customer.kode || '',
      nama: customer.nama,
      email: customer.email || '',
      telepon: customer.telepon,
      alamat: customer.alamat || '',
      tipe: customer.tipe,
      aktif: customer.aktif
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus customer ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBack = () => {
    setMode('list');
    setEditId(null);
    formik.resetForm();
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
        <span>Gagal memuat data customer</span>
      </div>
    );
  }

  return (
    <div>
      {/* TOP HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">
          {mode === 'list' ? 'Customers' : mode === 'add' ? 'Add New Customer' : 'Edit Customer'}
        </h1>

        {mode === "list" ? (
          <button 
            className="btn btn-primary flex gap-2"
            onClick={() => setMode("add")}
          >
            <MdAdd size={20} />
            Add Customer
          </button>
        ) : (
          <button 
            className="btn flex gap-2"
            onClick={handleBack}
          >
            <MdArrowBack size={20} />
            Back
          </button>
        )}
      </div>

      {/* DASHBOARD CARDS */}
      {mode === "list" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Customers */}
            <div className="bg-base-100 p-4 rounded-xl border-l-4 border-primary shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <MdPeople size={28} className="text-primary" />
                </div>
                <div>
                  <p className="text-base-content/60 text-sm">Total Customers</p>
                  <h2 className="text-3xl font-bold text-primary">{customers.length}</h2>
                </div>
              </div>
              <div className="mt-3">
                <progress className="progress progress-primary w-full" value={100} max={100}></progress>
              </div>
            </div>

            {/* Active Customers */}
            <div className="bg-base-100 p-4 rounded-xl border-l-4 border-success shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-xl">
                  <MdPersonAdd size={28} className="text-success" />
                </div>
                <div>
                  <p className="text-base-content/60 text-sm">Active Customers</p>
                  <h2 className="text-3xl font-bold text-success">{active}</h2>
                </div>
              </div>
              <div className="mt-3">
                <progress 
                  className="progress progress-success w-full" 
                  value={customers.length > 0 ? (active / customers.length) * 100 : 0} 
                  max={100}
                ></progress>
              </div>
            </div>

            {/* New Customers (Last 30 days) */}
            <div className="bg-base-100 p-4 rounded-xl border-l-4 border-info shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-info/10 rounded-xl">
                  <MdNewReleases size={28} className="text-info" />
                </div>
                <div>
                  <p className="text-base-content/60 text-sm">New (30 days)</p>
                  <h2 className="text-3xl font-bold text-info">{newCust}</h2>
                </div>
              </div>
              <div className="mt-3">
                <progress 
                  className="progress progress-info w-full" 
                  value={customers.length > 0 ? (newCust / customers.length) * 100 : 0} 
                  max={100}
                ></progress>
              </div>
            </div>

            {/* Inactive */}
            <div className="bg-base-100 p-4 rounded-xl border-l-4 border-error shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-error/10 rounded-xl">
                  <MdHighlightOff size={28} className="text-error" />
                </div>
                <div>
                  <p className="text-base-content/60 text-sm">Inactive</p>
                  <h2 className="text-3xl font-bold text-error">{inactive}</h2>
                </div>
              </div>
              <div className="mt-3">
                <progress 
                  className="progress progress-error w-full" 
                  value={customers.length > 0 ? (inactive / customers.length) * 100 : 0} 
                  max={100}
                ></progress>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="card bg-base-100 shadow-sm mb-6">
            <div className="card-body p-4">
              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="form-control flex-1 min-w-[200px]">
                  <div className="input-group">
                    <span className="bg-base-200">
                      <MdSearch size={20} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search by name or code..."
                      className="input input-bordered w-full"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filter Status */}
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
        </>
      )}

      {/* CUSTOMER LIST */}
      {mode === "list" && (
        <div className="card bg-base-100 shadow-lg overflow-x-auto">
          <div className="card-body p-0">
            <table className="table table-zebra">
              <thead className="bg-base-200">
                <tr>
                  <th>Kode</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Tipe</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-base-content/60">
                      Tidak ada data customer
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c._id} className="hover">
                      <td className="font-mono">{c.kode}</td>
                      <td className="font-medium">{c.nama}</td>
                      <td>{c.email || '-'}</td>
                      <td>{c.telepon}</td>
                      <td>
                        <span className="badge badge-ghost">{c.tipe}</span>
                      </td>
                      <td>
                        {c.aktif ? (
                          <span className="badge badge-success">Active</span>
                        ) : (
                          <span className="badge badge-error">Inactive</span>
                        )}
                      </td>
                      <td className="text-center">
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
      )}

      {/* ADD/EDIT CUSTOMER FORM */}
      {(mode === "add" || mode === "edit") && (
        <div className="card bg-base-100 shadow-lg max-w-4xl mx-auto">
          <div className="card-body">
            <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Kode */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Kode Customer</span>
                </label>
                <input 
                  type="text"
                  name="kode"
                  className="input input-bordered"
                  placeholder="AUTO (Kosongkan untuk auto-generate)"
                  value={formik.values.kode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              {/* Nama */}
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

              {/* Email */}
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

              {/* Telepon */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Phone Number <span className="text-error">*</span>
                  </span>
                </label>
                <input 
                  type="text"
                  name="telepon"
                  className={`input input-bordered ${formik.touched.telepon && formik.errors.telepon ? 'input-error' : ''}`}
                  placeholder="Enter phone number"
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

              {/* Tipe */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Tipe <span className="text-error">*</span>
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

              {/* Status */}
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

              {/* Alamat */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Alamat</span>
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

              {/* Submit Button */}
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
                    mode === 'edit' ? 'Update Customer' : 'Save Customer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;