import { useState } from 'react';
import { MdExpandMore } from 'react-icons/md'; 

const MenuItem = ({ item, isActive, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;

  if (item.type === "link") {
    return (
      <li
          href={item.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
            isActive === item.id ? 'bg-primary text-primary-content font-semibold' : 'text-base-content'
          }`}
          onClick={(e) => {
            
            e.preventDefault();
            onClick?.(item);
          }}
        >
        <Icon size={20} />
        <a>
          <span>{item.label}</span>
        </a>
      </li>
    );
  }

  if (item.type === "dropdown") {
    return (
      <li>
        <details open={isOpen} onToggle={(e) => setIsOpen(e.target.open)}>
          <summary className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer">
            <Icon size={20} />
            <span className="flex-1">{item.label}</span>
            <MdExpandMore 
              size={20} 
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </summary>
          <ul className="ml-4 mt-1 space-y-1">
            {item.submenu.map((subItem) => (
              <li key={subItem.id}                
                  href={subItem.path}
                  className={`flex gap-3 px-1 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive === subItem.id ? 'bg-primary text-primary-content font-semibold' : 'text-base-content'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    onClick?.(subItem);
                  }}
                >
                <a>
                  <span className="w-2 h-2 rounded-full bg-base-content/30 mr-3"></span>
                  {subItem.label}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </li>
    );
  }

  return null;
};

export default MenuItem;