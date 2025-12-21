// src/components/ItemFormModal.jsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import { FiTrendingUp } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { itemSchema } from '../validations/itemValidation';
import { CATEGORIES, UNITS, STATUS_OPTIONS } from '../constants/itemConstants';
import itemService from '../api/itemService';

const ItemFormModal = ({ isOpen, onClose, editItem, onSuccess }) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: itemService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['items']);
      onSuccess('Item berhasil ditambahkan!', 'success');
      onClose();
    },
    onError: (error) => {
      onSuccess(error.response?.data?.message || 'Gagal menambahkan item', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: itemService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['items']);
      onSuccess('Item berhasil diupdate!', 'success');
      onClose();
    },
    onError: (error) => {
      onSuccess(error.response?.data?.message || 'Gagal mengupdate item', 'error');
    },
  });

  const initialValues = editItem || {
    sku: '',
    name: '',
    description: '',
    category: 'hardware',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    minimumStock: 0,
    reorderPoint: 0,
    location: '',
    barcode: '',
    taxable: true,
    status: 'active',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {editItem ? 'Edit Item' : 'Tambah Item Baru'}
          </h2>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            ✕
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={itemSchema}
          onSubmit={(values) => {
            if (editItem) {
              updateMutation.mutate({ id: editItem._id, ...values });
            } else {
              createMutation.mutate(values);
            }
          }}
        >
          {({ errors, touched, values }) => (
            <Form className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">SKU *</span>
                  </label>
                  <Field
                    name="sku"
                    type="text"
                    className={`input input-bordered ${errors.sku && touched.sku ? 'input-error' : ''}`}
                    placeholder="Contoh: ACE-TOOLS-001"
                  />
                  {errors.sku && touched.sku && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.sku}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Nama Item *</span>
                  </label>
                  <Field
                    name="name"
                    type="text"
                    className={`input input-bordered ${errors.name && touched.name ? 'input-error' : ''}`}
                    placeholder="Nama item"
                  />
                  {errors.name && touched.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.name}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Deskripsi</span>
                </label>
                <Field
                  name="description"
                  as="textarea"
                  className="textarea textarea-bordered h-24"
                  placeholder="Deskripsi item..."
                />
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Kategori *</span>
                  </label>
                  <Field
                    name="category"
                    as="select"
                    className={`select select-bordered ${errors.category && touched.category ? 'select-error' : ''}`}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </Field>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Satuan *</span>
                  </label>
                  <Field
                    name="unit"
                    as="select"
                    className={`select select-bordered ${errors.unit && touched.unit ? 'select-error' : ''}`}
                  >
                    {UNITS.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </Field>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Status</span>
                  </label>
                  <Field
                    name="status"
                    as="select"
                    className="select select-bordered"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </Field>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Harga Beli (Rp) *</span>
                  </label>
                  <Field
                    name="costPrice"
                    type="number"
                    className={`input input-bordered ${errors.costPrice && touched.costPrice ? 'input-error' : ''}`}
                    placeholder="0"
                  />
                  {errors.costPrice && touched.costPrice && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.costPrice}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Harga Jual (Rp) *</span>
                  </label>
                  <Field
                    name="sellPrice"
                    type="number"
                    className={`input input-bordered ${errors.sellPrice && touched.sellPrice ? 'input-error' : ''}`}
                    placeholder="0"
                  />
                  {errors.sellPrice && touched.sellPrice && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.sellPrice}</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Profit Margin Display */}
              {values.costPrice > 0 && values.sellPrice > 0 && (
                <div className="alert alert-info">
                  <FiTrendingUp />
                  <span>
                    Profit Margin: <strong>{(((values.sellPrice - values.costPrice) / values.costPrice) * 100).toFixed(2)}%</strong>
                  </span>
                </div>
              )}

              {/* Stock Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Minimum Stock</span>
                  </label>
                  <Field
                    name="minimumStock"
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Reorder Point</span>
                  </label>
                  <Field
                    name="reorderPoint"
                    type="number"
                    className="input input-bordered"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Lokasi Penyimpanan</span>
                  </label>
                  <Field
                    name="location"
                    type="text"
                    className="input input-bordered"
                    placeholder="Contoh: A1-R01"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Barcode</span>
                  </label>
                  <Field
                    name="barcode"
                    type="text"
                    className="input input-bordered"
                    placeholder="Opsional"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <Field
                    name="taxable"
                    type="checkbox"
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text font-semibold">Item Kena Pajak</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Menyimpan...
                    </>
                  ) : (
                    editItem ? 'Update Item' : 'Tambah Item'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ItemFormModal;