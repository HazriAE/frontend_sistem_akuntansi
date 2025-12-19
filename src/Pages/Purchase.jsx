import { useState } from 'react';
import api from '../lib/axios';
import PurchaseForm from '../components/purchase/PurchaseForm';
import PurchaseList from '../components/purchase/PurchaseList';
import PurchaseDetail from '../components/purchase/PurchaseDetail';

// Mock API base URL
const API_BASE = api;

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Status Badge Component
const StatusBadge = ({ status, type = 'status' }) => {
  const statusConfig = {
    status: {
      draft: 'bg-gray-200 text-gray-800',
      approved: 'bg-green-200 text-green-800',
      received: 'bg-blue-200 text-blue-800',
      cancelled: 'bg-red-200 text-red-800'
    },
    payment: {
      unpaid: 'bg-red-200 text-red-800',
      partial: 'bg-yellow-200 text-yellow-800',
      paid: 'bg-green-200 text-green-800'
    }
  };

  const config = type === 'payment' ? statusConfig.payment : statusConfig.status;
  const colorClass = config[status?.toLowerCase()] || 'bg-gray-200 text-gray-800';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {status}
    </span>
  );
};

// Main App Component
const Purchase = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const handleViewDetail = (purchase) => {
    setSelectedPurchase(purchase);
    setCurrentView('detail');
  };

  const handleEdit = (purchase) => {
    setSelectedPurchase(purchase);
    setCurrentView('form');
  };

  const handleCreateNew = () => {
    setSelectedPurchase(null);
    setCurrentView('form');
  };

  const handleBack = () => {
    setSelectedPurchase(null);
    setCurrentView('list');
  };

  const handleSave = (data) => {
    console.log('Saving purchase:', data);
    alert('Purchase saved successfully!');
    setCurrentView('list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'list' && (
        <PurchaseList
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onCreateNew={handleCreateNew}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          StatusBadge={StatusBadge}
        />
      )}
      
      {currentView === 'form' && (
        <PurchaseForm
          purchase={selectedPurchase}
          onBack={handleBack}
          onSave={handleSave}
          formatCurrency={formatCurrency}
        />
      )}
      
      {currentView === 'detail' && selectedPurchase && (
        <PurchaseDetail
          purchase={selectedPurchase}
          onBack={handleBack}
          onEdit={handleEdit}
          formatDate={formatDate}
          StatusBadge={StatusBadge}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
};

export default Purchase;