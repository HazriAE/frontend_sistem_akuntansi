import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MdClose } from 'react-icons/md';
import api from '../../lib/axios';

// Validation Schema
const validationSchema = Yup.object({
  kodeAkun: Yup.string()
    .required('Kode akun wajib diisi')
    .matches(/^[0-9-]+$/, 'Kode akun hanya boleh berisi angka dan tanda hubung'),
  namaAkun: Yup.string()
    .required('Nama akun wajib diisi')
    .min(3, 'Nama akun minimal 3 karakter'),
  tipeAkun: Yup.string()
    .required('Tipe akun wajib dipilih')
    .oneOf(['aset', 'liabilitas', 'ekuitas', 'pendapatan', 'beban']),
  kategori: Yup.string()
    .required('Kategori wajib dipilih'),
  saldoNormal: Yup.string()
    .required('Saldo normal wajib dipilih')
    .oneOf(['debit', 'kredit']),
  saldoAwal: Yup.number()
    .min(0, 'Saldo awal tidak boleh negatif')
    .default(0),
  deskripsi: Yup.string()
});

const DrawerAddAccount = ({ onClose, onSuccess }) => {
  // Mutation untuk create account
  const mutation = useMutation({
    mutationFn: async (values) => {
      const { data } = await api.post('/accounts', values);
      return data;
    },
    onSuccess: () => {
      onSuccess();
      formik.resetForm();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Gagal menambahkan akun';
      alert(errorMessage);
    }
  });

  const formik = useFormik({
    initialValues: {
      kodeAkun: '',
      namaAkun: '',
      tipeAkun: '',
      kategori: '',
      saldoNormal: '',
      saldoAwal: 0,
      deskripsi: ''
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    }
  });

  // Options untuk kategori berdasarkan tipe akun
  const kategoriOptions = {
    aset: [
      { value: 'kas', label: 'Kas' },
      { value: 'bank', label: 'Bank' },
      { value: 'piutang', label: 'Piutang' },
      { value: 'persediaan', label: 'Persediaan' },
      { value: 'aset_tetap', label: 'Aset Tetap' },
      { value: 'lainnya', label: 'Lainnya' }
    ],
    liabilitas: [
      { value: 'hutang', label: 'Hutang' },
      { value: 'lainnya', label: 'Lainnya' }
    ],
    ekuitas: [
      { value: 'modal', label: 'Modal' },
      { value: 'lainnya', label: 'Lainnya' }
    ],
    pendapatan: [
      { value: 'penjualan', label: 'Penjualan' },
      { value: 'lainnya', label: 'Lainnya' }
    ],
    beban: [
      { value: 'pembelian', label: 'Pembelian' },
      { value: 'biaya_operasional', label: 'Biaya Operasional' },
      { value: 'lainnya', label: 'Lainnya' }
    ]
  };

  const availableKategori = formik.values.tipeAkun 
    ? kategoriOptions[formik.values.tipeAkun] 
    : [];

  // Auto-set saldo normal based on tipe akun
  const handleTipeAkunChange = (e) => {
    const tipe = e.target.value;
    formik.setFieldValue('tipeAkun', tipe);
    
    // Auto set saldo normal
    if (tipe === 'aset' || tipe === 'beban') {
      formik.setFieldValue('saldoNormal', 'debit');
    } else if (tipe === 'liabilitas' || tipe === 'ekuitas' || tipe === 'pendapatan') {
      formik.setFieldValue('saldoNormal', 'kredit');
    }
    
    // Reset kategori
    formik.setFieldValue('kategori', '');
  };

  return (
    <div className="w-[600px] min-h-full bg-base-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Buat Akun Baru</h2>
          <p className="text-sm text-base-content/60 mt-1">
            Tambahkan akun baru ke dalam sistem
          </p>
        </div>
        <button 
          className="btn btn-ghost btn-sm btn-circle"
          onClick={onClose}
          type="button"
        >
          <MdClose size={24} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Kode Akun */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Kode Akun <span className="text-error">*</span>
            </span>
          </label>
          <input 
            type="text" 
            name="kodeAkun"
            placeholder="1-10001" 
            className={`input input-bordered ${formik.touched.kodeAkun && formik.errors.kodeAkun ? 'input-error' : ''}`}
            value={formik.values.kodeAkun}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.kodeAkun && formik.errors.kodeAkun && (
            <label className="label">
              <span className="label-text-alt text-error">{formik.errors.kodeAkun}</span>
            </label>
          )}
        </div>

        {/* Nama Akun */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Nama Akun <span className="text-error">*</span>
            </span>
          </label>
          <input 
            type="text"
            name="namaAkun"
            placeholder="Kas" 
            className={`input input-bordered ${formik.touched.namaAkun && formik.errors.namaAkun ? 'input-error' : ''}`}
            value={formik.values.namaAkun}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.namaAkun && formik.errors.namaAkun && (
            <label className="label">
              <span className="label-text-alt text-error">{formik.errors.namaAkun}</span>
            </label>
          )}
        </div>

        {/* Tipe Akun */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Tipe Akun <span className="text-error">*</span>
            </span>
          </label>
          <select 
            name="tipeAkun"
            className={`select select-bordered ${formik.touched.tipeAkun && formik.errors.tipeAkun ? 'select-error' : ''}`}
            value={formik.values.tipeAkun}
            onChange={handleTipeAkunChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Pilih Tipe Akun</option>
            <option value="aset">Aset</option>
            <option value="liabilitas">Liabilitas</option>
            <option value="ekuitas">Ekuitas</option>
            <option value="pendapatan">Pendapatan</option>
            <option value="beban">Beban</option>
          </select>
          {formik.touched.tipeAkun && formik.errors.tipeAkun && (
            <label className="label">
              <span className="label-text-alt text-error">{formik.errors.tipeAkun}</span>
            </label>
          )}
        </div>

        {/* Kategori */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Kategori <span className="text-error">*</span>
            </span>
          </label>
          <select 
            name="kategori"
            className={`select select-bordered ${formik.touched.kategori && formik.errors.kategori ? 'select-error' : ''}`}
            value={formik.values.kategori}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!formik.values.tipeAkun}
          >
            <option value="">Pilih Kategori</option>
            {availableKategori.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {formik.touched.kategori && formik.errors.kategori && (
            <label className="label">
              <span className="label-text-alt text-error">{formik.errors.kategori}</span>
            </label>
          )}
        </div>

        {/* Saldo Normal */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Saldo Normal <span className="text-error">*</span>
            </span>
          </label>
          <select 
            name="saldoNormal"
            className={`select select-bordered ${formik.touched.saldoNormal && formik.errors.saldoNormal ? 'select-error' : ''}`}
            value={formik.values.saldoNormal}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Pilih Saldo Normal</option>
            <option value="debit">Debit</option>
            <option value="kredit">Kredit</option>
          </select>
          {formik.touched.saldoNormal && formik.errors.saldoNormal && (
            <label className="label">
              <span className="label-text-alt text-error">{formik.errors.saldoNormal}</span>
            </label>
          )}
        </div>

        {/* Saldo Awal */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Saldo Awal</span>
          </label>
          <input 
            type="number"
            name="saldoAwal"
            placeholder="0" 
            className={`input input-bordered ${formik.touched.saldoAwal && formik.errors.saldoAwal ? 'input-error' : ''}`}
            value={formik.values.saldoAwal}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            min="0"
            step="0.01"
          />
          {formik.touched.saldoAwal && formik.errors.saldoAwal && (
            <label className="label">
              <span className="label-text-alt text-error">{formik.errors.saldoAwal}</span>
            </label>
          )}
        </div>

        {/* Deskripsi */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Deskripsi</span>
          </label>
          <textarea 
            name="deskripsi"
            className="textarea textarea-bordered h-24"
            placeholder="Deskripsi akun (opsional)"
            value={formik.values.deskripsi}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          ></textarea>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button 
            type="button"
            className="btn btn-ghost flex-1"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="btn btn-primary flex-1"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Menyimpan...
              </>
            ) : (
              'Simpan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DrawerAddAccount;