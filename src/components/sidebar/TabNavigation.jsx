import { useNavigate, useLocation } from 'react-router-dom';

const TabNavigation = ({ tabs }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className="border-b border-base-300 mb-6">
      <div role="tablist" className="tabs tabs-bordered">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            className={`tab ${location.pathname === tab.path ? 'tab-active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;