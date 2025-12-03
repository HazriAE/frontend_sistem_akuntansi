import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MdAdd, MdClose, MdRefresh } from 'react-icons/md';
import PageWithTabs from '../components/PageWithTabs.jsx';
import api from '../lib/axios.js';

// Fetch accounts for dropdown
const fetchAccounts = async () => {
  const { data } = await api.get('/akun');
  return data.accounts || [];
};

// Generate nomor jurnal
const generateNomorJurnal = async () => {
  try {
    const { data } = await api.get('/jurnal/generate-number');
    return data.nomorJurnal;
  } catch (error) {
    // Fallback jika endpoint belum ada
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999) + 1;
    return `JU-${year}${month}-${String(random).padStart(4, '0')}`;
  }
};
const validationSchema = Yup.object({
  nomorJurnal: Yup.string().required('Nomor jurnal wajib diisi'),
  tanggal: Yup.date().required('Tanggal wajib diisi'),
  deskripsi: Yup.string().required('Deskripsi wajib diisi'),
  items: Yup.array()
    .min(2, 'Minimal 2 baris transaksi')
    .test('balance', 'Total Debit dan Kredit harus seimbang', function(items) {
      const totalDebit = items?.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0) || 0;
      const totalKredit = items?.reduce((sum, item) => sum + (parseFloat(item.kredit) || 0), 0) || 0;
      return totalDebit === totalKredit && totalDebit > 0;
    })
});

const JournalEntryForm = () => {
  const [autoNumber, setAutoNumber] = useState(true);

  // Fetch accounts
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });

  // Create journal entry mutation
  const mutation = useMutation({
    mutationFn: async (values) => {
      const { data } = await api.post('/jurnal', values);
      return data;
    },
    onSuccess: () => {
      alert('Jurnal berhasil disimpan!');
      formik.resetForm();
      loadNomorJurnal();
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Gagal menyimpan jurnal');
    }
  });

  const formik = useFormik({
    initialValues: {
      nomorJurnal: '[Auto]',
      tanggal: new Date().toISOString().split('T')[0],
      deskripsi: '',
      jenisTransaksi: 'umum',
      items: [
        { akun: '', kodeAkun: '', namaAkun: '', debit: 0, kredit: 0, keterangan: '' },
        { akun: '', kodeAkun: '', namaAkun: '', debit: 0, kredit: 0, keterangan: '' }
      ],
      status: 'draft'
    },
    validationSchema,
    onSubmit: (values) => {
      // Calculate totals
      const totalDebit = values.items.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
      const totalKredit = values.items.reduce((sum, item) => sum + (parseFloat(item.kredit) || 0), 0);

      // Remove empty items
      const filteredItems = values.items.filter(item => item.akun);

      const payload = {
        ...values,
        items: filteredItems,
        totalDebit,
        totalKredit
      };

      mutation.mutate(payload);
    }
  });

  // Load nomor jurnal saat component mount
  const loadNomorJurnal = async () => {
    if (autoNumber) {
      try {
        const nomor = await generateNomorJurnal();
        formik.setFieldValue('nomorJurnal', nomor);
      } catch (error) {
        console.error('Failed to generate number:', error);
      }
    }
  };

  useEffect(() => {
    loadNomorJurnal();
  }, []);

  // Add new row
  const handleAddRow = () => {
    formik.setFieldValue('items', [
      ...formik.values.items,
      { akun: '', kodeAkun: '', namaAkun: '', debit: 0, kredit: 0, keterangan: '' }
    ]);
  };

  // Remove row
  const handleRemoveRow = (index) => {
    const newItems = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue('items', newItems);
  };

  // Handle account change
  const handleAccountChange = (index, accountId) => {
    const account = accounts.find(acc => acc._id === accountId);
    if (account) {
      formik.setFieldValue(`items[${index}].akun`, accountId);
      formik.setFieldValue(`items[${index}].kodeAkun`, account.kodeAkun);
      formik.setFieldValue(`items[${index}].namaAkun`, account.namaAkun);
    }
  };

  // Calculate totals
  const totalDebit = formik.values.items.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0);
  const totalKredit = formik.values.items.reduce((sum, item) => sum + (parseFloat(item.kredit) || 0), 0);
  const isBalanced = totalDebit === totalKredit && totalDebit > 0;

  return (
    <PageWithTabs title="Jurnal Umum" subtitle="Transaksi">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Header Section */}
        <div className="card bg-info/10 border-l-4 border-info">
          <div className="card-body p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* No Transaksi */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">No Transaksi</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={loadNomorJurnal}
                      className="btn btn-ghost btn-xs"
                      title="Generate Ulang"
                    >
                      <MdRefresh size={16} />
                    </button>
                  </div>
                </label>
                <input
                  type="text"
                  name="nomorJurnal"
                  placeholder="[Auto]"
                  className="input input-bordered"
                  value={formik.values.nomorJurnal}
                  onChange={formik.handleChange}
                  disabled={autoNumber}
                />
                {formik.touched.nomorJurnal && formik.errors.nomorJurnal && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formik.errors.nomorJurnal}</span>
                  </label>
                )}
              </div>

              {/* Tgl Transaksi */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Tgl Transaksi</span>
                </label>
                <input
                  type="date"
                  name="tanggal"
                  className="input input-bordered"
                  value={formik.values.tanggal}
                  onChange={formik.handleChange}
                />
                {formik.touched.tanggal && formik.errors.tanggal && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formik.errors.tanggal}</span>
                  </label>
                )}
              </div>

              {/* Jenis Transaksi */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Jenis Transaksi</span>
                </label>
                <select
                  name="jenisTransaksi"
                  className="select select-bordered"
                  value={formik.values.jenisTransaksi}
                  onChange={formik.handleChange}
                >
                  <option value="umum">Umum</option>
                  <option value="penjualan">Penjualan</option>
                  <option value="pembelian">Pembelian</option>
                  <option value="kas_masuk">Kas Masuk</option>
                  <option value="kas_keluar">Kas Keluar</option>
                  <option value="penyesuaian">Penyesuaian</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Deskripsi <span className="text-error">*</span></span>
          </label>
          <input
            type="text"
            name="deskripsi"
            placeholder="Masukkan deskripsi jurnal"
            className="input input-bordered"
            value={formik.values.deskripsi}
            onChange={formik.handleChange}
          />
          {formik.touched.deskripsi && formik.errors.deskripsi && (
            <label className="label">
              <span className="label-text-alt text-error">{formik.errors.deskripsi}</span>
            </label>
          )}
        </div>

        {/* Items Table */}
        <div className="card bg-base-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200">
                <tr>
                  <th className="w-8">#</th>
                  <th className="min-w-[200px]">Akun</th>
                  <th className="min-w-[200px]">Deskripsi</th>
                  <th className="w-32 text-right">Debit</th>
                  <th className="w-32 text-right">Kredit</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {formik.values.items.map((item, index) => (
                  <tr key={index} className="hover">
                    <td>{index + 1}</td>
                    <td>
                      <select
                        className="select select-bordered select-sm w-full"
                        value={item.akun}
                        onChange={(e) => handleAccountChange(index, e.target.value)}
                      >
                        <option value="">Pilih akun</option>
                        {accounts.map((account) => (
                          <option key={account._id} value={account._id}>
                            {account.kodeAkun} - {account.namaAkun}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input input-bordered input-sm w-full"
                        placeholder="Keterangan"
                        value={item.keterangan}
                        onChange={(e) => formik.setFieldValue(`items[${index}].keterangan`, e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="input input-bordered input-sm w-full text-right"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        value={item.debit}
                        onChange={(e) => {
                          formik.setFieldValue(`items[${index}].debit`, e.target.value);
                          formik.setFieldValue(`items[${index}].kredit`, 0);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="input input-bordered input-sm w-full text-right"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        value={item.kredit}
                        onChange={(e) => {
                          formik.setFieldValue(`items[${index}].kredit`, e.target.value);
                          formik.setFieldValue(`items[${index}].debit`, 0);
                        }}
                      />
                    </td>
                    <td>
                      {formik.values.items.length > 2 && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-circle text-error"
                          onClick={() => handleRemoveRow(index)}
                        >
                          <MdClose size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-base-200 font-bold">
                <tr>
                  <td colSpan="3" className="text-right">Total</td>
                  <td className="text-right">
                    Rp. {totalDebit.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="text-right">
                    Rp. {totalKredit.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Add Row Button */}
        <button
          type="button"
          className="btn btn-info btn-sm"
          onClick={handleAddRow}
        >
          <MdAdd size={20} />
          Tambah Data
        </button>

        {/* Balance Status */}
        {!isBalanced && totalDebit > 0 && (
          <div className="alert alert-warning">
            <span>
              ⚠️ Jurnal tidak seimbang! Selisih: Rp. {Math.abs(totalDebit - totalKredit).toLocaleString('id-ID')}
            </span>
          </div>
        )}

        {formik.touched.items && formik.errors.items && typeof formik.errors.items === 'string' && (
          <div className="alert alert-error">
            <span>{formik.errors.items}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => formik.resetForm()}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={!isBalanced || mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Menyimpan...
              </>
            ) : (
              'Buat Jurnal Umum'
            )}
          </button>
        </div>
      </form>
    </PageWithTabs>
  );
};

export default JournalEntryForm;