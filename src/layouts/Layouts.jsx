import { Outlet } from 'react-router-dom';
import SideBar from '../components/sidebar/SideBar.jsx';

const Layout = () => {
  return (
    <div className="flex h-screen bg-base-200">
      <SideBar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;