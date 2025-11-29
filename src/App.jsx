import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layouts/Layouts";
import Dashboard from './pages/Dashboard';
import Customer from './Pages/Customer';
// import SupplierList from './pages/Supplier/SupplierList';
// import SupplierAdd from './pages/Supplier/SupplierAdd';
// import SupplierCategory from './pages/Supplier/SupplierCategory';
// import TransactionPurchase from './pages/Transaction/TransactionPurchase';
// import TransactionSales from './pages/Transaction/TransactionSales';
// import TransactionReturn from './pages/Transaction/TransactionReturn';
// import AccountsCategory from './pages/Accounts/AccountsCategory';
// import JournalEntry from './pages/Accounts/JournalEntry';
// import Reports from './pages/Reports';
// import Settings from './pages/Settings';
import AccountsList from "./components/accounts/AccountsList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customer" element={<Customer />} />
          
          {/* Supplier Routes - Path utama langsung ke list */}
          {/* <Route path="/supplier" element={<SupplierList />} />
          <Route path="/supplier/add" element={<SupplierAdd />} />
          <Route path="/supplier/category" element={<SupplierCategory />} /> */}
          
          {/* Transaction Routes */}
          {/* <Route path="/transaction/purchase" element={<TransactionPurchase />} />
          <Route path="/transaction/sales" element={<TransactionSales />} />
          <Route path="/transaction/return" element={<TransactionReturn />} /> */}
          
          {/* Accounts Routes - Path utama langsung ke list */}
          <Route path="/accounts" element={<AccountsList />} />
          {/* <Route path="/accounts/kategori" element={<AccountsCategory />} />
          <Route path="/accounts/jurnal_umum" element={<JournalEntry />} /> */}
          
          {/* <Route path="/reports" element={<Reports />} /> */}
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Route>

        <Route path="*" element={<div className="p-8">404 - Halaman tidak ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;