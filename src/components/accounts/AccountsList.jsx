import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MdAdd, MdLock, MdMoreVert } from 'react-icons/md';
import DrawerAddAccount from "./DrawerAddAccount "
import PageWithTabs from "../PageWithTabs";
import api from '../../lib/axios';
import { data_offline } from '../../data/dataOflline';

const AccountsList = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const accounts = data_offline.akun.accounts

  const filteredAccounts = showArchived 
    ? accounts 
    : accounts.filter(acc => acc.aktif !== false);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAccounts(filteredAccounts.map(acc => acc._id));
    } else {
      setSelectedAccounts([]);
    }
  };

  const handleSelectAccount = (id) => {
    if (selectedAccounts.includes(id)) {
      setSelectedAccounts(selectedAccounts.filter(accId => accId !== id));
    } else {
      setSelectedAccounts([...selectedAccounts, id]);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getTipeAkunLabel = (tipe) => {
    const labels = {
      'aset': 'Aset',
      'liabilitas': 'Liabilitas',
      'ekuitas': 'Ekuitas',
      'pendapatan': 'Pendapatan',
      'beban': 'Beban'
    };
    return labels[tipe] || tipe;
  };

  const getKategoriLabel = (kategori) => {
    const labels = {
      'kas': 'Kas',
      'bank': 'Bank',
      'piutang': 'Piutang',
      'persediaan': 'Persediaan',
      'aset_tetap': 'Aset Tetap',
      'hutang': 'Hutang',
      'modal': 'Modal',
      'penjualan': 'Penjualan',
      'pembelian': 'Pembelian',
      'biaya_operasional': 'Biaya Operasional',
      'lainnya': 'Lainnya'
    };
    return labels[kategori] || kategori;
  };


  return (
    <PageWithTabs title="Daftar Akun" subtitle="Akun">
      <div className="drawer drawer-end">
        <input 
          id="drawer-add-account" 
          type="checkbox" 
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={(e) => setIsDrawerOpen(e.target.checked)}
        />
        
        <div className="drawer-content space-y-6">
          {/* Table */}
          <div className="card bg-base-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead className="bg-base-200">
                  <tr>
                    <th className="w-12">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="w-16">Status</th>
                    <th>Kode Akun</th>
                    <th>Nama Akun</th>
                    <th>Tipe Akun</th>
                    <th>Kategori</th>
                    <th>Saldo Normal</th>
                    <th className="text-right">Saldo Awal (IDR)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-base-content/60">
                        Tidak ada data akun
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((account) => (
                      <tr key={account._id} className="hover">
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={selectedAccounts.includes(account._id)}
                            onChange={() => handleSelectAccount(account._id)}
                          />
                        </td>
                        <td>
                          {account.aktif ? (
                            <span className="badge badge-success badge-sm">Aktif</span>
                          ) : (
                            <MdLock className="text-error" size={18} />
                          )}
                        </td>
                        <td className="font-mono text-sm">{account.kodeAkun}</td>
                        <td>
                          <button className="link link-primary font-medium text-left">
                            {account.namaAkun}
                          </button>
                        </td>
                        <td>
                          <span className="badge badge-ghost">
                            {getTipeAkunLabel(account.tipeAkun)}
                          </span>
                        </td>
                        <td>{getKategoriLabel(account.kategori)}</td>
                        <td>
                          <span className={`badge ${account.saldoNormal === 'debit' ? 'badge-info' : 'badge-warning'}`}>
                            {account.saldoNormal}
                          </span>
                        </td>
                        <td className="text-right font-mono">
                          {formatCurrency(account.saldoAwal)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Akun</div>
              <div className="stat-value text-primary">{filteredAccounts.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Akun Aktif</div>
              <div className="stat-value text-success">
                {accounts.filter(acc => acc.aktif !== false).length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Akun Diarsipkan</div>
              <div className="stat-value text-error">
                {accounts.filter(acc => acc.aktif === false).length}
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageWithTabs>
  );
};

export default AccountsList;