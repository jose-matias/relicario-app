import { Tooltip } from 'antd';
import React from 'react';
import { IconBaseProps } from 'react-icons/lib';

interface ButtonHeaderProps {
  title: string;
  color?: string;
  icon: React.ComponentType<IconBaseProps>;
  action(): void;
}

interface HeaderProps {
  title?: string;
  description?: string;
  buttons?: ButtonHeaderProps[];
}

const Header: React.FC<HeaderProps> = ({ buttons, description, title }) => {
  return (
    <header className=" bg-white shadow-sm p-3 flex space-y-2 sm:flex-row sm:space-y-2 sm:items-center sm:justify-between">
      <div className="container mx-auto space-x-2">
        {!buttons?.length && (
          <div className="flex flex-col lg:flex-row lg:space-x-2 lg:divide-x">
            <div className="px-2">
              <h2 className=" text-sm font-semibold text-gray-500 uppercase">
                {title}
              </h2>
            </div>
            <div className="px-2">
              <span className=" text-sm text-gray-400">{description}</span>
            </div>
          </div>
        )}
        {buttons?.map(({ icon: Icon, ...button }) => (
          <div className="flex gap-2 items-center">
            <Tooltip title={button.title}>
              <button
                onClick={button.action}
                className="p-2 shadow-sm border border-gray-200"
                type="button"
              >
                <span className="text-primary-500 text-base">
                  <Icon />
                </span>
              </button>
            </Tooltip>
            <span className=" text-sm font-semibold text-gray-500 uppercase">
              {button.title}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;
