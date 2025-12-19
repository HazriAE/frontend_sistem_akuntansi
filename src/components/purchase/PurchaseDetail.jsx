import { 
  FiFileText, FiEdit, FiTrash2, FiCheck, FiX, FiCalendar, FiChevronLeft 
} from 'react-icons/fi';
import { 
  usePurchase, 
  useDeletePurchase, 
  useReceivePurchase, 
  useCancelPurchase 
} from '../../hooks/usePurchase';

const PurchaseDetail = ({ purchase, onBack, onEdit, formatDate, StatusBadge, formatCurrency }) => {
  const purchaseId = purchase?._id || purchase?.id;
  
  // Fetch full purchase details
  const { data, isLoading, isError } = usePurchase(purchaseId);
  const deleteMutation = useDeletePurchase();
  const receiveMutation = useReceivePurchase();
  const cancelMutation = useCancelPurchase();

  const purchaseData = data?.data || purchase;

  const calculateDaysUntilDue = () => {
    const due = new Date(purchaseData.dueDate);
    const today = new Date();
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diff > 0) return `${diff} days until due`;
    if (diff === 0) return 'Due today';
    return `${Math.abs(diff)} days overdue`;
  };

  const calculateSummary = () => {
    const items = purchaseData.items || [];
    const subtotal = items.reduce((sum, item) => {
      const itemSubtotal = (item.quantity * item.unitPrice) - (item.discountAmount || 0);
      return sum + itemSubtotal;
    }, 0);

    const tax = purchaseData.tax || 0;
    const total = purchaseData.totalAmount || 0;
    const paidAmount = purchaseData.paidAmount || 0;
    const remainingBalance = total - paidAmount;

    return {
      subtotal,
      tax,
      total,
      paidAmount,
      remainingBalance
    };
  };

  const summary = calculateSummary();

  const handleAction = async (action) => {
    const confirmMessages = {
      receive: 'Mark this purchase as received?',
      cancel: 'Cancel this purchase order?',
      delete: 'Delete this purchase order?'
    };

    if (window.confirm(confirmMessages[action])) {
      try {
        if (action === 'receive') {
          await receiveMutation.mutateAsync({ id: purchaseId });
          alert('Purchase marked as received');
        } else if (action === 'cancel') {
          const reason = prompt('Please enter cancellation reason:');
          if (reason) {
            await cancelMutation.mutateAsync({ id: purchaseId, reason });
            alert('Purchase cancelled');
          }
        } else if (action === 'delete') {
          await deleteMutation.mutateAsync(purchaseId);
          alert('Purchase deleted');
          onBack();
        }
      } catch (error) {
        alert(error.response?.data?.message || `Failed to ${action} purchase`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading purchase details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading purchase details. Please try again.
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
        <h1 className="text-3xl font-bold text-gray-900">Purchase Order Detail</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {purchaseData.purchaseNumber}
            </h2>
            <div className="flex gap-2">
              <StatusBadge status={purchaseData.status} />
              <StatusBadge status={purchaseData.paymentStatus} type="payment" />
            </div>
          </div>
          
          <div className="flex gap-2">
            {purchaseData.status === 'draft' && (
              <>
                <button
                  onClick={() => onEdit(purchaseData)}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleAction('delete')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
                  disabled={deleteMutation.isPending}
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
            {purchaseData.status === 'approved' && (
              <button
                onClick={() => handleAction('receive')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                disabled={receiveMutation.isPending}
              >
                <FiCheck className="w-4 h-4" />
                Mark as Received
              </button>
            )}
            {purchaseData.paymentStatus !== 'paid' && purchaseData.status !== 'cancelled' && (
              <button
                onClick={() => handleAction('cancel')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2"
                disabled={cancelMutation.isPending}
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
            )}
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
              <FiFileText className="w-4 h-4" />
              Print PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Supplier</h3>
            <p className="text-lg font-semibold text-gray-900">
              {purchaseData.supplier?.nama || 'N/A'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Purchase Date</h3>
            <p className="text-lg text-gray-900">{formatDate(purchaseData.purchaseDate)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
            <p className="text-lg text-gray-900">{formatDate(purchaseData.dueDate)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Days Until Due</h3>
            <p className={`text-lg font-semibold ${
              calculateDaysUntilDue().includes('overdue') ? 'text-red-600' : 'text-green-600'
            }`}>
              {calculateDaysUntilDue()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchaseData.items?.map((item, index) => {
                const itemSubtotal = (item.quantity * item.unitPrice) - (item.discountAmount || 0);
                return (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.item?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600 text-right">
                      -{formatCurrency(item.discountAmount || 0)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(itemSubtotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        
        <div className="max-w-md ml-auto space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span className="font-medium">{formatCurrency(summary.taxAmount)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t-2 border-gray-300">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-lg font-bold text-blue-600">{formatCurrency(summary.total)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-600">Paid Amount:</span>
            <span className="font-medium text-green-600">{formatCurrency(summary.paidAmount)}</span>
          </div>
          <div className="flex justify-between pb-3">
            <span className="text-lg font-bold text-red-600">Remaining Balance:</span>
            <span className="text-lg font-bold text-red-600">{formatCurrency(summary.remainingBalance)}</span>
          </div>
        </div>
      </div>

      {purchaseData.notes && (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <p className="text-gray-700">{purchaseData.notes}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Activity Timeline</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
            </div>
            <div className="pb-4">
              <p className="font-medium text-gray-900">Purchase Created</p>
              <p className="text-sm text-gray-500">
                Created at {formatDate(purchaseData.createdAt || purchaseData.purchaseDate)}
              </p>
            </div>
          </div>
          
          {purchaseData.status !== 'draft' && (
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheck className="w-5 h-5 text-green-600" />
                </div>
                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
              </div>
              <div className="pb-4">
                <p className="font-medium text-gray-900">Approved</p>
                <p className="text-sm text-gray-500">Status changed to approved</p>
              </div>
            </div>
          )}
          
          {purchaseData.status === 'received' && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <FiCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Received</p>
                <p className="text-sm text-gray-500">Items received and stock updated</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetail;