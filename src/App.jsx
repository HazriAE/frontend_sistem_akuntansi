import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layouts/Layouts";
import Dashboard from './Pages/Dashboard';
import Customer from './Pages/Customer';
// import SupplierList from './pages/Supplier/SupplierList';
// import SupplierAdd from './pages/Supplier/SupplierAdd';
// import SupplierCategory from './pages/Supplier/SupplierCategory';
// import TransactionPurchase from './pages/Transaction/TransactionPurchase';
// import TransactionSales from './pages/Transaction/TransactionSales';
// import TransactionReturn from './pages/Transaction/TransactionReturn';
// import AccountsCategory from './pages/Accounts/AccountsCategory';
// import JournalEntry from './pages/Accounts/JournalEntry';
import AccountsList from "./components/accounts/AccountsList";
import JurnalUmum from './Pages/JurnalUmum';
import JournalEntryForm from './Pages/JournalEntryForm';
import ProfitLoss from './Pages/Reports/ProfitLoss';
import Overviews from './Pages/Reports/Overviews';
import TrialBalance from './Pages/Reports/NeracaSaldo';
import LaporanJurnal from './Pages/Reports/LaporanJurnal';
import BukuBesarTable from './Pages/Reports/BukuBesarTable';
import NeracaSaldo from './Pages/Reports/NeracaSaldo';  
import LaporanPerubahanEkuitas from './Pages/Reports/PerubahanEquitas';
import Settings from './Pages/Settings';
import Supplier from './Pages/Supplier';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/jurnal_entries" element={<JurnalUmum />} />
          <Route path="/journal_entries/new" element={<JournalEntryForm />} />

          <Route path="/reports" element={<Overviews />} />
          <Route path="/reports/profit-loss" element={<ProfitLoss />} />
          <Route path='/reports/jurnal-umum' element={<LaporanJurnal />} />
          <Route path='/reports/neraca-saldo' element={<NeracaSaldo />} />
          <Route path='/reports/buku-besar' element={<BukuBesarTable />} />
          <Route path='/reports/perubahan-equitas' element={<LaporanPerubahanEkuitas />} />

          
          {/* Supplier Routes - Path utama langsung ke list */}
          <Route path="/supplier" element={<Supplier />} />
          {/* <Route path="/supplier/add" element={<SupplierAdd />} />
          <Route path="/supplier/category" element={<SupplierCategory />} />  */}
          
          {/* Transaction Routes */}
          {/* <Route path="/transaction/purchase" element={<TransactionPurchase />} />
          <Route path="/transaction/sales" element={<TransactionSales />} />
          <Route path="/transaction/return" element={<TransactionReturn />} /> */}
          
          {/* Accounts Routes - Path utama langsung ke list */}
          <Route path="/accounts" element={<AccountsList />} />
          {/* <Route path="/accounts/kategori" element={<AccountsCategory />} />
          <Route path="/accounts/jurnal_umum" element={<JournalEntry />} /> */}
          
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<div className="p-8">404 - Halaman tidak ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;