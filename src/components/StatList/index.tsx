import React from 'react';
import { IconBaseProps } from 'react-icons/lib';

interface StatItem {
  key: string;
  title: string;
  value: string;
  color: string;
  icon?: React.ComponentType<IconBaseProps>;
}

interface StatListProps {
  title: string;
  items: StatItem[];
  loading?: boolean;
}

const StatList: React.FC<StatListProps> = ({ title, items, loading }) => {
  return (
    <div className="p-5 bg-white relative shadow-sm rounded-md">
      <span className="mb-2 text-gray-400">{title}</span>
      {loading ? (
        <>
          {['1', '2', '3'].map(item => (
            <div key={item} className="flex mt-2 items-center justify-between">
              <div className="flex flex-1 space-x-4">
                <div className="h-4 mb-1 w-6 rounded bg-gray-100 animate-pulse" />
                <div className="h-4 mb-1 w-1/2 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="h-5  w-6 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </>
      ) : (
        <>
          {items.map(({ icon: Icon, ...item }) => (
            <div
              key={item.key}
              className="py-1  flex items-center  justify-between"
            >
              <div className="flex items-center space-x-2 ">
                {Icon ? (
                  <Icon className={`text-lg text-${item.color}-500`} />
                ) : (
                  <div
                    className={`w-3 h-3 rounded-full text-lg bg-${item.color}-500`}
                  />
                )}
                <span>{item.title}</span>
              </div>
              <strong>{item.value}</strong>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default StatList;
