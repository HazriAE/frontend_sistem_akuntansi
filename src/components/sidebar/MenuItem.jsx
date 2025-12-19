import { MdChevronRight } from 'react-icons/md';

const MenuItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <li className="list-none">
      <button
        onClick={() => onClick(item)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-azko-error ${
          isActive === item.id ? 'bg-azko-error text-primary-content font-semibold' : 'text-base-content'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} />
          <span>{item.label}</span>
        </div>
      </button>
    </li>
  );
};

export default MenuItem;