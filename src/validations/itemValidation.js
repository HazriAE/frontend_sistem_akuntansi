// src/validations/itemValidation.js
import * as Yup from 'yup';

export const itemSchema = Yup.object().shape({
  sku: Yup.string()
    .required('SKU wajib diisi')
    .min(3, 'SKU minimal 3 karakter')
    .max(20, 'SKU maksimal 20 karakter'),
  
  name: Yup.string()
    .required('Nama item wajib diisi')
    .min(3, 'Nama minimal 3 karakter'),
  
  description: Yup.string(),
  
  category: Yup.string().required('Kategori wajib dipilih'),
  
  unit: Yup.string().required('Satuan wajib dipilih'),
  
  costPrice: Yup.number()
    .required('Harga beli wajib diisi')
    .min(0, 'Harga beli tidak boleh negatif'),
  
  sellPrice: Yup.number()
    .required('Harga jual wajib diisi')
    .min(0, 'Harga jual tidak boleh negatif')
    .test('greater-than-cost', 'Harga jual sebaiknya lebih besar dari harga beli', function(value) {
      const { costPrice } = this.parent;
      return value >= costPrice;
    }),
  
  minimumStock: Yup.number()
    .min(0, 'Stok minimum tidak boleh negatif')
    .default(0),
  
  reorderPoint: Yup.number()
    .min(0, 'Reorder point tidak boleh negatif')
    .default(0),
  
  location: Yup.string(),
  
  barcode: Yup.string(),
  
  taxable: Yup.boolean().default(true),
  
  status: Yup.string()
    .oneOf(['active', 'inactive', 'discontinued'])
    .default('active'),
});