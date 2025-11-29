import MenuItem from './MenuItem';

const Menu = ({ activeMenu, onMenuClick, menuData }) => {
  return (
    <ul className="w-full space-y-1 px-2 ">
      {menuData.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          isActive={activeMenu}
          onClick={onMenuClick}
        />
      ))}
    </ul>
  );
};

export default Menu;