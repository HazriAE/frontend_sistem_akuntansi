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