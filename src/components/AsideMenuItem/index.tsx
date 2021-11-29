import React, { useMemo } from 'react';
import { IconBaseProps } from 'react-icons/lib';
import { Link } from 'react-router-dom';

interface AsideMenuItemProps {
  path: string;
  icon?: React.ComponentType<IconBaseProps>;
  title?: string;
}

const AsideMenuItem: React.FC<AsideMenuItemProps> = ({
  path,
  title,
  icon: Icon,
}) => {
  const isActive = useMemo(() => {
    if (path === window.location.pathname) {
      return 'border-r-2 border-green-600 text-green-600 bg-green-50';
    }
    return '';
  }, [path]);

  return (
    <Link
      to={path}
      className={`flex flex-1 p-2 px-4  hover:text-green-700 ${isActive}`}
    >
      <div className="flex flex-row items-center truncate">
        {Icon && (
          <span className="mr-2">
            <Icon />
          </span>
        )}
        {!!title && <span className="overflow-ellipsis">{title}</span>}
      </div>
    </Link>
  );
};

export default AsideMenuItem;
