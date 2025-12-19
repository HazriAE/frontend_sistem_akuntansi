import { 
  MdDashboard, 
  MdPeople, 
  MdLocalShipping, 
  MdShoppingCart, 
  MdAssessment, 
  MdSettings,
  MdAccountBalance,
  MdLibraryBooks,
  MdContacts,
  MdManageAccounts
} from 'react-icons/md';

// Menu utama tanpa submenu dropdown
export const menuData = [
  {
    id: 1,
    label: "Dashboard",
    icon: MdDashboard,
    path: "/dashboard"
  },
  {
    id: 10,
    label: "Contacts",
    icon: MdContacts,
    path: "/contacts"
  },
  {
    id: 2,
    label: "Purchase",
    icon: MdLocalShipping,
    path: "/purchase"
  },
  // {
  //   id: 3,
  //   label: "Supplier",
  //   icon: MdLocalShipping,
  //   path: "/supplier",
  //   // Tabs untuk halaman Supplier
  //   tabs: [
  //     { id: 31, label: "Daftar Supplier", path: "/supplier" },
  //     { id: 32, label: "Tambah Supplier", path: "/supplier/add" },
  //     { id: 33, label: "Kategori", path: "/supplier/category" }
  //   ]
  // },
  {
    id: 4,
    label: "Jurnal Entries",
    icon: MdLibraryBooks,
    path: "/jurnal_entries",
  },
  {
    id: 5,
    label: "Akun",
    icon: MdAccountBalance,
    path: "/accounts",
    tabs: [
      { id: 51, label: "Daftar Akun", path: "/accounts" },
    ]
  },
  {
    id: 6,
    label: "Laporan",
    icon: MdAssessment,
    path: "/reports",
    tabs: [
      { id: 61, label: "Overview", path: "/reports" },
      // { id: 62, label: "Penjualan", path: "/"}
      // { id: 63, label: "Neraca Saldo", path: "/reports/neraca-saldo" },
      // { id: 64, label: "Jurnal Umum", path: "/reports/jurnal-umum" },
      // { id: 65, label: "Laba Rugi", path: "/reports/profit-loss" }
    ]
  },
  {
    id: 7,
    label: "Pengaturan",
    icon: MdSettings,
    path: "/settings"
  },
  {
    id: 8,
    label: "Item Manajemen",
    icon: MdManageAccounts,
    path: 'item-manajemen'
  }
];