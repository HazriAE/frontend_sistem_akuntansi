import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layouts/Layouts";
import Dashboard from './Pages/Dashboard';
import AccountsList from "./components/accounts/AccountsList";
import JurnalUmum from './Pages/JurnalUmum';
import JournalEntryForm from './Pages/JournalEntryForm';
import ProfitLoss from './Pages/Reports/LabaRugi';
import Overviews from './Pages/Reports/Overviews';
import LaporanJurnal from './Pages/Reports/LaporanJurnal';
import BukuBesarTable from './Pages/Reports/BukuBesarTable';
import NeracaSaldo from './Pages/Reports/NeracaSaldo';  
import LaporanPerubahanEkuitas from './Pages/Reports/PerubahanEquitas';
import Settings from './Pages/Settings';
import LaporanArusKas from './Pages/Reports/LaporanArusKas';
import Contacts from './Pages/Contacts';
import LabaRugi from './Pages/Reports/LabaRugi';
import Purchase from './Pages/Purchase';
import ItemManagement from './Pages/ItemManagement ';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* <Route path="/customer" element={<Customer />} />
          <Route path="/supplier" element={<Supplier />} /> */}

          <Route path="/jurnal_entries" element={<JurnalUmum />} />
          <Route path="/journal_entries/new" element={<JournalEntryForm />} />

          <Route path='/contacts' element={<Contacts />} />

          <Route path="/reports" element={<Overviews />} />
          <Route path="/reports/profit-loss" element={<ProfitLoss />} />
          <Route path='/reports/jurnal-umum' element={<LaporanJurnal />} />
          <Route path='/reports/neraca-saldo' element={<NeracaSaldo />} />
          <Route path='/reports/buku-besar' element={<BukuBesarTable />} />
          <Route path='/reports/perubahan-equitas' element={<LaporanPerubahanEkuitas />} />
          <Route path='/reports/arus-kas' element={<LaporanArusKas />} />
          <Route path='/reports/laba-rugi-multistep' element={<LabaRugi />} />

          <Route path='/purchase' element={<Purchase />} />

          <Route path='item-manajemen' element={<ItemManagement />} />
          
          {/* Accounts Routes - Path utama langsung ke list */}
          <Route path="/accounts" element={<AccountsList />} />

          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<div className="p-8">404 - Halaman tidak ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;