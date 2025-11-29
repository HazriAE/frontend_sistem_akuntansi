import { useLocation } from 'react-router-dom';
import { menuData } from './sidebar/menuData';
import TabNavigation from './sidebar/TabNavigation'; 

const PageWithTabs = ({ children, title, subtitle }) => {
  const location = useLocation();

  const currentMenu = menuData.find(menu => 
    location.pathname === menu.path || 
    location.pathname.startsWith(menu.path + '/')
  );

  return (
    <div className="space-y-6">
      {(title || subtitle) && (
        <div>
          {subtitle && <p className="text-sm text-base-content/60 mb-1">{subtitle}</p>}
          {title && <h1 className="text-3xl font-bold text-base-content">{title}</h1>}
        </div>
      )}

      {currentMenu?.tabs && <TabNavigation tabs={currentMenu.tabs} />}

      {children}
    </div>
  );
};

export default PageWithTabs;