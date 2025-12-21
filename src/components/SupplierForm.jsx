import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiTag, 
  FiUserCheck,
  FiSave,
  FiX
} from 'react-icons/fi';

// Component untuk Input Field dengan Icon
const FormInput = ({ 
  label, 
  name, 
  type = "text", 
  icon: Icon, 
  required = false, 
  formik, 
  placeholder,
  ...props 
}) => {
  const hasError = formik.touched[name] && formik.errors[name];
  
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      <label className={`input input-bordered flex items-center gap-2 ${hasError ? 'input-error' : ''}`}>
        {Icon && <Icon className="text-base-content/40" size={18} />}
        <input
          type={type}
          name={name}
          className="grow"
          placeholder={placeholder}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          {...props}
        />
      </label>
      {hasError && (
        <label className="label">
          <span className="label-text-alt text-error">{formik.errors[name]}</span>
        </label>
      )}
    </div>
  );
};

// Component untuk Select Field dengan Icon
const FormSelect = ({ 
  label, 
  name, 
  icon: Icon, 
  required = false, 
  formik, 
  options,
  customOnChange,
  ...props 
}) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      <label className="input input-bordered flex items-center gap-2">
        {Icon && <Icon className="text-base-content/40" size={18} />}
        <select
          name={name}
          className="grow bg-transparent outline-none cursor-pointer"
          value={formik.values[name]}
          onChange={customOnChange || formik.handleChange}
          onBlur={formik.handleBlur}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

// Component untuk Textarea dengan Icon
const FormTextarea = ({ 
  label, 
  name, 
  icon: Icon, 
  formik, 
  placeholder,
  rows = 3,
  ...props 
}) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-3">
            <Icon className="text-base-content/40" size={18} />
          </div>
        )}
        <textarea
          name={name}
          className={`textarea textarea-bordered w-full ${Icon ? 'pl-10' : ''}`}
          placeholder={placeholder}
          rows={rows}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          {...props}
        />
      </div>
    </div>
  );
};

// Main Form Component
const SupplierForm = ({ mode, formik, createMutation, updateMutation, handleBack }) => {
  const isLoading = createMutation?.isPending || updateMutation?.isPending;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit(e);
  };

  return (
    <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">
          {mode === 'edit' ? 'Edit Supplier' : 'Tambah Supplier Baru'}
        </h2>
        
        <div className="space-y-6">
          {/* Grid Layout untuk Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Kode Supplier */}
            <FormInput
              label="Kode Supplier"
              name="kode"
              icon={FiTag}
              formik={formik}
              placeholder="AUTO (Kosongkan untuk auto-generate)"
            />

            {/* Nama */}
            <FormInput
              label="Nama"
              name="nama"
              icon={FiUser}
              required
              formik={formik}
              placeholder="Masukkan nama supplier"
            />

            {/* Email */}
            <FormInput
              label="Email"
              name="email"
              type="email"
              icon={FiMail}
              formik={formik}
              placeholder="supplier@email.com"
            />

            {/* Telepon */}
            <FormInput
              label="Nomor Telepon"
              name="telepon"
              icon={FiPhone}
              required
              formik={formik}
              placeholder="08xx xxxx xxxx"
            />

            {/* Tipe */}
            <FormSelect
              label="Tipe"
              name="tipe"
              icon={FiUserCheck}
              required
              formik={formik}
              options={[
                { value: 'supplier', label: 'Supplier' },
                { value: 'customer', label: 'Customer' },
                { value: 'both', label: 'Customer & Supplier' }
              ]}
            />

            {/* Status */}
            <FormSelect
              label="Status"
              name="aktif"
              icon={FiUserCheck}
              formik={{
                ...formik,
                values: { ...formik.values, aktif: formik.values.aktif.toString() }
              }}
              customOnChange={(e) => formik.setFieldValue('aktif', e.target.value === 'true')}
              options={[
                { value: 'true', label: 'Aktif' },
                { value: 'false', label: 'Tidak Aktif' }
              ]}
            />
          </div>

          {/* Alamat - Full Width */}
          <FormTextarea
            label="Alamat"
            name="alamat"
            icon={FiMapPin}
            formik={formik}
            placeholder="Masukkan alamat lengkap"
            rows={3}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button"
              className="btn btn-ghost gap-2"
              onClick={handleBack}
              disabled={isLoading}
            >
              <FiX size={18} />
              Batal
            </button>
            <button 
              type="button" 
              className="btn btn-primary gap-2"
              onClick={handleFormSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Menyimpan...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  {mode === 'edit' ? 'Update Supplier' : 'Simpan Supplier'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;