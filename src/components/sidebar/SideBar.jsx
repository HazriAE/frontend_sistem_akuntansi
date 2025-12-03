import { useState, useEffect } from 'react';
import Logo from './Logo';
import Menu from './Menu';
import UserProfile from './UserProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuData } from "./menuData.js";


const SideBar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   const findActiveMenu = () => {
  //     // Cari exact match dulu
  //     for (const menu of menuData) {
  //       if (menu.path === location.pathname) {
  //         return menu.id;
  //       }
  //     }
  //     let longestMatch = null;
  //     let longestMatchLength = 0;

  //     for (const menu of menuData) {
  //       if (location.pathname.startsWith(menu.path + '/')) {
  //         if (menu.path.length > longestMatchLength) {
  //           longestMatch = menu.id;
  //           longestMatchLength = menu.path.length;
  //         }
  //       }
  //     }

  //     return longestMatch;
  //   };

  //   setActiveMenu(findActiveMenu());
  // }, [location.pathname]);

  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    navigate(item.path);
  };

  return (
    <div className="w-64 h-screen bg-base-100 shadow-lg flex flex-col">
      <Logo />
      <div className="flex-1 overflow-y-auto py-4">
        <Menu activeMenu={activeMenu} onMenuClick={handleMenuClick} menuData={menuData} />
      </div>
      <UserProfile name="John Doe" role="Admin" />
    </div>
  );
};

export default SideBar;