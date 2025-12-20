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
    id: 2,
    label: "Contacts",
    icon: MdContacts,
    path: "/contacts"
  },
  {
    id: 3,
    label: "Jurnal Entries",
    icon: MdLibraryBooks,
    path: "/jurnal_entries",
  },
  {
    id: 4,
    label: "Akun",
    icon: MdAccountBalance,
    path: "/accounts",
    tabs: [
      { id: 51, label: "Daftar Akun", path: "/accounts" },
    ]
  },
  {
    id: 5,
    label: "Laporan",
    icon: MdAssessment,
    path: "/reports",
    tabs: [
      { id: 61, label: "Overview", path: "/reports" },
    ]
  },
];