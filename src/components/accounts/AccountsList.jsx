import { useState } from 'react';
import { MdAdd, MdLock, MdLockOpen, MdMoreVert } from 'react-icons/md';

const AccountsList = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  // Data dummy akun
  const accounts = [
    {
      id: 1,
      kode: '1-10001',
      nama: 'Kas',
      kategori: 'Kas & Bank',
      pengguna: 'all',
      pajak: '',
      saldo: 200000.00,
      isLocked: true,
      isArchived: false
    },
    {
      id: 2,
      kode: '1-10002',
      nama: 'Rekening Bank',
      kategori: 'Kas & Bank',
      pengguna: 'all',
      pajak: '',
      saldo: 0.00,
      isLocked: false,
      isArchived: false
    },
    {
      id: 3,
      kode: '1-10003',
      nama: 'Giro',
      kategori: 'Kas & Bank',
      pengguna: 'all',
      pajak: '',
      saldo: 0.00,
      isLocked: false,
      isArchived: false
    },
    {
      id: 4,
      kode: '1-10100',
      nama: 'Piutang Usaha',
      kategori: 'Akun Piutang',
      pengguna: 'all',
      pajak: '',
      saldo: 0.00,
      isLocked: true,
      hasSubAccount: true,
      isArchived: false
    }
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAccounts(accounts.map(acc => acc.id));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-base-content/60 mb-1">Akun</p>
          <h1 className="text-3xl font-bold text-base-content">Daftar Akun</h1>
        </div>
        <div className="flex gap-3">

          <button className="flex btn btn-info">
            <MdAdd size={20} />
            Buat Akun Baru
          </button>
          <button className="flex btn btn-info">
            <MdAdd size={20} />
            Buat Jurnal Umum
          </button>
        </div>
      </div>

      {/* Filter & Actions */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <div className="flex justify-between items-center">
            <div className="form-control">
              <label className="label cursor-pointer gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                />
                <span className="label-text font-medium">Tampilkan Arsip Akun</span>
              </label>
            </div>
            <button className="btn btn-primary">
              <span>Tindakan</span>
              <MdMoreVert size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Info Saldo */}
      <div className="alert alert-info">
        <span className="text-sm">
          Saldo di bawah berdasarkan tanggal <strong>29/11/2025</strong>, kecuali ada pernyataan lain
        </span>
      </div>

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
                    checked={selectedAccounts.length === accounts.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="w-16">Kunci</th>
                <th>Kode Akun</th>
                <th>Nama Akun</th>
                <th>Kategori Akun</th>
                <th>Pengguna</th>
                <th>Pajak</th>
                <th className="text-right">Saldo (dalam IDR)</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="hover">
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedAccounts.includes(account.id)}
                      onChange={() => handleSelectAccount(account.id)}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {account.isLocked ? (
                        <MdLock className="text-base-content/60" size={18} />
                      ) : (
                        <span className="text-base-content/30">–</span>
                      )}
                      {account.hasSubAccount && (
                        <MdAdd className="text-base-content/60" size={18} />
                      )}
                    </div>
                  </td>
                  <td className="font-mono text-sm">{account.kode}</td>
                  <td>
                    <a href="#" className="link link-primary font-medium">
                      {account.nama}
                    </a>
                  </td>
                  <td>
                    <a href="#" className="link link-primary">
                      {account.kategori}
                    </a>
                  </td>
                  <td className="text-base-content/60">{account.pengguna}</td>
                  <td className="text-base-content/60">{account.pajak || '–'}</td>
                  <td className="text-right font-mono">
                    {formatCurrency(account.saldo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountsList;