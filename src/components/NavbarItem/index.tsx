import React, { useMemo } from 'react';
import { IconBaseProps } from 'react-icons/lib';
import { Link } from 'react-router-dom';

interface NavbarItemProps {
  path: string;
  icon?: React.ComponentType<IconBaseProps>;
  title?: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ path, title, icon: Icon }) => {
  const isActive = useMemo(() => {
    if (path === window.location.pathname) {
      return 'bg-black bg-opacity-25 text-green-300';
    }
    return '';
  }, [path]);

  return (
    <Link
      to={path}
      className={`p-1 lg:p-2 lg:px-4  rounded text-white hover:text-green-300 ${isActive}`}
    >
      <div className="flex flex-col lg:flex-row items-center truncate">
        {Icon && (
          <span className="text-md lg:mr-2">
            <Icon />
          </span>
        )}
        {!!title && (
          <span className="overflow-ellipsis text-xs lg:text-base ">
            {title}
          </span>
        )}
      </div>
    </Link>
  );
};

export default NavbarItem;
