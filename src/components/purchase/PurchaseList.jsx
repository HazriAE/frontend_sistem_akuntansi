import { useState } from 'react';
import { 
  FiSearch, FiPlus, FiDownload, FiFileText, FiEdit, FiTrash2, 
  FiEye, FiCheck, FiX, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import { 
  usePurchases, 
  useDeletePurchase, 
  useApprovePurchase 
} from '../../hooks/usePurchase';

const PurchaseList = ({ onViewDetail, onEdit, onCreateNew, formatDate, formatCurrency, StatusBadge }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    supplier: '',
    status: '',
    paymentStatus: '',
    startDate: '',
    endDate: ''
  });

  // Build query params
  const queryParams = {
    ...(filters.supplier && { supplier: filters.supplier }),
    ...(filters.status && { status: filters.status }),
    ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate })
  };

  // Fetch purchases
  const { data, isLoading, isError, error } = usePurchases(queryParams);
  const deleteMutation = useDeletePurchase();
  const approveMutation = useApprovePurchase();

  const purchases = data?.data || [];

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus purchase ini?')) {
      try {
        await deleteMutation.mutateAsync(id);
        alert('Purchase berhasil dihapus');
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus purchase');
      }
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Approve purchase ini?')) {
      try {
        await approveMutation.mutateAsync({ id });
        alert('Purchase berhasil di-approve');
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal approve purchase');
      }
    }
  };

  // Client-side search
  const filteredPurchases = purchases.filter(purchase => {
    const matchSearch = purchase.purchaseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       purchase.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.ceil(filteredPurchases.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = filteredPurchases.slice(startIndex, startIndex + perPage);

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error.response?.data?.message || error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Orders</h1>
        <p className="text-gray-600">Kelola semua purchase order Anda</p>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari purchase number atau supplier..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
          >
            <option value="">Semua Payment Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>

          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            placeholder="Start Date"
          />

          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            placeholder="End Date"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FiPlus className="w-5 h-5" />
            Create New Purchase
          </button>
          
          <div className="flex gap-2">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
              <FiDownload className="w-5 h-5" />
              Export Excel
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
              <FiFileText className="w-5 h-5" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                paginatedData.map((purchase) => (
                  <tr key={purchase._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {purchase.purchaseNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.supplier?.nama || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(purchase.purchaseDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(purchase.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(purchase.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={purchase.paymentStatus} type="payment" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={purchase.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewDetail(purchase)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="View"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        {purchase.status === 'draft' && (
                          <>
                            <button
                              onClick={() => onEdit(purchase)}
                              className="text-yellow-600 hover:text-yellow-800 transition"
                              title="Edit"
                              disabled={deleteMutation.isPending}
                            >
                              <FiEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(purchase._id)}
                              className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                              title="Delete"
                              disabled={deleteMutation.isPending}
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleApprove(purchase._id)}
                              className="text-green-600 hover:text-green-800 transition disabled:opacity-50"
                              title="Approve"
                              disabled={approveMutation.isPending}
                            >
                              <FiCheck className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-700">
              entries (Showing {startIndex + 1} to {Math.min(startIndex + perPage, filteredPurchases.length)} of {filteredPurchases.length})
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseList;