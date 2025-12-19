import { useState } from "react";
import { 
  FiPlus, FiTrash2, FiChevronLeft 
} from 'react-icons/fi';
import { useCreatePurchase, useUpdatePurchase } from '../../hooks/usePurchase';
import { useSuppliers } from '../../hooks/useSupplier';
import { useItems } from "../../hooks/useItem";

const PurchaseForm = ({ purchase, onBack, formatCurrency }) => {
  const createMutation = useCreatePurchase();
  const updateMutation = useUpdatePurchase();

  // Fetch suppliers and items from API
  const { data: suppliersData, isLoading: suppliersLoading } = useSuppliers();
  const { data: itemsData, isLoading: itemsLoading } = useItems();

  const suppliers = suppliersData || [];
  const availableItems = itemsData?.data || [];

  const [formData, setFormData] = useState({
    purchaseNumber: purchase?.purchaseNumber || 'PO-' + Date.now(),
    supplier: purchase?.supplier?._id || '',
    purchaseDate: purchase?.purchaseDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    dueDate: purchase?.dueDate?.split('T')[0] || '',
    taxRate: purchase?.taxRate || 11,
    items: purchase?.items?.map(item => ({
      item: item.item?._id || item.item,
      sku: item.item?.sku || '',
      name: item.item?.name || '',
      quantity: item.quantity,
      unit: item.item?.unit || '',
      unitPrice: item.unitPrice,
      discountPercent: 0,
      discountAmount: item.discountAmount || 0,
      subtotal: (item.quantity * item.unitPrice) - (item.discountAmount || 0)
    })) || [],
    notes: purchase?.notes || '',
    referenceNumber: purchase?.referenceNumber || '',
    terms: purchase?.terms || ''
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          item: '',
          sku: '',
          name: '',
          quantity: 1,
          unit: '',
          unitPrice: 0,
          discountPercent: 0,
          discountAmount: 0,
          subtotal: 0
        }
      ]
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === 'item') {
      const selectedItem = availableItems.find(item => item._id === value);
      if (selectedItem) {
        newItems[index].sku = selectedItem.sku || '';
        newItems[index].name = selectedItem.name || '';
        newItems[index].unit = selectedItem.unit || '';
        newItems[index].unitPrice = selectedItem.costPrice || selectedItem.price || 0;
      }
    }

    if (field === 'quantity' || field === 'unitPrice' || field === 'discountPercent') {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const price = parseFloat(newItems[index].unitPrice) || 0;
      const discountPct = parseFloat(newItems[index].discountPercent) || 0;
      
      const subtotalBeforeDiscount = qty * price;
      const discountAmount = subtotalBeforeDiscount * (discountPct / 100);
      newItems[index].discountAmount = discountAmount;
      newItems[index].subtotal = subtotalBeforeDiscount - discountAmount;
    }

    setFormData({ ...formData, items: newItems });
  };

  const calculateSummary = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const discountTotal = formData.items.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
    const subtotalAfterDiscount = subtotal;
    const tax = subtotalAfterDiscount * (formData.taxRate / 100);
    const total = subtotalAfterDiscount + tax;

    return { subtotal, discountTotal, subtotalAfterDiscount, tax, total };
  };

  const summary = calculateSummary();

  const handleSubmit = async (isDraft) => {
    if (!formData.supplier) {
      alert('Supplier harus dipilih');
      return;
    }
    if (!formData.dueDate) {
      alert('Due date harus diisi');
      return;
    }
    if (formData.items.length === 0) {
      alert('Minimal harus ada 1 item');
      return;
    }

    // Validate all items have been selected
    const hasEmptyItem = formData.items.some(item => !item.item);
    if (hasEmptyItem) {
      alert('Semua item harus dipilih');
      return;
    }

    const dataToSave = {
      supplier: formData.supplier,
      purchaseDate: formData.purchaseDate,
      dueDate: formData.dueDate,
      items: formData.items.map(item => ({
        item: item.item,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        discountAmount: parseFloat(item.discountAmount) || 0
      })),
      notes: formData.notes,
      referenceNumber: formData.referenceNumber,
      terms: formData.terms,
      taxRate: parseFloat(formData.taxRate)
    };

    try {
      if (purchase?._id) {
        // Update existing purchase
        await updateMutation.mutateAsync({ id: purchase._id, data: dataToSave });
        alert('Purchase berhasil diupdate!');
      } else {
        // Create new purchase
        const result = await createMutation.mutateAsync(dataToSave);
        alert('Purchase berhasil dibuat!');
      }
      onBack();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Terjadi kesalahan';
      alert(errorMessage);
      console.error('Error:', error);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isLoading = suppliersLoading || itemsLoading;

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
        >
          <FiChevronLeft className="w-5 h-5" />
          Back to List
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {purchase ? 'Edit Purchase Order' : 'Create New Purchase Order'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Header Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Number
            </label>
            <input
              type="text"
              value={formData.purchaseNumber}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <option value="">Pilih Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Number
            </label>
            <input
              type="text"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Items</h2>
          <button
            onClick={addItem}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            disabled={isSubmitting}
          >
            <FiPlus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SKU</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Disc %</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subtotal</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    <select
                      value={item.item}
                      onChange={(e) => updateItem(index, 'item', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={isSubmitting}
                    >
                      <option value="">Pilih Item</option>
                      {availableItems.map(ai => (
                        <option key={ai._id} value={ai._id}>{ai.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.sku}
                      readOnly
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={isSubmitting}
                      min="1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.unit}
                      readOnly
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={isSubmitting}
                      min="0"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.discountPercent}
                      onChange={(e) => updateItem(index, 'discountPercent', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={isSubmitting}
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="px-4 py-2 text-sm font-medium">
                    {formatCurrency(item.subtotal || 0)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        
        <div className="max-w-md ml-auto space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount Total:</span>
            <span className="font-medium text-red-600">-{formatCurrency(summary.discountTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal After Discount:</span>
            <span className="font-medium">{formatCurrency(summary.subtotalAfterDiscount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax ({formData.taxRate}%):</span>
            <span className="font-medium">{formatCurrency(summary.tax)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t-2 border-gray-300">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-lg font-bold text-blue-600">{formatCurrency(summary.total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan tambahan..."
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Syarat dan ketentuan..."
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          onClick={() => handleSubmit(true)}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          onClick={() => handleSubmit(false)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save & Approve'}
        </button>
      </div>
    </div>
  );
};

export default PurchaseForm;