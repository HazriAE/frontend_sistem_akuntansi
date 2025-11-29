import { 
  MdDashboard, 
  MdPeople, 
  MdLocalShipping, 
  MdShoppingCart, 
  MdAssessment, 
  MdSettings,
  MdAccountBalance
} from 'react-icons/md';

export const menuData = [
  {
    id: 1,
    label: "Dashboard",
    icon: MdDashboard,
    type: "link",
    path: "/dashboard"
  },
  {
    id: 2,
    label: "Customer",
    icon: MdPeople,
    type: "dropdown",
    submenu: [
      { id: 21, label: "Daftar Customers", path: "/customer/list"},
      { id: 22, label: "Tambah Customers", path: "/custmer/add"}
    ],
    path: "/customer"
  },
  {
    id: 3,
    label: "Supplier",
    icon: MdLocalShipping,
    type: "dropdown",
    submenu: [
      { id: 31, label: "Daftar Supplier", path: "/supplier/list" },
      { id: 32, label: "Tambah Supplier", path: "/supplier/add" },
      { id: 33, label: "Kategori Supplier", path: "/supplier/category" }
    ]
  },
  {
    id: 4,
    label: "Transaksi",
    icon: MdShoppingCart,
    type: "dropdown",
    submenu: [
      { id: 41, label: "Pembelian", path: "/transaction/purchase" },
      { id: 42, label: "Penjualan", path: "/transaction/sales" },
      { id: 43, label: "Retur", path: "/transaction/return" }
    ]
  },
  {
    id: 5,
    label: "Akun",
    icon: MdAccountBalance,
    type: "dropdown",
    submenu: [
      { id: 51, label: "Daftar Akun", path: "/accounts/daftar_akun" },
      { id: 52, label: "Kategori Akun", path: "/accounts/kategori" },
      { id: 53, label: "Jurnal Umum", path: "/accounts/jurnal_umum" }
    ]
  },
  {
    id: 6,
    label: "Laporan",
    icon: MdAssessment,
    type: "link",
    path: "/reports"
  },
  {
    id: 7,
    label: "Pengaturan",
    icon: MdSettings,
    type: "link",
    path: "/settings"
  }
];