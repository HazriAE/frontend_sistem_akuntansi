import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layouts/Layouts.jsx"
import Dashboard from "./Pages/Dashboard.jsx"
import AccountsList from './components/accounts/AccountsList.jsx';

// import Customer from './pages/Customer';
// import SupplierList from './pages/Supplier/SupplierList';
// import SupplierAdd from './pages/Supplier/SupplierAdd';
// import SupplierCategory from './pages/Supplier/SupplierCategory';
// import TransactionPurchase from './pages/Transaction/TransactionPurchase';
// import TransactionSales from './pages/Transaction/TransactionSales';
// import TransactionReturn from './pages/Transaction/TransactionReturn';
// import Reports from './pages/Reports';
// import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/customer" element={<Customer />} />
          
          <Route path="/supplier/list" element={<SupplierList />} />
          <Route path="/supplier/add" element={<SupplierAdd />} />
          <Route path="/supplier/category" element={<SupplierCategory />} />
          
          <Route path="/transaction/purchase" element={<TransactionPurchase />} />
          <Route path="/transaction/sales" element={<TransactionSales />} />
          <Route path="/transaction/return" element={<TransactionReturn />} />
          
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} /> */}

          <Route path='accounts/daftar_akun' element={<AccountsList />} />
        </Route>

        <Route path="*" element={<div className="p-8">404 - Halaman tidak ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;